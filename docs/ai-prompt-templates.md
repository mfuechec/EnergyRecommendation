# AI Prompt Templates

**Purpose:** Production-ready prompts for GPT-4 to generate usage analysis and plan explanations
**Model:** GPT-4 (for reasoning quality)
**Temperature Range:** 0.3 (analysis) to 0.7 (explanations)
**Last Updated:** January 11, 2025

---

## Table of Contents

1. [Usage Pattern Analysis Prompt](#usage-pattern-analysis-prompt)
2. [Plan Explanation Prompt](#plan-explanation-prompt)
3. [Behavior Optimization Prompt](#behavior-optimization-prompt)
4. [Prompt Testing Guide](#prompt-testing-guide)
5. [Cost Optimization](#cost-optimization)

---

## Usage Pattern Analysis Prompt

### Purpose
Analyze raw utility data to generate Layer 3 insights (customer segments, usage patterns, financial analysis)

### Model Configuration
```javascript
{
  model: "gpt-4",
  temperature: 0.3,
  max_tokens: 800,
  top_p: 1.0,
  frequency_penalty: 0,
  presence_penalty: 0
}
```

### Prompt Template

```
You are an expert energy usage analyst for Arbor Energy. Your job is to analyze a customer's electricity usage data and generate structured insights.

## Customer Data

**Location:** {location}
**Account Tenure:** {account_start_date} to present ({years_on_account} years)

**12-Month Usage History:**
{usage_history_formatted}

**Current Plan:**
- Provider: {current_provider}
- Plan: {current_plan_name}
- Rate: ${current_rate_per_kwh}/kWh + ${monthly_fee}/month
- Structure: {rate_structure}
- Contract Started: {contract_start_date}
- Renewable: {renewable_percentage}%

**Rate History:**
{rate_history_formatted}

**Customer Home Attributes:**
- Home Type: {home_type}
- Occupants: {occupants}
- Solar: {has_solar}
- EV: {has_ev}
- Pool: {has_pool}
- Work from Home: {work_from_home}

## Analysis Tasks

Analyze this data and provide insights in the following JSON structure:

```json
{
  "usage_analysis": {
    "pattern_type": "STRING: balanced_seasonal | extreme_summer_spike | extreme_winter_spike | stable_year_round | erratic | solar_high_offset | consistent_ev_charging | seasonal_with_pool",
    "pattern_description": "STRING: 1-2 sentence description of the usage pattern",
    "total_annual_kwh": NUMBER,
    "avg_monthly_kwh": NUMBER,
    "peak_month": "STRING: month name",
    "peak_kwh": NUMBER,
    "low_month": "STRING: month name",
    "low_kwh": NUMBER,
    "seasonal_variance_pct": NUMBER,
    "stability_score": NUMBER (0.0-1.0, higher = more predictable),
    "usage_predictability": "STRING: high | moderate | low"
  },

  "financial_analysis": {
    "current_annual_cost": NUMBER,
    "years_on_current_plan": NUMBER,
    "tenure_category": "STRING: recent_signup | mid_term | long_term_loyal",

    "rate_trend": {
      "direction": "STRING: increasing | decreasing | stable",
      "original_rate": NUMBER,
      "current_rate": NUMBER,
      "total_increase_pct": NUMBER,
      "increases_count": NUMBER
    },

    "vs_market_average": {
      "market_avg_rate": 0.118,
      "overpaying_pct": NUMBER,
      "estimated_annual_overpayment": NUMBER
    }
  },

  "customer_segment": "STRING: loyalty_penalty_victim | variable_rate_victim | solar_buyback_victim | ev_owner_flat_rate | pool_owner_peak_usage | price_conscious_shopper | green_energy_advocate",
  "segment_confidence": NUMBER (0.0-1.0),
  "segment_description": "STRING: 1 sentence explaining the segment classification",

  "risk_factors": [
    "ARRAY of STRINGS describing vulnerabilities or problems with current situation"
  ],

  "opportunities": [
    "ARRAY of STRINGS describing potential savings or optimization opportunities"
  ],

  "ai_recommendation_priority": "STRING: supplier_switch | behavior_plus_supplier_switch | behavior_only",
  "estimated_max_savings": NUMBER,
  "confidence_score": NUMBER (0.0-1.0)
}
```

## Analysis Guidelines

1. **Pattern Type Classification:**
   - balanced_seasonal: Moderate variation (40-80% variance) with both summer and winter peaks
   - extreme_summer_spike: >150% variance, summer dominates (AC usage)
   - extreme_winter_spike: >150% variance, winter dominates (heating)
   - stable_year_round: <30% variance
   - solar_high_offset: Net consumption very low due to solar generation
   - consistent_ev_charging: Stable elevated usage with ~400 kWh monthly increment
   - seasonal_with_pool: Summer spike from pool equipment

2. **Seasonal Variance Calculation:**
   ((peak_kwh - low_kwh) / low_kwh) * 100

3. **Stability Score:**
   - 0.8-1.0 = Highly predictable (stable usage)
   - 0.5-0.8 = Moderately predictable
   - 0.0-0.5 = Low predictability (erratic or high seasonal variance)

4. **Customer Segment Logic:**
   - loyalty_penalty_victim: 3+ years on same plan, 3+ rate increases totaling >10%
   - variable_rate_victim: On variable rate plan with high seasonal variance
   - solar_buyback_victim: Solar owner getting <$0.09/kWh buyback
   - ev_owner_flat_rate: Has EV but on flat-rate (not TOU) plan
   - pool_owner_peak_usage: Has pool, flat-rate plan, high summer usage

5. **Overpaying Calculation:**
   Compare current effective rate to Austin market average of $0.118/kWh
   If current rate > market avg: overpaying
   Calculate annual overpayment: (current_rate - 0.118) * total_annual_kwh

6. **Risk Factors - Include things like:**
   - "rate_creep" - rates increasing over time
   - "variable_rate_exposure" - vulnerable to seasonal rate spikes
   - "poor_buyback_rate" - solar owners getting wholesale rates
   - "summer_bill_shock" - extreme summer usage on variable plan
   - "missing_tou_savings" - EV/pool owners on flat-rate plans

7. **Opportunities - Include things like:**
   - "supplier_switch_high_savings" - can save >$300/year
   - "renewable_upgrade_available" - can go greener without paying more
   - "ev_charging_cost_reduction" - TOU plan would save on EV
   - "pool_timer_optimization" - simple timer = big savings
   - "negative_annual_cost_possible" - solar owners could get paid

8. **Confidence Scores:**
   Base on data quality and pattern clarity
   - High confidence (0.85-1.0): Clear patterns, complete data
   - Medium confidence (0.70-0.85): Some ambiguity
   - Low confidence (0.5-0.7): Incomplete data or unclear patterns

## Important Notes

- Use ONLY the data provided - no assumptions
- All numbers should be calculated from the usage history
- Be specific in descriptions - reference actual months, amounts, patterns
- Customer segment should be the single best match
- Risk factors and opportunities should be actionable and specific

Generate the analysis now.
```

### Example Input Formatting

```javascript
// JavaScript code to format the prompt
function formatUsageHistory(usageHistory) {
  return usageHistory.map(month =>
    `${month.month}: ${month.kwh} kWh ($${month.bill_amount})`
  ).join('\n');
}

function formatRateHistory(rateHistory) {
  return rateHistory.map(entry =>
    `${entry.effective_date}: $${entry.rate_per_kwh}/kWh (${entry.change_type})`
  ).join('\n');
}

// Build the complete prompt
const prompt = usageAnalysisTemplate
  .replace('{location}', 'Austin, TX')
  .replace('{account_start_date}', '2021-01-15')
  .replace('{years_on_account}', '4.0')
  .replace('{usage_history_formatted}', formatUsageHistory(customer.usage_history))
  .replace('{current_provider}', customer.current_plan.provider)
  // ... etc
```

### Expected Response (Sarah Mitchell Example)

```json
{
  "usage_analysis": {
    "pattern_type": "balanced_seasonal",
    "pattern_description": "Moderate variation between seasons with both summer cooling peaks (July-September) and winter heating peaks (January, December), indicating typical Austin home usage.",
    "total_annual_kwh": 11400,
    "avg_monthly_kwh": 950,
    "peak_month": "August",
    "peak_kwh": 1220,
    "low_month": "April",
    "low_kwh": 750,
    "seasonal_variance_pct": 62.7,
    "stability_score": 0.73,
    "usage_predictability": "high"
  },
  "financial_analysis": {
    "current_annual_cost": 1658.40,
    "years_on_current_plan": 4.0,
    "tenure_category": "long_term_loyal",
    "rate_trend": {
      "direction": "increasing",
      "original_rate": 0.114,
      "current_rate": 0.135,
      "total_increase_pct": 18.4,
      "increases_count": 3
    },
    "vs_market_average": {
      "market_avg_rate": 0.118,
      "overpaying_pct": 14.4,
      "estimated_annual_overpayment": 314
    }
  },
  "customer_segment": "loyalty_penalty_victim",
  "segment_confidence": 0.95,
  "segment_description": "Long-term customer experiencing systematic rate increases without shopping around for better plans.",
  "risk_factors": [
    "rate_creep",
    "no_plan_shopping_history",
    "above_market_rate",
    "inertia_risk"
  ],
  "opportunities": [
    "supplier_switch_high_savings",
    "renewable_upgrade_available",
    "no_behavior_change_needed"
  ],
  "ai_recommendation_priority": "supplier_switch",
  "estimated_max_savings": 427,
  "confidence_score": 0.92
}
```

---

## Plan Explanation Prompt

### Purpose
Generate friendly, personalized 2-3 sentence explanations for why a specific plan is recommended

### Model Configuration
```javascript
{
  model: "gpt-4",
  temperature: 0.7,
  max_tokens: 150,
  top_p: 1.0,
  frequency_penalty: 0.3,
  presence_penalty: 0.3
}
```

### Prompt Template

```
You are an energy plan recommendation expert writing personalized explanations for customers.

## Customer Context

**Name:** {customer_name}
**Current Situation:**
- Usage Pattern: {usage_pattern_description}
- Current Plan: {current_plan_name} by {current_provider}
- Current Rate: ${current_rate_per_kwh}/kWh + ${current_monthly_fee}/month
- Current Annual Cost: ${current_annual_cost}
- Time on Plan: {years_on_plan} years
- Main Issue: {main_problem_description}

**Customer Priorities:**
- Primary Concern: {primary_concern}
- Renewable Preference: {renewable_preference}
- Max Contract: {max_contract_months} months

**Customer Attributes:**
{customer_special_attributes}

## Recommended Plan

**Plan:** {recommended_plan_name} by {recommended_provider}
**Rate:** ${recommended_rate_per_kwh}/kWh + ${recommended_monthly_fee}/month
**Structure:** {rate_structure}
**Projected Annual Cost:** ${projected_annual_cost}
**Annual Savings:** ${annual_savings}
**Renewable:** {renewable_percentage}%
**Contract:** {contract_length_months} months
**Key Features:**
{key_features_list}

## Your Task

Generate a clear, friendly 2-3 sentence explanation for why this plan is recommended for THIS specific customer.

## Requirements

1. **Reference the customer's specific situation** - Use their actual usage pattern, current pain point, or home attributes
2. **Explain why THIS plan structure fits THEM** - Don't just list features, explain relevance
3. **Highlight the most compelling benefit** - Savings amount, renewable %, rate stability, etc.
4. **Use plain language** - Avoid jargon like "kWh", "TOU", "net metering" unless absolutely necessary
5. **Be conversational** - Write like you're talking to a friend, not a marketing brochure
6. **Be specific** - Use actual numbers, percentages, and details from the data

## Examples of Good Explanations

**Example 1 (Loyalty Penalty Victim):**
"After 4 years of rate increases, switching to this plan locks in $0.108/kWh—significantly below your current $0.135 rate. The lack of a monthly fee adds another $120 in annual savings, and you'll be powered by 100% Texas solar energy instead of your current 18% renewable plan."

**Example 2 (Variable Rate Victim):**
"Your summer bills hit $260 because your variable rate spikes to $0.145 during peak months. This fixed-rate plan eliminates that uncertainty—your July bill would drop from $260 to around $145, even with the same AC usage."

**Example 3 (EV Owner):**
"You're already doing everything right by charging overnight, but your flat-rate plan doesn't reward those good habits. Switching to this time-of-use plan means your Tesla charging costs drop from $47/month to just $18/month at the super off-peak rate of $0.045/kWh."

**Example 4 (Solar Owner):**
"Your current plan pays you just $0.065/kWh for the excess solar you send back to the grid. This plan pays $0.110/kWh—near retail rates. That changes your annual electricity cost from $220 to negative $67. The grid will actually pay you."

## Bad Examples (Don't Do This)

❌ "This plan offers competitive rates and excellent customer service."
   → Too generic, no specific connection to customer

❌ "You'll save money on this plan because it's cheaper."
   → Obvious and unhelpful, no explanation of why

❌ "The time-of-use rate structure provides optimal pricing for off-peak consumption."
   → Too much jargon, sounds like marketing copy

❌ "This is a great plan."
   → Completely useless

## Generate the explanation now.

Return ONLY the explanation text. Do not include labels, JSON, or any formatting.
```

### Example Full Prompt (Sarah Mitchell)

```
You are an energy plan recommendation expert writing personalized explanations for customers.

## Customer Context

**Name:** Sarah Mitchell
**Current Situation:**
- Usage Pattern: Balanced usage with moderate summer and winter peaks (avg 950 kWh/month)
- Current Plan: TXU Energy Secure 12 by TXU Energy
- Current Rate: $0.135/kWh + $9.95/month
- Current Annual Cost: $1,658.40
- Time on Plan: 4.0 years
- Main Issue: Loyalty penalty - rate has increased 18% over 4 years through 3 separate rate hikes

**Customer Priorities:**
- Primary Concern: Cost savings
- Renewable Preference: Moderate
- Max Contract: 12 months

**Customer Attributes:**
- No solar, no EV, no pool
- 2 occupants
- Does not work from home
- Single family home

## Recommended Plan

**Plan:** Solar 100 - 12 by Chariot Energy
**Rate:** $0.108/kWh + $0/month
**Structure:** Fixed rate
**Projected Annual Cost:** $1,231.20
**Annual Savings:** $427.20
**Renewable:** 100%
**Contract:** 12 months
**Key Features:**
- 100% Texas solar energy
- No monthly fee (saves $120/year)
- Excellent solar buyback rates if customer adds panels later
- Highly rated provider (4.3/5 stars)

## Your Task

Generate a clear, friendly 2-3 sentence explanation for why this plan is recommended for THIS specific customer.

[Requirements section...]

Generate the explanation now.

Return ONLY the explanation text. Do not include labels, JSON, or any formatting.
```

### Expected Response

```
After 4 years of loyalty, TXU has "rewarded" you with a rate that's jumped from $0.114 to $0.135—an 18% increase. This plan locks in $0.108/kWh and eliminates the monthly fee entirely, adding up to $427 in annual savings. As a bonus, you'll be powered by 100% Texas solar instead of your current 18% renewable mix.
```

---

## Behavior Optimization Prompt

### Purpose
Generate personalized behavior change recommendations for EV and pool owners

### Model Configuration
```javascript
{
  model: "gpt-4",
  temperature: 0.5,
  max_tokens: 300,
  top_p: 1.0
}
```

### Prompt Template

```
You are a behavior optimization expert for Arbor Energy. Generate a personalized recommendation for a customer who can save money by adjusting their energy usage timing.

## Customer Info

**Name:** {customer_name}
**Situation:** {has_ev or has_pool}
{if has_ev:}
- EV: {ev_make_model}
- Current charging time: {ev_charging_time}
- Estimated EV usage: {ev_monthly_kwh} kWh/month
- Current plan structure: {current_plan_structure}
{endif}

{if has_pool:}
- Pool size: {pool_size_gallons} gallons
- Current equipment schedule: {pool_equipment_schedule}
- Estimated pool usage: {pool_monthly_kwh} kWh/month
- Current plan structure: {current_plan_structure}
{endif}

## Optimization Opportunity

**Recommended Plan:** {recommended_plan_name} (Time-of-Use)
- Peak rate (3pm-8pm): ${peak_rate}/kWh
- Off-peak rate: ${offpeak_rate}/kWh
- Super off-peak rate (11pm-7am): ${super_offpeak_rate}/kWh

**Current {equipment} Cost:** ${current_monthly_cost}/month
**Optimized {equipment} Cost:** ${optimized_monthly_cost}/month
**Monthly Savings:** ${monthly_savings}
**Annual Savings:** ${annual_savings}

{if pool:}
**Required Equipment:** Programmable timer (~$75)
**Payback Period:** {payback_months} months
{endif}

## Your Task

Generate a JSON response with the following structure:

```json
{
  "headline": "STRING: Catchy 5-7 word headline",
  "summary": "STRING: 2-3 sentence explanation of the opportunity",
  "current_behavior": "STRING: What they're doing now",
  "recommended_behavior": "STRING: What they should do",
  "implementation": {
    "difficulty": "STRING: easy | moderate | requires_equipment",
    "time_to_implement": "STRING: e.g., '5 minutes', '30 minutes one-time setup'",
    "equipment_needed": "STRING or null",
    "equipment_cost": NUMBER or null,
    "steps": [
      "ARRAY of STRINGS: 3-5 simple action steps"
    ]
  },
  "savings_summary": "STRING: Clear statement of savings potential",
  "lifestyle_impact": "STRING: Explanation of how this affects daily life",
  "confidence": NUMBER (0.0-1.0)
}
```

## Guidelines

1. **Be honest about lifestyle impact** - If it requires behavior change, say so clearly
2. **Emphasize when NO change is needed** - If they're already optimal, celebrate it!
3. **Make implementation concrete** - Specific steps, not vague suggestions
4. **Quantify savings clearly** - Use monthly AND annual figures
5. **Address concerns proactively** - Pool chemistry? EV charging speed? Mention it.

Generate the recommendation now.
```

### Expected Response (Jessica Chen - EV Owner)

```json
{
  "headline": "Keep Charging Overnight, Just Switch Plans",
  "summary": "You're already doing everything right by charging your Tesla between 11pm-7am. The problem is your flat-rate plan charges $0.118/kWh no matter when you use electricity. A time-of-use plan rewards your smart charging habits with a super off-peak rate of just $0.045/kWh during those exact hours.",
  "current_behavior": "Charging overnight (11pm-7am) on flat-rate plan at $0.118/kWh",
  "recommended_behavior": "Continue charging overnight, but on time-of-use plan at $0.045/kWh super off-peak rate",
  "implementation": {
    "difficulty": "easy",
    "time_to_implement": "No behavior change needed - just switch plans",
    "equipment_needed": null,
    "equipment_cost": null,
    "steps": [
      "Switch to Octopus Energy Intelligent Octopus plan",
      "Keep your current charging schedule (11pm-7am)",
      "Track your savings in the Arbor app",
      "Enjoy lower EV charging costs immediately"
    ]
  },
  "savings_summary": "Your EV charging cost drops from $47/month to $18/month—saving you $348 per year with zero lifestyle changes.",
  "lifestyle_impact": "None. You're already charging at the optimal time. This is pure savings for what you're already doing.",
  "confidence": 0.87
}
```

---

## Prompt Testing Guide

### Test Cases for Usage Analysis

**Test Case 1: Loyalty Penalty Victim (Sarah)**
- Input: 4 years on same plan, 3 rate increases (18% total)
- Expected: segment = "loyalty_penalty_victim", opportunities include "supplier_switch_high_savings"

**Test Case 2: Variable Rate Victim (Mike)**
- Input: Variable rate plan, high summer usage, recent signup
- Expected: segment = "variable_rate_victim", risk_factors include "summer_bill_shock"

**Test Case 3: Solar Owner (David)**
- Input: Solar system with net generation, poor buyback rate
- Expected: segment = "solar_buyback_victim", opportunities include "negative_annual_cost_possible"

**Test Case 4: EV Owner (Jessica)**
- Input: Consistent 400 kWh/month increment, flat-rate plan
- Expected: segment = "ev_owner_flat_rate", pattern_type = "consistent_ev_charging"

**Test Case 5: Pool Owner (Thompson Family)**
- Input: Seasonal usage spike, pool equipment
- Expected: segment = "pool_owner_peak_usage", opportunities include "pool_timer_optimization"

### Testing Procedure

```javascript
async function testUsageAnalysisPrompt() {
  const testCases = [
    { customer_id: 'CUST_001', expectedSegment: 'loyalty_penalty_victim' },
    { customer_id: 'CUST_002', expectedSegment: 'variable_rate_victim' },
    { customer_id: 'CUST_003', expectedSegment: 'solar_buyback_victim' },
    { customer_id: 'CUST_004', expectedSegment: 'ev_owner_flat_rate' },
    { customer_id: 'CUST_005', expectedSegment: 'pool_owner_peak_usage' }
  ];

  for (const testCase of testCases) {
    const customer = loadCustomer(testCase.customer_id);
    const prompt = buildUsageAnalysisPrompt(customer);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800
    });

    const analysis = JSON.parse(response.choices[0].message.content);

    console.log(`Test ${testCase.customer_id}:`);
    console.log(`  Expected segment: ${testCase.expectedSegment}`);
    console.log(`  Actual segment: ${analysis.customer_segment}`);
    console.log(`  Match: ${analysis.customer_segment === testCase.expectedSegment ? '✅' : '❌'}`);
    console.log(`  Confidence: ${analysis.segment_confidence}`);
    console.log('');
  }
}
```

### Test Cases for Plan Explanations

**Quality Checklist:**
- [ ] References customer's specific situation (usage pattern, current issue, attributes)
- [ ] Explains WHY the plan structure fits (not just WHAT it is)
- [ ] Uses specific numbers from the data
- [ ] 2-3 sentences (not too short, not too long)
- [ ] Conversational tone (not marketing-speak)
- [ ] Highlights most compelling benefit
- [ ] No excessive jargon

**Red Flags:**
- ❌ "This is a great plan" (too generic)
- ❌ "Excellent customer service" (not specific to customer's situation)
- ❌ Uses "kWh" without context (jargon)
- ❌ More than 4 sentences (too wordy)
- ❌ Less than 2 sentences (too brief)

---

## Cost Optimization

### Token Usage Estimates

**Usage Analysis Prompt:**
- Input tokens: ~1,200 (includes customer data)
- Output tokens: ~500 (JSON response)
- **Cost per call:** ~$0.025

**Plan Explanation Prompt:**
- Input tokens: ~600 (customer + plan data)
- Output tokens: ~100 (2-3 sentences)
- **Cost per call:** ~$0.008

**For Demo (5 customers, 3 plans each):**
- 5 usage analyses: 5 × $0.025 = $0.125
- 15 explanations: 15 × $0.008 = $0.120
- **Total demo cost:** ~$0.25

**For Production (per recommendation request):**
- 1 usage analysis (if not cached): $0.025
- 3 explanations (top 3 plans): $0.024
- **Total per request:** ~$0.05 (95% cached after first request)

### Caching Strategy

```javascript
// Cache Layer 3 (usage analysis) for 30 days
async function getOrGenerateInsights(customerId) {
  const cacheKey = `insights:${customerId}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  // Generate new analysis
  const insights = await generateUsageAnalysis(customerId);

  // Cache for 30 days
  await redis.setex(cacheKey, 30 * 24 * 60 * 60, JSON.stringify(insights));

  return insights;
}

// Cache explanations by customer+plan hash
async function getOrGenerateExplanation(customerId, planId) {
  const cacheKey = `explanation:${customerId}:${planId}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return cached;
  }

  // Generate new explanation
  const explanation = await generatePlanExplanation(customerId, planId);

  // Cache for 7 days (shorter TTL because plans change)
  await redis.setex(cacheKey, 7 * 24 * 60 * 60, explanation);

  return explanation;
}
```

---

## Error Handling

### JSON Parsing Failures

```javascript
async function generateUsageAnalysis(customer) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: buildPrompt(customer) }],
      temperature: 0.3,
      max_tokens: 800
    });

    const content = response.choices[0].message.content;

    // Try to parse JSON
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      // GPT sometimes wraps JSON in code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not extract JSON from response');
      }
    }

    // Validate required fields
    if (!analysis.customer_segment || !analysis.usage_analysis) {
      throw new Error('Missing required fields in analysis');
    }

    return analysis;

  } catch (error) {
    console.error('Usage analysis failed:', error);
    // Return fallback analysis or throw
    throw error;
  }
}
```

### Rate Limiting

```javascript
const rateLimiter = new RateLimiter({
  maxRequests: 500,
  perMinutes: 1
});

async function generateWithRetry(prompt, config, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await rateLimiter.waitForSlot();

      const response = await openai.chat.completions.create({
        ...config,
        messages: [{ role: 'user', content: prompt }]
      });

      return response.choices[0].message.content;

    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        // Rate limited - exponential backoff
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
      throw error;
    }
  }
}
```

---

## Appendix: Full Code Example

### Complete Implementation

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface UsageAnalysis {
  usage_analysis: {
    pattern_type: string;
    pattern_description: string;
    total_annual_kwh: number;
    avg_monthly_kwh: number;
    peak_month: string;
    peak_kwh: number;
    low_month: string;
    low_kwh: number;
    seasonal_variance_pct: number;
    stability_score: number;
    usage_predictability: string;
  };
  financial_analysis: {
    current_annual_cost: number;
    years_on_current_plan: number;
    tenure_category: string;
    rate_trend: {
      direction: string;
      original_rate: number;
      current_rate: number;
      total_increase_pct: number;
      increases_count: number;
    };
    vs_market_average: {
      market_avg_rate: number;
      overpaying_pct: number;
      estimated_annual_overpayment: number;
    };
  };
  customer_segment: string;
  segment_confidence: number;
  segment_description: string;
  risk_factors: string[];
  opportunities: string[];
  ai_recommendation_priority: string;
  estimated_max_savings: number;
  confidence_score: number;
}

export async function generateUsageAnalysis(
  customer: any,
  profile: any
): Promise<UsageAnalysis> {

  const prompt = buildUsageAnalysisPrompt(customer, profile);

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 800,
    response_format: { type: 'json_object' }
  });

  const analysis = JSON.parse(response.choices[0].message.content);
  return analysis as UsageAnalysis;
}

export async function generatePlanExplanation(
  customer: any,
  profile: any,
  insights: UsageAnalysis,
  plan: any,
  projectedCost: number,
  savings: number
): Promise<string> {

  const prompt = buildPlanExplanationPrompt(
    customer,
    profile,
    insights,
    plan,
    projectedCost,
    savings
  );

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 150
  });

  return response.choices[0].message.content.trim();
}

function buildUsageAnalysisPrompt(customer: any, profile: any): string {
  // Use the template from above with actual data substitution
  // Implementation details...
  return prompt;
}

function buildPlanExplanationPrompt(
  customer: any,
  profile: any,
  insights: UsageAnalysis,
  plan: any,
  projectedCost: number,
  savings: number
): string {
  // Use the template from above with actual data substitution
  // Implementation details...
  return prompt;
}
```

---

**Document Version:** 1.0
**Last Updated:** January 11, 2025
**Author:** Winston, System Architect

**Ready to test?** Use these prompts with your OpenAI API key to generate real analysis!
