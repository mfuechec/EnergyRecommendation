import {
  SupplierPlan,
  UserProfile,
  CustomerInsights,
  FitScoreBreakdown,
  PrimaryConcern,
} from './types';

// ============================================================================
// Fit Score Weight Configuration
// ============================================================================

interface FitScoreWeights {
  cost: number;
  renewable: number;
  flexibility: number;
  rating: number;
}

/**
 * Get scoring weights based on user priorities
 */
function getWeights(priority: PrimaryConcern): FitScoreWeights {
  switch (priority) {
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

/**
 * Get minimum renewable percentage based on user preference
 */
export function getMinimumRenewable(preference: string): number {
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

// ============================================================================
// Component Score Calculations
// ============================================================================

/**
 * Calculate cost score (0-100)
 * Higher savings = higher score
 */
function calculateCostScore(
  currentAnnualCost: number,
  projectedCost: number
): number {
  const savingsRatio = (currentAnnualCost - projectedCost) / currentAnnualCost;

  // Convert savings ratio to 0-100 score
  // 20% savings = 100 score
  // 0% savings = 0 score
  // Negative savings (more expensive) = 0 score
  const score = Math.min(100, Math.max(0, savingsRatio * 500));

  return Math.round(score * 100) / 100;
}

/**
 * Calculate renewable score (0-100)
 * Simply the renewable percentage
 */
function calculateRenewableScore(renewablePercentage: number): number {
  return Math.min(100, Math.max(0, renewablePercentage));
}

/**
 * Calculate flexibility score (0-100)
 * Shorter contracts = higher score
 */
function calculateFlexibilityScore(contractMonths: number): number {
  if (contractMonths === 0) return 100; // Month-to-month
  if (contractMonths <= 6) return 80;
  if (contractMonths <= 12) return 60;
  if (contractMonths <= 24) return 40;
  return 20; // 24+ months
}

/**
 * Calculate provider rating score (0-100)
 * Convert 5-star rating to 0-100 scale
 */
function calculateRatingScore(rating: number): number {
  return Math.round((rating / 5.0) * 100 * 100) / 100;
}

// ============================================================================
// Main Fit Score Function
// ============================================================================

export interface PlanWithCost extends SupplierPlan {
  projected_cost: number;
}

/**
 * Calculate overall fit score for a plan
 */
export function calculateFitScore(
  plan: PlanWithCost,
  insights: CustomerInsights,
  profile: UserProfile
): { score: number; breakdown: FitScoreBreakdown } {
  const weights = getWeights(profile.preferences.primary_concern);

  // Calculate component scores
  const costScore = calculateCostScore(
    insights.financial_analysis.current_annual_cost,
    plan.projected_cost
  );

  const renewableScore = calculateRenewableScore(plan.renewable_percentage);
  const flexScore = calculateFlexibilityScore(plan.contract_length_months);
  const ratingScore = calculateRatingScore(plan.supplier_rating);

  // Weighted sum
  let finalScore =
    costScore * weights.cost +
    renewableScore * weights.renewable +
    flexScore * weights.flexibility +
    ratingScore * weights.rating;

  // Apply penalties
  if (plan.early_termination_fee > 200) {
    finalScore -= 5;
  }

  // Variable rate is risky for high seasonal variance
  if (
    plan.rate_structure === 'variable' &&
    insights.usage_analysis.seasonal_variance_pct > 100
  ) {
    finalScore -= 10;
  }

  // Bonus for EV owners on TOU plans
  if (profile.home_attributes.has_ev && plan.time_of_use) {
    finalScore += 5;
  }

  // Bonus for solar owners with good buyback rates
  if (
    profile.home_attributes.has_solar &&
    plan.solar_buyback_rate &&
    plan.solar_buyback_rate > 0.10
  ) {
    finalScore += 5;
  }

  // Normalize to 0-100
  finalScore = Math.max(0, Math.min(100, finalScore));

  const breakdown: FitScoreBreakdown = {
    cost_score: Math.round(costScore * 100) / 100,
    renewable_score: Math.round(renewableScore * 100) / 100,
    flexibility_score: Math.round(flexScore * 100) / 100,
    rating_score: Math.round(ratingScore * 100) / 100,
  };

  return {
    score: Math.round(finalScore * 100) / 100,
    breakdown,
  };
}

// ============================================================================
// Plan Filtering
// ============================================================================

/**
 * Filter plans based on user preferences and requirements
 */
export function filterPlans(
  plans: SupplierPlan[],
  profile: UserProfile,
  insights: CustomerInsights
): SupplierPlan[] {
  const minRenewable = getMinimumRenewable(profile.preferences.renewable_priority);
  const maxContract = profile.preferences.max_contract_months;
  const hasSolar = profile.home_attributes.has_solar;

  return plans.filter((plan) => {
    // Filter by contract length
    if (plan.contract_length_months > maxContract) {
      return false;
    }

    // Filter by renewable percentage
    if (plan.renewable_percentage < minRenewable) {
      return false;
    }

    // For solar customers, exclude plans without proper rate_per_kwh
    // (TOU plans with null rate_per_kwh can't be calculated for solar)
    if (hasSolar && !plan.rate_per_kwh) {
      return false;
    }

    // For solar customers, savings might be small in absolute terms but large in percentage
    // Skip the savings filter for very low-cost plans (solar customers)
    const isSolarCustomer = insights.financial_analysis.current_annual_cost < 500;

    if (!isSolarCustomer) {
      // Exclude plans with minimal savings potential
      // (We'll calculate projected cost later, so this is just a rough filter)
      const estimatedCost = insights.usage_analysis.avg_monthly_kwh * 12 * (plan.rate_per_kwh || 0.12);
      const estimatedSavings = insights.financial_analysis.current_annual_cost - estimatedCost;

      // Don't recommend plans that cost more or save less than $50/year
      if (estimatedSavings < 50) {
        return false;
      }
    }

    return true;
  });
}

// ============================================================================
// Ranking and Sorting
// ============================================================================

export interface ScoredPlan extends PlanWithCost {
  fit_score: number;
  fit_breakdown: FitScoreBreakdown;
}

/**
 * Score and rank all plans
 */
export function scoreAndRankPlans(
  plans: PlanWithCost[],
  insights: CustomerInsights,
  profile: UserProfile
): ScoredPlan[] {
  const scoredPlans: ScoredPlan[] = plans.map((plan) => {
    const { score, breakdown } = calculateFitScore(plan, insights, profile);

    return {
      ...plan,
      fit_score: score,
      fit_breakdown: breakdown,
    };
  });

  // Sort by fit score (descending)
  scoredPlans.sort((a, b) => b.fit_score - a.fit_score);

  return scoredPlans;
}
