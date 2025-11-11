import OpenAI from 'openai';
import {
  CustomerInsights,
  UserProfile,
  RawCustomerData,
  SupplierPlan,
} from './types';
import { PlanWithCost } from './fitScore';

// ============================================================================
// OpenAI Client Setup
// ============================================================================

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 0, // Disable retries to prevent delays
      timeout: 30000, // 30 second timeout
    })
  : null;

// ============================================================================
// Plan Explanation Generation
// ============================================================================

export async function generatePlanExplanation(
  customer: RawCustomerData,
  profile: UserProfile,
  insights: CustomerInsights,
  plan: PlanWithCost & SupplierPlan,
  savings: number
): Promise<string> {
  // If OpenAI is not configured or in demo mode, use fallback
  if (!openai || process.env.DEMO_MODE === 'true') {
    return generateFallbackExplanation(insights, plan, savings);
  }

  try {
    const startTime = Date.now();
    console.log(`[OpenAI] Starting call for plan: ${plan.plan_name} at ${new Date().toISOString()}`);

    const prompt = buildPlanExplanationPrompt(customer, profile, insights, plan, savings);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 80, // Reduced for 2 sentences (~40 tokens each)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`[OpenAI] Completed call for plan: ${plan.plan_name} in ${duration}ms at ${new Date().toISOString()}`);

    const explanation = response.choices[0].message.content?.trim();

    if (!explanation) {
      console.warn('OpenAI returned empty explanation, using fallback');
      return generateFallbackExplanation(insights, plan, savings);
    }

    return explanation;
  } catch (error) {
    console.error('OpenAI API failed for plan explanation:', error);
    return generateFallbackExplanation(insights, plan, savings);
  }
}

/**
 * Build prompt for plan explanation
 */
function buildPlanExplanationPrompt(
  customer: RawCustomerData,
  profile: UserProfile,
  insights: CustomerInsights,
  plan: PlanWithCost & SupplierPlan,
  savings: number
): string {
  const currentPlan = customer.current_plan;

  // Determine main issue
  let mainIssue = '';
  if (insights.customer_segment === 'loyalty_penalty_victim') {
    mainIssue = `Rate has increased ${insights.financial_analysis.rate_trend.total_increase_pct}% over ${insights.financial_analysis.years_on_current_plan} years`;
  } else if (insights.customer_segment === 'variable_rate_victim') {
    mainIssue = 'Variable rates spike during high-usage months';
  } else if (insights.customer_segment === 'solar_buyback_victim') {
    mainIssue = `Poor solar buyback rate of $${currentPlan.rate_per_kwh_buyback}/kWh`;
  } else if (insights.customer_segment === 'ev_owner_flat_rate') {
    mainIssue = 'EV charging on flat-rate plan (not time-of-use optimized)';
  } else if (insights.customer_segment === 'pool_owner_peak_usage') {
    mainIssue = 'Pool equipment running during peak hours';
  }

  // Build feature list
  const features = [];
  if (plan.renewable_percentage === 100) {
    features.push('100% renewable energy');
  }
  if (plan.monthly_fee === 0) {
    features.push('No monthly fee');
  }
  if (plan.solar_buyback_rate && plan.solar_buyback_rate > 0.10) {
    features.push(`Excellent solar buyback at $${plan.solar_buyback_rate}/kWh`);
  }
  if (plan.time_of_use) {
    features.push('Time-of-use rates reward off-peak usage');
  }

  return `You are an energy plan recommendation expert writing personalized explanations for customers.

## Customer Context

**Name:** ${profile.personal.display_name}
**Current Situation:**
- Usage Pattern: ${insights.usage_analysis.pattern_description}
- Current Plan: ${currentPlan.plan_name} by ${currentPlan.provider}
- Current Rate: $${currentPlan.rate_per_kwh}/kWh + $${currentPlan.monthly_fee}/month
- Current Annual Cost: $${insights.financial_analysis.current_annual_cost}
- Time on Plan: ${insights.financial_analysis.years_on_current_plan} years
- Main Issue: ${mainIssue}

**Customer Priorities:**
- Primary Concern: ${profile.preferences.primary_concern}
- Renewable Preference: ${profile.preferences.renewable_priority}
- Max Contract: ${profile.preferences.max_contract_months} months

## Recommended Plan

**Plan:** ${plan.plan_name} by ${plan.provider}
**Rate:** $${plan.rate_per_kwh || plan.rate_per_kwh_base}/kWh + $${plan.monthly_fee}/month
**Structure:** ${plan.rate_structure}
**Projected Annual Cost:** $${plan.projected_cost}
**Annual Savings:** $${savings}
**Renewable:** ${plan.renewable_percentage}%
**Contract:** ${plan.contract_length_months} months
**Key Features:**
${features.map((f) => `- ${f}`).join('\n')}

## Your Task

Generate a clear, friendly 2-sentence explanation for why this plan is recommended for THIS specific customer.

## Requirements

1. **Reference the customer's specific situation** - Use their actual usage pattern or current pain point
2. **Highlight the most compelling benefit** - Savings amount, renewable %, or key feature like flexibility
3. **If month-to-month contract** - Emphasize the no-commitment flexibility advantage over locked contracts
4. **Use plain language** - Avoid jargon
5. **Be conversational** - Write like you're talking to a friend
6. **Keep it brief** - Exactly 2 sentences, no more

Generate the explanation now. Return ONLY the 2-sentence explanation. Do not include labels, JSON, or any formatting.`;
}

/**
 * Fallback explanation generator (template-based, no AI)
 */
function generateFallbackExplanation(
  insights: CustomerInsights,
  plan: SupplierPlan & { projected_cost: number },
  savings: number
): string {
  const renewable = plan.renewable_percentage;
  const monthlyFee = plan.monthly_fee;

  let explanation = '';

  // Opening based on customer segment
  if (insights.customer_segment === 'loyalty_penalty_victim') {
    explanation += `After ${insights.financial_analysis.years_on_current_plan} years on the same plan, switching locks in better rates. `;
  } else if (insights.customer_segment === 'variable_rate_victim') {
    explanation += `This fixed-rate plan eliminates the uncertainty of seasonal rate spikes. `;
  } else if (insights.customer_segment === 'solar_buyback_victim') {
    explanation += `Better solar buyback rates maximize the value of your excess generation. `;
  } else {
    explanation += `Based on your usage pattern, this plan offers excellent value. `;
  }

  // Savings
  explanation += `You'll save $${Math.round(savings)} annually compared to your current plan. `;

  // Renewable highlight
  if (renewable === 100) {
    explanation += `Plus, you'll be powered by 100% renewable energy.`;
  } else if (renewable >= 75) {
    explanation += `It's ${renewable}% renewable energy, aligning with your preferences.`;
  }

  // Monthly fee highlight
  if (monthlyFee === 0 && savings > 100) {
    explanation += ` With no monthly fee, that adds up to even more savings.`;
  }

  return explanation.trim();
}

// ============================================================================
// Batch Explanation Generation (for top 3 plans)
// ============================================================================

export async function generateBatchExplanations(
  customer: RawCustomerData,
  profile: UserProfile,
  insights: CustomerInsights,
  plans: (PlanWithCost & SupplierPlan)[]
): Promise<string[]> {
  console.log(`[OpenAI Batch] Starting batch of ${plans.length} calls at ${new Date().toISOString()}`);
  const batchStartTime = Date.now();

  const promises = plans.map((plan) => {
    const savings = insights.financial_analysis.current_annual_cost - plan.projected_cost;
    return generatePlanExplanation(customer, profile, insights, plan, savings);
  });

  const results = await Promise.all(promises);

  const batchEndTime = Date.now();
  const batchDuration = batchEndTime - batchStartTime;
  console.log(`[OpenAI Batch] Completed all ${plans.length} calls in ${batchDuration}ms at ${new Date().toISOString()}`);

  return results;
}

// ============================================================================
// Check OpenAI Availability
// ============================================================================

export function isOpenAIConfigured(): boolean {
  return openai !== null;
}

export function getAISource(): string {
  if (!isOpenAIConfigured()) {
    return 'fallback_template';
  }
  if (process.env.DEMO_MODE === 'true') {
    return 'demo_mode_fallback';
  }
  return 'openai_gpt4o_mini';
}
