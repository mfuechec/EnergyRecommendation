import {
  RecommendationRequest,
  RecommendationResponse,
  PlanRecommendation,
  BehaviorOpportunity,
  FinancialImpact,
} from './types';
import { loadEnrichedCustomer, loadSupplierPlans } from './dataLoader';
import { calculateProjectedCost } from './calculations';
import { filterPlans, scoreAndRankPlans, PlanWithCost, ScoredPlan } from './fitScore';
import { generateBatchExplanations, getAISource } from './openai';
import { detectBehaviorOpportunities } from './behaviorDetection';

// ============================================================================
// Main Recommendation Engine
// ============================================================================

export async function generateRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Load all data layers
  const customer = await loadEnrichedCustomer(request.customer_id);
  const { raw_data, profile, insights } = customer;

  // Override preferences if provided in request
  if (request.preferences) {
    if (request.preferences.priority) {
      profile.preferences.primary_concern = request.preferences.priority;
    }
    if (request.preferences.renewable_preference) {
      profile.preferences.renewable_priority = request.preferences.renewable_preference;
    }
    if (request.preferences.max_contract_months !== undefined) {
      profile.preferences.max_contract_months = request.preferences.max_contract_months;
    }
  }

  // 2. Load supplier plans
  const allPlans = await loadSupplierPlans(raw_data.service_address.zip_code);

  // 3. Filter plans based on preferences
  const eligiblePlans = filterPlans(allPlans, profile, insights);

  // 4. Calculate projected costs for all eligible plans
  const plansWithCosts: PlanWithCost[] = eligiblePlans.map((plan) => {
    const projectedCost = calculateProjectedCost(raw_data.usage_history, plan, profile);

    return {
      ...plan,
      projected_cost: projectedCost,
    };
  });

  // 5. Score and rank plans
  const scoredPlans = scoreAndRankPlans(plansWithCosts, insights, profile);

  // 6. Take top 3
  const top3 = scoredPlans.slice(0, 3);

  // 7. Generate AI explanations (parallel)
  const explanations = await generateBatchExplanations(raw_data, profile, insights, top3);

  // 8. Build plan recommendations
  const recommendations: PlanRecommendation[] = top3.map((plan, index) => {
    const savings = insights.financial_analysis.current_annual_cost - plan.projected_cost;

    return buildPlanRecommendation(plan, index + 1, savings, explanations[index]);
  });

  // 9. Detect behavior optimization opportunities
  const behaviorSuggestions = detectBehaviorOpportunities(
    profile,
    raw_data,
    insights,
    top3[0] // Best recommended plan
  );

  // 10. Analyze current plan
  const currentPlanAnalysis = {
    overpaying_estimate: insights.financial_analysis.vs_market_average.estimated_annual_overpayment,
    vs_market_average_pct: insights.financial_analysis.vs_market_average.overpaying_pct,
    rate_trend: insights.financial_analysis.rate_trend.direction,
    loyalty_penalty:
      insights.financial_analysis.years_on_current_plan >= 3 &&
      insights.financial_analysis.rate_trend.increases_count >= 2
        ? `You've experienced ${insights.financial_analysis.rate_trend.increases_count} rate increases totaling ${insights.financial_analysis.rate_trend.total_increase_pct}% over ${insights.financial_analysis.years_on_current_plan} years`
        : '',
  };

  // 11. Build metadata
  const metadata = {
    plans_analyzed: eligiblePlans.length,
    plans_excluded: allPlans.length - eligiblePlans.length,
    exclusion_reasons: buildExclusionReasons(allPlans, eligiblePlans, profile),
    ai_explanation_source: getAISource(),
    fallback_used: getAISource() !== 'openai_gpt4',
  };

  const processingTime = Date.now() - startTime;

  return {
    request_id: requestId,
    generated_at: new Date().toISOString(),
    processing_time_ms: processingTime,
    customer_summary: {
      customer_id: request.customer_id,
      display_name: profile.personal.display_name,
      current_annual_cost: insights.financial_analysis.current_annual_cost,
      avg_monthly_kwh: insights.usage_analysis.avg_monthly_kwh,
      years_on_plan: insights.financial_analysis.years_on_current_plan,
    },
    top_recommendations: recommendations,
    behavior_suggestions: behaviorSuggestions,
    current_plan_analysis: currentPlanAnalysis,
    metadata,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildPlanRecommendation(
  plan: ScoredPlan,
  rank: number,
  savings: number,
  explanation: string
): PlanRecommendation {
  const financialImpact: FinancialImpact = {
    projected_annual_cost: plan.projected_cost,
    annual_savings: Math.round(savings * 100) / 100,
    monthly_savings: Math.round((savings / 12) * 100) / 100,
    savings_percentage: Math.round((savings / (plan.projected_cost + savings)) * 10000) / 100,
    payback_period_months: null,
    total_5yr_savings: Math.round(savings * 5 * 100) / 100,
  };

  const keyBenefits = [];

  // Savings benefit
  if (savings > 100) {
    keyBenefits.push(`Save $${Math.round(savings)} annually compared to current plan`);
  }

  // Renewable benefit
  if (plan.renewable_percentage === 100) {
    keyBenefits.push('100% renewable energy');
  } else if (plan.renewable_percentage >= 75) {
    keyBenefits.push(`${plan.renewable_percentage}% renewable energy`);
  }

  // Monthly fee benefit
  if (plan.monthly_fee === 0) {
    keyBenefits.push('No monthly fee saves additional $120/year');
  }

  // Solar buyback benefit
  if (plan.solar_buyback_rate && plan.solar_buyback_rate > 0.10) {
    keyBenefits.push(`Excellent solar buyback rates ($${plan.solar_buyback_rate}/kWh)`);
  }

  // TOU benefit for EV
  if (plan.time_of_use && plan.ev_optimized) {
    keyBenefits.push('Optimized for EV charging with super off-peak rates');
  }

  // Rating benefit
  if (plan.supplier_rating >= 4.5) {
    keyBenefits.push(`Highly rated provider (${plan.supplier_rating}/5 stars)`);
  }

  const considerations = [];

  // Early termination fee
  if (plan.early_termination_fee > 0) {
    considerations.push(`$${plan.early_termination_fee} early termination fee`);
  }

  // Contract length
  if (plan.contract_length_months > 12) {
    considerations.push(`${plan.contract_length_months}-month contract commitment`);
  }

  return {
    rank,
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    provider: plan.provider,
    rate_per_kwh: plan.rate_per_kwh || plan.rate_per_kwh_base,
    monthly_fee: plan.monthly_fee,
    rate_structure: plan.rate_structure,
    contract_length_months: plan.contract_length_months,
    renewable_percentage: plan.renewable_percentage,
    financial_impact: financialImpact,
    fit_score: plan.fit_score,
    fit_breakdown: plan.fit_breakdown,
    explanation,
    key_benefits: keyBenefits,
    considerations,
    next_steps: {
      action: 'switch_supplier',
      estimated_time_to_complete: '15 minutes online',
      arbor_commission: 100.0,
    },
  };
}

function buildExclusionReasons(allPlans: any[], eligiblePlans: any[], profile: any): string[] {
  const reasons: string[] = [];

  const contractFiltered = allPlans.filter(
    (p) => p.contract_length_months > profile.preferences.max_contract_months
  );
  if (contractFiltered.length > 0) {
    reasons.push('contract_too_long');
  }

  const renewableFiltered = allPlans.filter((p) => {
    const minRenewable = getMinRenewableFromPreference(profile.preferences.renewable_priority);
    return p.renewable_percentage < minRenewable;
  });
  if (renewableFiltered.length > 0) {
    reasons.push('renewable_too_low');
  }

  return reasons;
}

function getMinRenewableFromPreference(preference: string): number {
  switch (preference) {
    case 'low':
      return 0;
    case 'moderate':
      return 50;
    case 'high':
      return 75;
    case '100_percent':
      return 100;
    default:
      return 0;
  }
}
