# AI Energy Plan Recommendation Agent - System Architecture

**Project:** Arbor Energy Recommendation System
**Version:** 1.0 (Demo Architecture)
**Date:** January 11, 2025
**Architect:** Winston

---

## Executive Summary

This architecture document describes a **realistic, production-informed design** for the AI Energy Plan Recommendation Agent demo. The system combines real-time AI analysis with a three-layer data architecture that accurately represents how customer insights would be derived in production.

**Key Architectural Principle:** Data is separated into three distinct layers that mirror real-world data sources: utility APIs, user-provided context, and AI-generated insights.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Data Architecture](#data-architecture)
3. [System Flow](#system-flow)
4. [AI Analysis Strategy](#ai-analysis-strategy)
5. [API Design](#api-design)
6. [Component Architecture](#component-architecture)
7. [Calculation Engine](#calculation-engine)
8. [Demo vs Production Mapping](#demo-vs-production-mapping)
9. [Error Handling & Fallbacks](#error-handling--fallbacks)
10. [Performance Considerations](#performance-considerations)

---

## System Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                          │
│                                                               │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Onboarding │→ │  Dashboard   │→ │  Recommendations     │ │
│  │  Flow      │  │  + Prefs     │  │  Display             │ │
│  └────────────┘  └──────────────┘  └──────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   API LAYER (Next.js)                         │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Recommendation Engine Orchestrator           │   │
│  │                                                      │   │
│  │  1. Load customer data (3 layers)                   │   │
│  │  2. Enrich with user profile context                │   │
│  │  3. Run AI usage pattern analysis (if needed)       │   │
│  │  4. Calculate costs for all applicable plans        │   │
│  │  5. Score and rank plans by fit                     │   │
│  │  6. Generate AI explanations (OpenAI)               │   │
│  │  7. Detect behavior optimization opportunities      │   │
│  │  8. Return recommendations + fallback cache         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴────────────────────┐
        ↓                                        ↓
┌─────────────────┐                   ┌─────────────────────┐
│   OpenAI API    │                   │   DATA LAYER        │
│   (GPT-4)       │                   │                     │
│                 │                   │  Three-Layer Model: │
│ • Usage analysis│                   │  1. Raw utility     │
│ • Explanations  │                   │  2. User profiles   │
│ • Behavior      │                   │  3. AI insights     │
│   suggestions   │                   │                     │
└─────────────────┘                   └─────────────────────┘
```

---

## Data Architecture

### The Three-Layer Model

This architecture separates concerns to accurately represent real-world data sources:

#### **Layer 1: Raw Utility Data** (`raw_utility_data.json`)

**Represents:** What you'd receive from utility company APIs (e.g., Austin Energy, Green Button API)

```json
{
  "customers": [
    {
      "customer_id": "CUST_001",
      "account": {
        "account_number": "AE-7845-2910",
        "start_date": "2021-01-15",
        "status": "active",
        "meter_type": "smart_meter"
      },
      "service_address": {
        "zip_code": "78704",
        "city": "Austin",
        "state": "TX"
      },
      "usage_history": [
        { "month": "2024-01", "kwh": 1050, "bill_amount": 142.70 },
        { "month": "2024-02", "kwh": 980, "bill_amount": 138.25 },
        // ... 12 months
      ],
      "current_plan": {
        "provider": "TXU Energy",
        "plan_id": "PLAN_003",
        "rate_per_kwh": 0.135,
        "monthly_fee": 9.95,
        "contract_start_date": "2021-01-15",
        "contract_end_date": null
      },
      "billing_history": [
        { "date": "2024-01-15", "rate": 0.135 },
        { "date": "2023-06-01", "rate": 0.130 },
        { "date": "2022-03-01", "rate": 0.122 },
        { "date": "2021-01-15", "rate": 0.114 }
      ]
    }
  ]
}
```

**Key Point:** This contains ONLY facts - no interpretation, no insights, no hints.

---

#### **Layer 2: User Profiles** (`user_profiles.json`)

**Represents:** Information collected during onboarding and user preferences

```json
{
  "profiles": [
    {
      "customer_id": "CUST_001",
      "personal": {
        "display_name": "Sarah Mitchell",
        "created_at": "2025-01-05T14:30:00Z"
      },
      "home_attributes": {
        "has_solar": false,
        "solar_system_kw": null,
        "has_ev": false,
        "ev_model": null,
        "has_pool": false,
        "has_hot_tub": false,
        "home_type": "single_family",
        "square_feet": 1800,
        "occupants": 2,
        "work_from_home": false
      },
      "preferences": {
        "primary_concern": "cost_savings",
        "renewable_priority": "moderate",
        "max_contract_months": 12,
        "willing_to_change_behavior": true,
        "notifications_enabled": true
      }
    }
  ]
}
```

**Key Point:** This is self-reported data from the user. In production, this would be collected via onboarding flow.

---

#### **Layer 3: AI-Generated Insights** (`system_analysis.json`)

**Represents:** Analysis performed by Arbor's AI system and cached for performance

```json
{
  "insights": [
    {
      "customer_id": "CUST_001",
      "generated_at": "2025-01-11T10:15:00Z",
      "expires_at": "2025-02-11T10:15:00Z",
      "usage_analysis": {
        "pattern_type": "balanced_seasonal",
        "avg_monthly_kwh": 950,
        "peak_month": "August",
        "peak_kwh": 1220,
        "low_month": "April",
        "low_kwh": 750,
        "seasonal_variance_pct": 62.7,
        "stability_score": 0.73
      },
      "financial_analysis": {
        "current_annual_cost": 1658.40,
        "years_on_current_plan": 4.0,
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
          "estimated_annual_overpayment": 320
        }
      },
      "customer_segment": "loyalty_penalty_victim",
      "risk_factors": [
        "rate_creep",
        "no_plan_shopping_history"
      ],
      "opportunities": [
        "supplier_switch_high_savings",
        "renewable_upgrade_available"
      ]
    }
  ]
}
```

**Key Point:** This is what the AI has learned about the customer. In the demo, this is pre-generated. In production, this would be computed on first analysis and cached with TTL.

---

### Why This Three-Layer Approach?

**Production Reality:**
1. **Layer 1** (Utility data) updates monthly when new bills arrive
2. **Layer 2** (User profile) updates when user changes preferences or home attributes
3. **Layer 3** (AI insights) is regenerated when Layer 1 or Layer 2 changes, or when cache expires

**Demo Benefit:**
- Shows you understand real data sources
- Makes the system architecture production-credible
- Allows you to demonstrate onboarding flow realistically
- Separates "what AI receives" from "what AI derives"

---

## System Flow

### Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: Account Connection & Onboarding (First Time)      │
└─────────────────────────────────────────────────────────────┘

User arrives → Connects utility account → System fetches usage data
                                          (Layer 1 populated)
              ↓
          Onboarding questionnaire → User answers 5-7 questions
                                     (Layer 2 populated)
              ↓
          AI Analysis triggered → Pattern analysis + financial analysis
                                  (Layer 3 generated)
              ↓
          User sees Dashboard → "Ready to get recommendations!"

┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: Getting Recommendations (Every Session)           │
└─────────────────────────────────────────────────────────────┘

User clicks "Get Recommendations"
              ↓
System loads all 3 layers → Combines into enriched profile
              ↓
Recommendation Engine runs:
  1. Load supplier catalog (filter by zip code)
  2. Calculate projected cost for each applicable plan
  3. Score plans using fit algorithm
  4. Rank top 3-5 candidates
  5. Call OpenAI API for explanations (parallel)
  6. Detect behavior optimization opportunities
  7. Format response
              ↓
Display results to user → Top 3 plans + behavior suggestions

┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: Re-Analysis (When Data Changes)                   │
└─────────────────────────────────────────────────────────────┘

Trigger: New billing data OR user changes preferences
              ↓
Invalidate Layer 3 cache → Re-run AI analysis
              ↓
Notify user: "We found a new opportunity for you!"
```

---

## AI Analysis Strategy

### How AI Derives Insights from Raw Data

The system uses **two types of AI calls**:

#### **AI Call Type 1: Usage Pattern Analysis**

**Purpose:** Understand customer's energy consumption behavior from raw kWh data

**Prompt Template:**
```
You are an energy usage analyst. Analyze this customer's usage pattern.

Usage Data (12 months):
Jan: 1050 kWh ($142.70)
Feb: 980 kWh ($138.25)
Mar: 820 kWh ($119.65)
Apr: 750 kWh ($110.20)
May: 780 kWh ($114.45)
Jun: 920 kWh ($133.65)
Jul: 1150 kWh ($164.20)
Aug: 1220 kWh ($174.65)
Sep: 1080 kWh ($155.75)
Oct: 850 kWh ($124.70)
Nov: 790 kWh ($115.60)
Dec: 1010 kWh ($145.30)

Customer Context:
- Location: Austin, TX (hot summers, mild winters)
- Home type: Single family, 2 occupants
- No solar, no EV, no pool
- Does not work from home

Current Plan:
- Provider: TXU Energy
- Rate: $0.135/kWh + $9.95/month
- On this plan since: 2021-01-15
- Rate history: $0.114 (2021) → $0.122 (2022) → $0.130 (2023) → $0.135 (2024)

Tasks:
1. Identify the usage pattern type (stable, seasonal_summer, seasonal_winter, balanced, erratic)
2. Calculate seasonal variance percentage
3. Determine primary drivers of high-usage months
4. Assess vulnerability to rate structures (fixed, variable, TOU)
5. Detect any concerning trends or anomalies
6. Classify customer segment based on data

Respond in JSON format:
{
  "usage_pattern": "...",
  "pattern_description": "...",
  "seasonal_variance_pct": X.X,
  "high_usage_drivers": ["..."],
  "recommended_rate_structure": "...",
  "customer_segment": "...",
  "rate_analysis": {
    "trend": "increasing/decreasing/stable",
    "total_increase_pct": X.X,
    "overpaying_estimate": XXX
  },
  "opportunities": ["..."],
  "risk_factors": ["..."]
}
```

**Model:** GPT-4 (for reasoning quality)
**Temperature:** 0.3 (deterministic)
**Max Tokens:** 500
**Cost:** ~$0.02 per analysis

---

#### **AI Call Type 2: Plan Explanation Generation**

**Purpose:** Generate human-friendly explanations for why a specific plan is recommended

**Prompt Template:**
```
You are an energy plan recommendation expert. Generate a clear, friendly 2-3 sentence explanation.

Customer Situation:
- Name: Sarah Mitchell
- Usage pattern: Balanced usage with moderate summer/winter peaks (avg 950 kWh/month)
- Current plan: TXU Energy at $0.135/kWh + $9.95/month
- Current annual cost: $1,658.40
- Years on plan: 4.0
- Rate has increased 18% since signup
- Primary concern: Cost savings
- Renewable preference: Moderate

Recommended Plan:
- Plan: Chariot Energy - Solar 100
- Rate: $0.108/kWh
- Monthly fee: $0
- Projected annual cost: $1,231.20
- Annual savings: $427.20
- Contract: 12 months, $150 early termination
- Renewable: 100% Texas solar
- Solar buyback: $0.110/kWh (excellent if customer adds solar later)

Generate an explanation that:
1. References the customer's specific situation (usage pattern, current pain point)
2. Explains why THIS plan structure is a good fit for THEM
3. Highlights the most compelling benefit (savings, renewable, flexibility)
4. Uses plain language - avoid jargon
5. Is 2-3 sentences maximum
6. Sounds conversational and helpful, not salesy

Respond with ONLY the explanation text, no JSON or formatting.
```

**Model:** GPT-4
**Temperature:** 0.7 (natural language)
**Max Tokens:** 150
**Cost:** ~$0.01 per explanation

**Demo Strategy:** Call this in parallel for top 3 plans = 3 concurrent API calls, ~3 seconds total

---

### Behavior Optimization Detection

**Logic-Based Detection (No AI Required):**

```javascript
function detectBehaviorOpportunities(customerProfile, usageHistory, aiInsights) {
  const opportunities = [];

  // EV Owner + Flat Rate Plan = Time-of-Use Opportunity
  if (customerProfile.has_ev && !currentPlan.time_of_use) {
    // Analyze usage curve to detect overnight charging pattern
    const nighttimeUsageIncrease = analyzeOvernightUsage(usageHistory);

    if (nighttimeUsageIncrease > 300) { // 300+ kWh at night = likely EV charging
      opportunities.push({
        type: "ev_time_of_use_switch",
        current_behavior: "likely_charging_overnight", // detected from pattern
        recommendation: "Switch to time-of-use plan to save on EV charging",
        estimated_savings: calculateTOUSavings(usageHistory, customerProfile.ev_monthly_kwh),
        behavior_change_required: "none", // already optimal
        confidence: 0.85
      });
    }
  }

  // Pool Owner + Peak Hour Usage = Timer Opportunity
  if (customerProfile.has_pool && !currentPlan.time_of_use) {
    const estimatedPoolKwh = customerProfile.pool_avg_monthly_kwh || 350;
    opportunities.push({
      type: "pool_timer_optimization",
      current_behavior: "likely_peak_hours", // most pools run afternoon
      recommendation: "Install timer, shift pool to overnight, switch to TOU plan",
      upfront_cost: 75,
      estimated_annual_savings: calculatePoolTOUSavings(estimatedPoolKwh),
      payback_period_months: 2.3,
      behavior_change_required: "one_time_timer_installation",
      confidence: 0.90
      });
  }

  return opportunities;
}
```

**Key Point:** Behavior detection uses **rule-based logic** informed by usage patterns. No AI needed for this part.

---

## API Design

### Core Endpoints

#### **POST /api/recommendations**

**Purpose:** Generate personalized plan recommendations

**Request:**
```json
{
  "customer_id": "CUST_001",
  "preferences": {
    "priority": "cost_savings",
    "renewable_preference": "moderate",
    "max_contract_months": 12
  },
  "force_refresh": false
}
```

**Response:**
```json
{
  "request_id": "req_abc123",
  "generated_at": "2025-01-11T15:30:00Z",
  "processing_time_ms": 2847,

  "customer_summary": {
    "customer_id": "CUST_001",
    "display_name": "Sarah Mitchell",
    "current_annual_cost": 1658.40,
    "avg_monthly_kwh": 950,
    "years_on_plan": 4.0
  },

  "top_recommendations": [
    {
      "rank": 1,
      "plan_id": "PLAN_004",
      "plan_name": "Chariot Energy - Solar 100",
      "provider": "Chariot Energy",
      "rate_per_kwh": 0.108,
      "monthly_fee": 0,
      "rate_structure": "fixed",
      "contract_length_months": 12,
      "renewable_percentage": 100,

      "financial_impact": {
        "projected_annual_cost": 1231.20,
        "annual_savings": 427.20,
        "monthly_savings": 35.60,
        "savings_percentage": 25.8,
        "payback_period_months": null,
        "total_5yr_savings": 2136.00
      },

      "fit_score": 94.2,
      "fit_breakdown": {
        "cost_score": 95,
        "renewable_score": 100,
        "flexibility_score": 80,
        "rating_score": 86
      },

      "explanation": "Your balanced usage pattern with summer and winter peaks benefits from rate stability at $0.108/kWh. This 100% solar plan eliminates your monthly fee entirely, adding up to $120 in extra savings per year. After 4 years of rate increases, switching now locks in significant savings.",

      "key_benefits": [
        "Save $427 annually compared to current plan",
        "100% Texas solar energy - exceeds your renewable preference",
        "No monthly fee saves additional $120/year",
        "Excellent solar buyback rates ($0.110/kWh) if you add panels later"
      ],

      "considerations": [
        "$150 early termination fee (but you're month-to-month now)",
        "12-month contract - moderate commitment"
      ],

      "next_steps": {
        "action": "switch_supplier",
        "estimated_time_to_complete": "15 minutes online",
        "arbor_commission": 100.00
      }
    },
    // ... ranks 2 and 3
  ],

  "behavior_suggestions": null,

  "current_plan_analysis": {
    "overpaying_estimate": 320,
    "vs_market_average_pct": 14.4,
    "rate_trend": "increasing",
    "loyalty_penalty": "You've experienced 3 rate increases totaling 18% over 4 years"
  },

  "metadata": {
    "plans_analyzed": 18,
    "plans_excluded": 2,
    "exclusion_reasons": ["contract_too_long", "renewable_too_low"],
    "ai_explanation_source": "openai_gpt4",
    "fallback_used": false
  }
}
```

---

#### **GET /api/customers/:id**

**Purpose:** Retrieve complete customer profile (all 3 layers combined)

**Response:**
```json
{
  "customer_id": "CUST_001",
  "raw_data": { /* Layer 1 */ },
  "profile": { /* Layer 2 */ },
  "insights": { /* Layer 3 */ },
  "last_updated": "2025-01-11T10:15:00Z"
}
```

---

#### **POST /api/analyze/usage**

**Purpose:** Run AI analysis on customer usage data (generates Layer 3)

**Request:**
```json
{
  "customer_id": "CUST_001",
  "force_refresh": true
}
```

**Response:**
```json
{
  "customer_id": "CUST_001",
  "insights": { /* Full Layer 3 object */ },
  "processing_time_ms": 1847,
  "cached": false
}
```

---

## Component Architecture

### Frontend Component Tree

```
<App>
  ├── <OnboardingFlow>  [First-time users only]
  │   ├── <ConnectAccountStep>
  │   ├── <HomeAttributesStep>
  │   └── <PreferencesStep>
  │
  ├── <CustomerDashboard>
  │   ├── <ProfileHeader>
  │   ├── <UsageChart>
  │   ├── <CurrentPlanCard>
  │   ├── <PreferenceControls>
  │   └── <GetRecommendationsButton>
  │
  └── <RecommendationsView>
      ├── <LoadingState>  [AI is analyzing...]
      ├── <CurrentPlanSummary>
      ├── <RecommendationCard> [Top 3]
      │   ├── <FinancialImpact>
      │   ├── <AIExplanation>
      │   ├── <KeyBenefits>
      │   └── <DetailsExpander>
      └── <BehaviorSuggestionCard> [If applicable]
```

---

### Key Component: `<RecommendationEngine>`

**Location:** `/src/lib/recommendationEngine.ts`

**Core Logic:**
```typescript
interface RecommendationRequest {
  customerId: string;
  preferences: UserPreferences;
  forceRefresh?: boolean;
}

interface RecommendationResponse {
  topRecommendations: PlanRecommendation[];
  behaviorSuggestions: BehaviorOpportunity[] | null;
  currentPlanAnalysis: CurrentPlanAnalysis;
  metadata: RecommendationMetadata;
}

export async function generateRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {

  // 1. Load all data layers
  const rawData = await loadRawUtilityData(request.customerId);
  const profile = await loadUserProfile(request.customerId);
  const insights = await loadOrGenerateInsights(request.customerId, request.forceRefresh);

  // 2. Load applicable supplier plans
  const supplierPlans = await loadSupplierPlans(profile.service_address.zip_code);

  // 3. Filter plans based on preferences
  const eligiblePlans = filterPlans(supplierPlans, request.preferences);

  // 4. Calculate projected costs for all eligible plans
  const costsCalculated = await Promise.all(
    eligiblePlans.map(plan => calculateProjectedCost(plan, rawData.usage_history, profile))
  );

  // 5. Score and rank plans
  const scored = costsCalculated.map(plan => ({
    ...plan,
    fitScore: calculateFitScore(plan, insights, request.preferences)
  }));

  const ranked = scored.sort((a, b) => b.fitScore - a.fitScore);
  const top3 = ranked.slice(0, 3);

  // 6. Generate AI explanations (parallel)
  const withExplanations = await Promise.all(
    top3.map(async plan => ({
      ...plan,
      explanation: await generateExplanation(plan, insights, profile)
    }))
  );

  // 7. Detect behavior opportunities
  const behaviorSuggestions = detectBehaviorOpportunities(profile, rawData, insights);

  // 8. Assemble response
  return {
    topRecommendations: withExplanations,
    behaviorSuggestions,
    currentPlanAnalysis: analyzePlanHealth(rawData.current_plan, insights),
    metadata: {
      plansAnalyzed: eligiblePlans.length,
      processingTimeMs: Date.now() - startTime,
      aiExplanationSource: 'openai_gpt4',
      fallbackUsed: false
    }
  };
}
```

---

## Calculation Engine

### Cost Calculation Functions

#### **Function 1: Fixed-Rate Plans**
```typescript
function calculateFixedRateCost(
  usageHistory: MonthlyUsage[],
  plan: FixedRatePlan
): number {
  let totalCost = 0;

  for (const month of usageHistory) {
    totalCost += month.kwh * plan.rate_per_kwh;
  }

  totalCost += plan.monthly_fee * 12;

  return totalCost;
}
```

#### **Function 2: Variable-Rate Plans**
```typescript
function calculateVariableRateCost(
  usageHistory: MonthlyUsage[],
  plan: VariableRatePlan
): number {
  let totalCost = 0;

  for (const month of usageHistory) {
    const monthNum = new Date(month.month).getMonth() + 1;
    const rate = plan.peak_months.includes(monthNum)
      ? plan.rate_per_kwh_peak
      : plan.rate_per_kwh_base;

    totalCost += month.kwh * rate;
  }

  totalCost += plan.monthly_fee * 12;

  return totalCost;
}
```

#### **Function 3: Time-of-Use Plans**
```typescript
function calculateTOUCost(
  usageHistory: MonthlyUsage[],
  plan: TOUPlan,
  profile: UserProfile
): number {
  let totalCost = 0;

  // Get usage assumptions based on customer attributes
  const assumptions = getUsageAssumptions(profile);

  for (const month of usageHistory) {
    // Baseline home usage
    let baselineKwh = month.kwh;

    // Subtract EV usage if present
    if (profile.has_ev) {
      const evKwh = profile.ev_monthly_kwh || 400;
      baselineKwh -= evKwh;

      // EV charging cost (assume 90% during super off-peak)
      const evCost = evKwh * 0.90 * plan.rate_per_kwh_super_offpeak +
                     evKwh * 0.10 * plan.rate_per_kwh_offpeak;
      totalCost += evCost;
    }

    // Subtract pool usage if present
    if (profile.has_pool && month.pool_kwh) {
      baselineKwh -= month.pool_kwh;

      // Pool cost depends on whether they've optimized
      if (profile.pool_optimized) {
        // All super off-peak
        totalCost += month.pool_kwh * plan.rate_per_kwh_super_offpeak;
      } else {
        // All peak (current state)
        totalCost += month.pool_kwh * plan.rate_per_kwh_peak;
      }
    }

    // Baseline usage distributed across TOU periods
    const baselineCost = baselineKwh * (
      assumptions.baseline_peak_pct * plan.rate_per_kwh_peak +
      assumptions.baseline_offpeak_pct * plan.rate_per_kwh_offpeak +
      assumptions.baseline_super_offpeak_pct * plan.rate_per_kwh_super_offpeak
    );

    totalCost += baselineCost;
  }

  totalCost += plan.monthly_fee * 12;

  return totalCost;
}

// Default assumptions for TOU distribution
function getUsageAssumptions(profile: UserProfile) {
  return {
    baseline_peak_pct: 0.20,        // 20% during peak (3pm-8pm)
    baseline_offpeak_pct: 0.50,     // 50% during off-peak
    baseline_super_offpeak_pct: 0.30 // 30% during super off-peak (11pm-7am)
  };
}
```

#### **Function 4: Solar Buyback Plans**
```typescript
function calculateSolarCost(
  usageHistory: SolarUsageHistory[],
  plan: SolarPlan
): number {
  let annualCost = 0;
  let creditBalance = 0;

  for (const month of usageHistory) {
    let monthlyCost = 0;

    // Customer bought electricity from grid
    if (month.net_from_grid > 0) {
      monthlyCost = month.net_from_grid * plan.rate_per_kwh;
    }

    // Customer sold electricity to grid
    if (month.net_to_grid > 0) {
      const credit = month.net_to_grid * plan.solar_buyback_rate;
      creditBalance += credit;
    }

    // Apply accumulated credits to this month's bill
    if (creditBalance > 0 && monthlyCost > 0) {
      const creditApplied = Math.min(creditBalance, monthlyCost);
      monthlyCost -= creditApplied;
      creditBalance -= creditApplied;
    }

    annualCost += monthlyCost;
  }

  annualCost += plan.monthly_fee * 12;

  // Unused credits at year-end
  annualCost -= creditBalance; // May result in negative cost!

  return annualCost;
}
```

---

### Fit Score Algorithm

```typescript
interface FitScoreWeights {
  cost: number;
  renewable: number;
  flexibility: number;
  rating: number;
}

function calculateFitScore(
  plan: PlanWithProjectedCost,
  insights: CustomerInsights,
  preferences: UserPreferences
): number {

  // Get weights based on user preferences
  const weights = getWeights(preferences);

  // Component 1: Cost Score (0-100)
  const savingsRatio = (insights.current_annual_cost - plan.projected_cost) /
                        insights.current_annual_cost;
  const costScore = Math.max(0, Math.min(100, savingsRatio * 100));

  // Component 2: Renewable Score (0-100)
  const renewableScore = plan.renewable_percentage;

  // Component 3: Flexibility Score (0-100)
  let flexScore = 0;
  if (plan.contract_length_months === 0) flexScore = 100;
  else if (plan.contract_length_months <= 6) flexScore = 80;
  else if (plan.contract_length_months <= 12) flexScore = 60;
  else if (plan.contract_length_months <= 24) flexScore = 40;
  else flexScore = 20;

  // Component 4: Provider Rating Score (0-100)
  const ratingScore = (plan.supplier_rating / 5.0) * 100;

  // Weighted sum
  let finalScore =
    costScore * weights.cost +
    renewableScore * weights.renewable +
    flexScore * weights.flexibility +
    ratingScore * weights.rating;

  // Apply penalties
  if (plan.early_termination_fee > 200) finalScore -= 5;
  if (plan.rate_structure === 'variable' && insights.seasonal_variance_pct > 100) {
    finalScore -= 10; // Variable rate is risky for high seasonal variance
  }

  // Normalize to 0-100
  return Math.max(0, Math.min(100, finalScore));
}

function getWeights(preferences: UserPreferences): FitScoreWeights {
  switch (preferences.priority) {
    case 'cost_savings':
      return { cost: 0.70, renewable: 0.10, flexibility: 0.10, rating: 0.10 };
    case 'renewable_energy':
      return { cost: 0.30, renewable: 0.50, flexibility: 0.10, rating: 0.10 };
    case 'flexibility':
      return { cost: 0.30, renewable: 0.10, flexibility: 0.50, rating: 0.10 };
    case 'balanced':
    default:
      return { cost: 0.40, renewable: 0.30, flexibility: 0.15, rating: 0.15 };
  }
}
```

---

## Demo vs Production Mapping

### What's Real in the Demo vs What Would Change

| Aspect | Demo Implementation | Production Implementation |
|--------|---------------------|---------------------------|
| **Data Source** | 3 JSON files (simulated layers) | Layer 1: Utility API (Green Button, OAuth)<br>Layer 2: PostgreSQL<br>Layer 3: Redis cache |
| **AI Analysis** | Pre-generated for Layer 3, real-time for explanations | Real-time for both, with aggressive caching |
| **Authentication** | Dropdown selection (mock login) | OAuth 2.0 with utility providers |
| **Usage Data** | Static 12-month history | Continuous updates, hourly smart meter data |
| **Supplier Catalog** | Static JSON (20 plans) | Daily scraping + API integrations with providers |
| **Onboarding** | Shown in video for 1-2 customers | Required for all new users |
| **Recommendations** | Generated on-demand in demo | Background jobs + proactive notifications |
| **Fallback Strategy** | Pre-generated explanations in JSON | Database-backed fallback + circuit breaker |
| **Performance** | <3 seconds (goal) | <1 second (aggressive caching + edge functions) |

---

### Explaining Production Reality in Demo

**Script Suggestion for Video:**

> "In this demo, I'm simulating three data sources that Arbor would integrate with in production:
>
> First, raw usage data from utility APIs - this is what you'd get from Austin Energy's Green Button API. Just kWh numbers and billing history, no insights.
>
> Second, user profile data from our onboarding flow - I'll show you that in a moment. This is how we learn about solar panels, EVs, pools, and customer preferences.
>
> Third, AI-generated insights that we'd cache after analyzing a customer's usage pattern. For the demo, I've pre-generated these to keep things fast, but in production the AI would compute this on first login.
>
> The explanations you're about to see are generated in real-time by GPT-4, just like they would be in production."

---

## Error Handling & Fallbacks

### OpenAI API Failure Strategy

```typescript
async function generateExplanation(
  plan: PlanRecommendation,
  insights: CustomerInsights,
  profile: UserProfile
): Promise<string> {

  const cacheKey = `explanation_${profile.customer_id}_${plan.plan_id}`;

  try {
    // Try OpenAI first
    const explanation = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: buildExplanationPrompt(plan, insights, profile)
      }],
      temperature: 0.7,
      max_tokens: 150,
      timeout: 5000 // 5 second timeout
    });

    const text = explanation.choices[0].message.content;

    // Cache successful result
    await cacheExplanation(cacheKey, text);

    return text;

  } catch (error) {
    console.error('OpenAI API failed:', error);

    // Try to load from cache
    const cached = await loadCachedExplanation(cacheKey);
    if (cached) {
      console.log('Using cached explanation');
      return cached;
    }

    // Fall back to template-based explanation
    console.warn('Using fallback template explanation');
    return generateTemplateExplanation(plan, insights, profile);
  }
}

// Template-based fallback (deterministic, no AI)
function generateTemplateExplanation(
  plan: PlanRecommendation,
  insights: CustomerInsights,
  profile: UserProfile
): string {
  const savings = plan.financial_impact.annual_savings;
  const renewable = plan.renewable_percentage;

  let explanation = `This ${plan.rate_structure} rate plan would save you $${savings.toFixed(0)} annually compared to your current plan. `;

  if (renewable === 100) {
    explanation += `It's powered by 100% renewable energy, aligning with your environmental preferences. `;
  }

  if (plan.monthly_fee === 0) {
    explanation += `With no monthly fee, you'll see even more savings.`;
  } else {
    explanation += `The rate of $${plan.rate_per_kwh.toFixed(3)}/kWh is well below your current rate.`;
  }

  return explanation;
}
```

---

### Graceful Degradation Hierarchy

```
1. ✅ Full AI Experience
   - Real-time GPT-4 analysis + explanations
   - <3 second response time

2. ⚠️ Partial AI Experience
   - Use cached Layer 3 insights (if available)
   - Generate new explanations with GPT-4
   - ~2 second response time

3. ⚠️ Cached Experience
   - Use cached insights AND cached explanations
   - ~1 second response time
   - Show "(Last updated: 3 days ago)" indicator

4. ⚠️ Template-Based Fallback
   - Calculations work, but explanations are template-based
   - ~1 second response time
   - Show "AI explanations temporarily unavailable" notice

5. ❌ Full Failure
   - Display friendly error: "We're having trouble analyzing plans right now"
   - Offer option to try again or contact support
```

---

## Performance Considerations

### Target Performance Metrics

| Metric | Demo Target | Production Target |
|--------|-------------|-------------------|
| Recommendation API response | <3 seconds | <1 second |
| Dashboard load time | <1 second | <500ms |
| OpenAI explanation generation | <2.5 seconds (3 parallel) | <1 second (cached 95%) |
| Usage pattern analysis | Pre-generated | <3 seconds (cached 30 days) |
| Plan catalog refresh | N/A | Daily at 2am |

---

### Optimization Strategies

#### **1. Parallel AI Calls**
```typescript
// Generate top 3 explanations in parallel
const explanations = await Promise.all([
  generateExplanation(topPlans[0], insights, profile),
  generateExplanation(topPlans[1], insights, profile),
  generateExplanation(topPlans[2], insights, profile)
]);
```

#### **2. Memoization**
```typescript
// Cache expensive calculations within session
const memoizedCalculateCost = memoize(calculateProjectedCost);
```

#### **3. Layer 3 Caching Strategy**
```typescript
// Cache AI insights for 30 days or until data changes
const insights = await redis.get(`insights:${customerId}`);
if (!insights || forceRefresh) {
  const fresh = await generateInsights(customerId);
  await redis.setex(`insights:${customerId}`, 30 * 24 * 60 * 60, fresh);
  return fresh;
}
return insights;
```

#### **4. Smart Plan Filtering**
```typescript
// Pre-filter plans before expensive calculations
function filterPlans(plans, preferences, insights) {
  return plans.filter(plan => {
    // Exclude based on hard requirements
    if (plan.contract_length_months > preferences.max_contract_months) return false;
    if (plan.renewable_percentage < preferences.min_renewable) return false;

    // Exclude obviously poor fits
    const estimatedSavings = insights.current_annual_cost - estimateCost(plan, insights.avg_monthly_kwh);
    if (estimatedSavings < 50) return false; // Not worth switching for <$50/year

    return true;
  });
}
```

---

## Security & Privacy Considerations

### Data Protection

**For Demo:**
- Mock customer names and addresses (no real PII)
- No authentication required (dropdown selection)
- All data client-side or in Next.js API routes

**For Production:**
- OAuth 2.0 for utility account connection
- Encrypted data at rest (AES-256)
- Encrypted in transit (TLS 1.3)
- PII handling compliant with CCPA/GDPR
- Anonymize data in logs and analytics
- Secure API key management (environment variables, never committed)

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** React Query + Zustand
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js 20+
- **API:** Next.js API routes
- **AI:** OpenAI SDK (GPT-4)
- **Data Storage (Demo):** JSON files in `/data`
- **Data Storage (Prod):** PostgreSQL + Redis

### Infrastructure
- **Hosting:** Vercel
- **CDN:** Vercel Edge Network
- **Monitoring:** Vercel Analytics
- **Error Tracking:** Sentry (production)

---

## File Structure

```
/energy-recommendation-agent
├── /data                          # Three-layer data model
│   ├── raw_utility_data.json      # Layer 1: What utility API provides
│   ├── user_profiles.json         # Layer 2: Onboarding + preferences
│   ├── system_analysis.json       # Layer 3: AI-generated insights (cached)
│   ├── supplier_plans.json        # Supplier catalog
│   └── usage_assumptions.json     # TOU distribution assumptions
│
├── /src
│   ├── /app                       # Next.js 14 App Router
│   │   ├── page.tsx              # Main dashboard
│   │   ├── onboarding/
│   │   └── api/
│   │       ├── recommendations/route.ts
│   │       ├── customers/[id]/route.ts
│   │       └── analyze/route.ts
│   │
│   ├── /components
│   │   ├── onboarding/
│   │   │   ├── ConnectAccountStep.tsx
│   │   │   ├── HomeAttributesStep.tsx
│   │   │   └── PreferencesStep.tsx
│   │   ├── dashboard/
│   │   │   ├── CustomerDashboard.tsx
│   │   │   ├── UsageChart.tsx
│   │   │   └── CurrentPlanCard.tsx
│   │   └── recommendations/
│   │       ├── RecommendationCard.tsx
│   │       ├── BehaviorSuggestionCard.tsx
│   │       └── ComparisonTable.tsx
│   │
│   ├── /lib
│   │   ├── recommendationEngine.ts    # Core orchestrator
│   │   ├── calculations.ts            # All cost functions
│   │   ├── fitScore.ts                # Scoring algorithm
│   │   ├── behaviorDetection.ts       # Rule-based opportunity detection
│   │   ├── openai.ts                  # AI integration + fallback
│   │   ├── dataLoader.ts              # Load/combine 3 layers
│   │   └── types.ts                   # TypeScript interfaces
│   │
│   └── /utils
│       ├── cache.ts
│       ├── validation.ts
│       └── formatting.ts
│
├── /docs
│   ├── architecture.md               # This document
│   ├── api-spec.md                   # API documentation
│   └── demo-script.md                # Video walkthrough script
│
├── /tests
│   ├── calculations.test.ts          # Critical for demo confidence
│   ├── fitScore.test.ts
│   └── api.test.ts
│
└── package.json
```

---

## Testing Strategy

### Critical Tests for Demo Confidence

```typescript
describe('Cost Calculations', () => {
  test('Sarah (CUST_001) current plan cost matches expected $1,658.40', () => {
    const cost = calculateFixedRateCost(sarahUsage, sarahCurrentPlan);
    expect(cost).toBeCloseTo(1658.40, 2);
  });

  test('Sarah switching to PLAN_004 saves $427.20 annually', () => {
    const currentCost = calculateFixedRateCost(sarahUsage, sarahCurrentPlan);
    const newCost = calculateFixedRateCost(sarahUsage, plan004);
    expect(currentCost - newCost).toBeCloseTo(427.20, 2);
  });

  test('David (solar owner) has negative annual cost with PLAN_004', () => {
    const cost = calculateSolarCost(davidUsage, plan004);
    expect(cost).toBeLessThan(0);
  });

  test('Jessica (EV owner) saves $350+ with TOU plan', () => {
    const flatCost = calculateFixedRateCost(jessicaUsage, jessicaCurrentPlan);
    const touCost = calculateTOUCost(jessicaUsage, plan012, jessicaProfile);
    expect(flatCost - touCost).toBeGreaterThan(350);
  });
});
```

---

## Next Steps for Implementation

### Phase 1: Foundation (Days 1-3)
1. Set up Next.js project with TypeScript
2. Create three-layer data files (refactor existing mock data)
3. Build and test all calculation functions
4. Verify math for all 5 customer scenarios

### Phase 2: AI Integration (Days 4-5)
5. Set up OpenAI API integration
6. Test usage analysis prompt with real data
7. Test explanation generation for top plans
8. Pre-generate Layer 3 for all customers
9. Implement fallback mechanism

### Phase 3: UI Development (Days 6-9)
10. Build onboarding flow
11. Build customer dashboard
12. Build recommendations display
13. Add loading states and animations

### Phase 4: Demo Polish (Days 10-12)
14. Test all 5 scenarios end-to-end
15. Optimize API response times
16. Record demo video
17. Edit and add voiceover

---

## Conclusion

This architecture achieves the critical goal: **demonstrating a realistic system** while maintaining demo simplicity.

**Key Architectural Decisions:**

1. **Three-layer data model** - Separates raw data, user context, and AI insights to match production reality
2. **Hybrid AI approach** - Real-time GPT-4 for explanations, pre-generated analysis for reliability
3. **Rule-based behavior detection** - No AI needed, deterministic and testable
4. **Comprehensive fallback strategy** - Demo won't fail if OpenAI has issues
5. **Production-credible design** - Easy to explain how demo would scale to production

**What Makes This Architecture Strong:**

- ✅ Separates concerns clearly (data, logic, presentation)
- ✅ Shows understanding of real-world data sources
- ✅ Balances sophistication with demo pragmatism
- ✅ Accounts for failures gracefully
- ✅ Performance-conscious design
- ✅ Clear path from demo to production

---

**Questions or need clarification on any section?** Let me know what you'd like to dive deeper into:
- Data refactoring specifics
- Calculation logic details
- AI prompt engineering
- UI component design
- Demo recording strategy

---

*Document authored by Winston, System Architect*
*Gauntlet AI Bootcamp - January 2025*
