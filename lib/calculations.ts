import {
  MonthlyUsage,
  SolarMonthlyUsage,
  SupplierPlan,
  UserProfile,
  TOUDistribution,
  UsageAssumptions,
} from './types';

// ============================================================================
// Cost Calculation Functions
// ============================================================================

/**
 * Calculate annual cost for a fixed-rate plan
 */
export function calculateFixedRateCost(
  usageHistory: MonthlyUsage[],
  plan: SupplierPlan
): number {
  if (!plan.rate_per_kwh) {
    throw new Error('Fixed rate plan must have rate_per_kwh');
  }

  let totalCost = 0;

  for (const month of usageHistory) {
    totalCost += month.kwh * plan.rate_per_kwh;
  }

  // Add annual fixed costs
  totalCost += plan.monthly_fee * 12;

  return Math.round(totalCost * 100) / 100;
}

/**
 * Calculate annual cost for a variable-rate plan
 */
export function calculateVariableRateCost(
  usageHistory: MonthlyUsage[],
  plan: SupplierPlan
): number {
  if (!plan.rate_per_kwh_base || !plan.rate_per_kwh_peak || !plan.peak_months) {
    throw new Error('Variable rate plan must have base rate, peak rate, and peak months');
  }

  let totalCost = 0;

  for (const month of usageHistory) {
    const monthNum = new Date(month.month).getMonth() + 1;
    const rate = plan.peak_months.includes(monthNum)
      ? plan.rate_per_kwh_peak
      : plan.rate_per_kwh_base;

    totalCost += month.kwh * rate;
  }

  // Add annual fixed costs
  totalCost += plan.monthly_fee * 12;

  return Math.round(totalCost * 100) / 100;
}

/**
 * Get usage distribution assumptions based on customer profile
 */
function getUsageAssumptions(profile: UserProfile): TOUDistribution {
  // Start with baseline residential assumptions
  let assumptions: TOUDistribution = {
    peak_pct: 0.20,
    offpeak_pct: 0.50,
    super_offpeak_pct: 0.30,
  };

  // Adjust for work from home
  if (profile.home_attributes.work_from_home) {
    assumptions = {
      peak_pct: 0.18,
      offpeak_pct: 0.58,
      super_offpeak_pct: 0.24,
    };
  }

  return assumptions;
}

/**
 * Calculate annual cost for a time-of-use plan
 */
export function calculateTOUCost(
  usageHistory: MonthlyUsage[],
  plan: SupplierPlan,
  profile: UserProfile
): number {
  if (
    !plan.rate_per_kwh_peak ||
    !plan.rate_per_kwh_offpeak ||
    !plan.rate_per_kwh_super_offpeak
  ) {
    throw new Error('TOU plan must have peak, off-peak, and super off-peak rates');
  }

  let totalCost = 0;
  const assumptions = getUsageAssumptions(profile);

  for (const month of usageHistory) {
    let baselineKwh = month.kwh;

    // Handle EV usage separately
    if (profile.home_attributes.has_ev) {
      const evKwh = profile.home_attributes.ev_monthly_kwh_estimate || 400;
      baselineKwh -= evKwh;

      // Assume 90% of EV charging during super off-peak (if charging overnight)
      const evOptimized = profile.home_attributes.ev_typical_charging_time?.includes('11pm');
      if (evOptimized) {
        const evCost =
          evKwh * 0.90 * plan.rate_per_kwh_super_offpeak +
          evKwh * 0.10 * plan.rate_per_kwh_offpeak;
        totalCost += evCost;
      } else {
        // Not optimized - spread across peak/off-peak
        const evCost =
          evKwh * 0.30 * plan.rate_per_kwh_peak +
          evKwh * 0.50 * plan.rate_per_kwh_offpeak +
          evKwh * 0.20 * plan.rate_per_kwh_super_offpeak;
        totalCost += evCost;
      }
    }

    // Handle pool usage separately
    if (profile.home_attributes.has_pool) {
      // Estimate pool usage based on month (seasonal)
      const monthNum = new Date(month.month).getMonth() + 1;
      let poolKwh = 0;
      if ([5, 6, 7, 8, 9].includes(monthNum)) {
        poolKwh = 450; // Peak pool season
      } else if ([3, 4, 10].includes(monthNum)) {
        poolKwh = 250; // Shoulder season
      } else {
        poolKwh = 60; // Winter
      }

      baselineKwh -= poolKwh;

      if (profile.home_attributes.pool_optimized) {
        // All super off-peak
        totalCost += poolKwh * plan.rate_per_kwh_super_offpeak;
      } else {
        // Assume running during peak hours (2pm-10pm)
        totalCost += poolKwh * plan.rate_per_kwh_peak;
      }
    }

    // Baseline usage distributed across TOU periods
    const baselineCost =
      baselineKwh *
      (assumptions.peak_pct * plan.rate_per_kwh_peak +
        assumptions.offpeak_pct * plan.rate_per_kwh_offpeak +
        assumptions.super_offpeak_pct * plan.rate_per_kwh_super_offpeak);

    totalCost += baselineCost;
  }

  // Add annual fixed costs
  totalCost += plan.monthly_fee * 12;

  return Math.round(totalCost * 100) / 100;
}

/**
 * Calculate annual cost for a solar plan with buyback
 */
export function calculateSolarCost(
  usageHistory: SolarMonthlyUsage[],
  plan: SupplierPlan
): number {
  if (!plan.rate_per_kwh || !plan.solar_buyback_rate) {
    throw new Error('Solar plan must have rate_per_kwh and solar_buyback_rate');
  }

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

  // Add annual fixed costs
  annualCost += plan.monthly_fee * 12;

  // Subtract any remaining unused credits (may result in negative cost!)
  annualCost -= creditBalance;

  return Math.round(annualCost * 100) / 100;
}

/**
 * Main dispatcher: calculate projected cost based on plan type
 */
export function calculateProjectedCost(
  usageHistory: MonthlyUsage[] | SolarMonthlyUsage[],
  plan: SupplierPlan,
  profile: UserProfile
): number {
  // Check if this is solar usage data
  const isSolarData = usageHistory.length > 0 && 'generation_kwh' in usageHistory[0];

  if (isSolarData && plan.solar_buyback_rate && plan.rate_per_kwh) {
    return calculateSolarCost(usageHistory as SolarMonthlyUsage[], plan);
  }

  switch (plan.rate_structure) {
    case 'fixed':
      return calculateFixedRateCost(usageHistory as MonthlyUsage[], plan);

    case 'variable':
      return calculateVariableRateCost(usageHistory as MonthlyUsage[], plan);

    case 'time_of_use':
      return calculateTOUCost(usageHistory as MonthlyUsage[], plan, profile);

    default:
      throw new Error(`Unknown rate structure: ${plan.rate_structure}`);
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate total annual kWh from usage history
 */
export function calculateTotalAnnualKwh(
  usageHistory: MonthlyUsage[] | SolarMonthlyUsage[]
): number {
  if (usageHistory.length === 0) return 0;

  if ('generation_kwh' in usageHistory[0]) {
    // Solar data - use consumption
    return (usageHistory as SolarMonthlyUsage[]).reduce(
      (sum, month) => sum + month.consumption_kwh,
      0
    );
  }

  return (usageHistory as MonthlyUsage[]).reduce((sum, month) => sum + month.kwh, 0);
}

/**
 * Calculate average monthly kWh
 */
export function calculateAvgMonthlyKwh(
  usageHistory: MonthlyUsage[] | SolarMonthlyUsage[]
): number {
  const total = calculateTotalAnnualKwh(usageHistory);
  return Math.round((total / Math.max(usageHistory.length, 1)) * 100) / 100;
}

/**
 * Find peak usage month
 */
export function findPeakMonth(usageHistory: MonthlyUsage[]): { month: string; kwh: number } {
  if (usageHistory.length === 0) return { month: 'Unknown', kwh: 0 };

  const peak = usageHistory.reduce((max, month) =>
    month.kwh > max.kwh ? month : max
  );

  return {
    month: new Date(peak.month).toLocaleString('en-US', { month: 'long' }),
    kwh: peak.kwh,
  };
}

/**
 * Find low usage month
 */
export function findLowMonth(usageHistory: MonthlyUsage[]): { month: string; kwh: number } {
  if (usageHistory.length === 0) return { month: 'Unknown', kwh: 0 };

  const low = usageHistory.reduce((min, month) =>
    month.kwh < min.kwh ? month : min
  );

  return {
    month: new Date(low.month).toLocaleString('en-US', { month: 'long' }),
    kwh: low.kwh,
  };
}

/**
 * Calculate seasonal variance percentage
 */
export function calculateSeasonalVariance(usageHistory: MonthlyUsage[]): number {
  const peak = findPeakMonth(usageHistory);
  const low = findLowMonth(usageHistory);

  if (low.kwh === 0) return 0;

  return Math.round(((peak.kwh - low.kwh) / low.kwh) * 100 * 100) / 100;
}

/**
 * Calculate current annual cost from usage history
 */
export function calculateCurrentAnnualCost(
  usageHistory: MonthlyUsage[],
  currentPlan: { rate_per_kwh: number; monthly_fee: number }
): number {
  const totalKwh = calculateTotalAnnualKwh(usageHistory);
  const energyCost = totalKwh * currentPlan.rate_per_kwh;
  const fixedCost = currentPlan.monthly_fee * 12;

  return Math.round((energyCost + fixedCost) * 100) / 100;
}

/**
 * Calculate years on current plan
 */
export function calculateYearsOnPlan(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  return Math.round(years * 10) / 10;
}

/**
 * Estimate pool kWh for a given month
 */
export function estimatePoolKwh(monthString: string, poolSizeGallons: number = 20000): number {
  const monthNum = new Date(monthString).getMonth() + 1;

  // Base usage scales with pool size
  const sizeFactor = poolSizeGallons / 20000;

  if ([5, 6, 7, 8, 9].includes(monthNum)) {
    // Peak pool season (May-Sep)
    return Math.round(500 * sizeFactor);
  } else if ([3, 4, 10].includes(monthNum)) {
    // Shoulder season (Mar, Apr, Oct)
    return Math.round(250 * sizeFactor);
  } else {
    // Winter (Nov-Feb)
    return Math.round(70 * sizeFactor);
  }
}

/**
 * Calculate pool portion of annual cost
 */
export function calculatePoolPortionCost(
  usageHistory: MonthlyUsage[],
  rate: number,
  poolSizeGallons: number = 20000
): number {
  let poolCost = 0;

  for (const month of usageHistory) {
    const poolKwh = estimatePoolKwh(month.month, poolSizeGallons);
    poolCost += poolKwh * rate;
  }

  return Math.round(poolCost * 100) / 100;
}
