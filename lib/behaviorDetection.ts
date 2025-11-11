import {
  UserProfile,
  RawCustomerData,
  CustomerInsights,
  BehaviorOpportunity,
  SupplierPlan,
} from './types';

// ============================================================================
// Behavior Opportunity Detection
// ============================================================================

export function detectBehaviorOpportunities(
  profile: UserProfile,
  rawData: RawCustomerData,
  insights: CustomerInsights,
  recommendedPlan: SupplierPlan
): BehaviorOpportunity[] | null {
  const opportunities: BehaviorOpportunity[] = [];

  // EV Owner Optimization
  if (profile.home_attributes.has_ev) {
    const evOpportunity = detectEVOptimization(profile, insights, recommendedPlan);
    if (evOpportunity) {
      opportunities.push(evOpportunity);
    }
  }

  // Pool Owner Optimization
  if (profile.home_attributes.has_pool) {
    const poolOpportunity = detectPoolOptimization(profile, insights, recommendedPlan);
    if (poolOpportunity) {
      opportunities.push(poolOpportunity);
    }
  }

  return opportunities.length > 0 ? opportunities : null;
}

// ============================================================================
// EV Optimization Detection
// ============================================================================

function detectEVOptimization(
  profile: UserProfile,
  insights: CustomerInsights,
  recommendedPlan: SupplierPlan
): BehaviorOpportunity | null {
  // Only recommend if the best plan is time-of-use
  if (!recommendedPlan.time_of_use) {
    return null;
  }

  const evKwh = profile.home_attributes.ev_monthly_kwh_estimate || 400;
  const currentRate = insights.financial_analysis.rate_trend.current_rate;
  const superOffPeakRate = recommendedPlan.rate_per_kwh_super_offpeak || 0.045;

  // Check if already charging overnight
  const alreadyOptimized =
    profile.home_attributes.ev_typical_charging_time?.includes('11pm') ||
    profile.home_attributes.ev_typical_charging_time?.includes('overnight');

  const currentMonthlyCost = evKwh * currentRate;
  const optimizedMonthlyCost = evKwh * 0.90 * superOffPeakRate + evKwh * 0.10 * 0.075;
  const monthlySavings = currentMonthlyCost - optimizedMonthlyCost;
  const annualSavings = monthlySavings * 12;

  if (alreadyOptimized) {
    return {
      type: 'ev_time_of_use_switch',
      headline: 'Keep Charging Overnight, Just Switch Plans',
      summary: `You're already doing everything right by charging your ${profile.home_attributes.ev_make_model} overnight. The problem is your current plan charges a flat rate no matter when you use electricity. A time-of-use plan rewards your smart charging habits with super off-peak rates of just $${superOffPeakRate}/kWh.`,
      current_behavior: `Charging overnight on flat-rate plan at $${currentRate}/kWh`,
      recommended_behavior: `Continue charging overnight, but on time-of-use plan at $${superOffPeakRate}/kWh super off-peak rate`,
      implementation: {
        difficulty: 'easy',
        time_to_implement: 'No behavior change needed - just switch plans',
        equipment_needed: null,
        equipment_cost: null,
        steps: [
          `Switch to ${recommendedPlan.plan_name}`,
          'Keep your current charging schedule (11pm-7am)',
          'Track your savings in your account dashboard',
          'Enjoy lower EV charging costs immediately',
        ],
      },
      savings_summary: `Your EV charging cost drops from $${Math.round(currentMonthlyCost)}/month to $${Math.round(optimizedMonthlyCost)}/month—saving you $${Math.round(annualSavings)} per year with zero lifestyle changes.`,
      lifestyle_impact:
        "None. You're already charging at the optimal time. This is pure savings for what you're already doing.",
      confidence: 0.87,
      estimated_annual_savings: Math.round(annualSavings),
    };
  } else {
    return {
      type: 'ev_charging_optimization',
      headline: 'Charge Overnight and Save Big on EV Costs',
      summary: `By switching your ${profile.home_attributes.ev_make_model} charging to overnight hours (11pm-7am) and moving to a time-of-use plan, you can cut your EV charging costs dramatically. The super off-peak rate of $${superOffPeakRate}/kWh is less than half your current rate.`,
      current_behavior: 'Charging at various times on flat-rate plan',
      recommended_behavior: 'Set charging timer to 11pm-7am on time-of-use plan',
      implementation: {
        difficulty: 'easy',
        time_to_implement: '5 minutes to set charging schedule in vehicle',
        equipment_needed: null,
        equipment_cost: null,
        steps: [
          `Switch to ${recommendedPlan.plan_name}`,
          'Open your vehicle app (Tesla app, etc.)',
          'Set charging schedule to start at 11pm',
          'Plug in when you get home, let it charge automatically overnight',
        ],
      },
      savings_summary: `Your EV charging cost drops from $${Math.round(currentMonthlyCost)}/month to $${Math.round(optimizedMonthlyCost)}/month—saving you $${Math.round(annualSavings)} per year.`,
      lifestyle_impact:
        'Minimal. Plug in when you get home, car charges while you sleep. Wake up to a full battery every morning.',
      confidence: 0.85,
      estimated_annual_savings: Math.round(annualSavings),
    };
  }
}

// ============================================================================
// Pool Optimization Detection
// ============================================================================

function detectPoolOptimization(
  profile: UserProfile,
  insights: CustomerInsights,
  recommendedPlan: SupplierPlan
): BehaviorOpportunity | null {
  // Only recommend if the best plan is time-of-use
  if (!recommendedPlan.time_of_use) {
    return null;
  }

  const poolSizeGallons = profile.home_attributes.pool_size_gallons || 20000;
  const avgPoolKwh = 350; // Monthly average
  const currentRate = insights.financial_analysis.rate_trend.current_rate;
  const peakRate = recommendedPlan.rate_per_kwh_peak || 0.160;
  const superOffPeakRate = recommendedPlan.rate_per_kwh_super_offpeak || 0.045;

  const currentMonthlyCost = avgPoolKwh * currentRate;
  const peakMonthlyCost = avgPoolKwh * peakRate; // If they switch to TOU but don't optimize
  const optimizedMonthlyCost = avgPoolKwh * superOffPeakRate;

  const timerCost = 75;
  const annualSavingsFromTimer = (peakMonthlyCost - optimizedMonthlyCost) * 12;
  const annualSavingsTotal = annualSavingsFromTimer - timerCost; // First year
  const paybackMonths = timerCost / (peakMonthlyCost - optimizedMonthlyCost);

  return {
    type: 'pool_timer_optimization',
    headline: 'Install a Timer, Run Pool Overnight, Save $380/Year',
    summary: `Your pool equipment is likely running during expensive peak hours (afternoon/evening). A simple $${timerCost} programmable timer shifts operation to overnight super off-peak hours when electricity costs just $${superOffPeakRate}/kWh instead of $${peakRate}/kWh. Combined with switching to a time-of-use plan, this saves you big.`,
    current_behavior: 'Pool equipment running during peak hours (2pm-10pm)',
    recommended_behavior: 'Install timer, run pool overnight (10pm-6am) on time-of-use plan',
    implementation: {
      difficulty: 'easy',
      time_to_implement: '30 minutes one-time setup',
      equipment_needed: 'Programmable timer (e.g., Intermatic T104)',
      equipment_cost: timerCost,
      steps: [
        `Switch to ${recommendedPlan.plan_name}`,
        `Purchase programmable timer ($${timerCost} at Home Depot/Amazon)`,
          'Install timer on pool equipment circuit (DIY or electrician)',
        'Set timer to run 10pm-6am (8 hours)',
        'Pool stays clean, you save money while you sleep',
      ],
    },
    savings_summary: `Pool costs drop from $${Math.round(currentMonthlyCost)}/month to $${Math.round(optimizedMonthlyCost)}/month. After the $${timerCost} timer investment, you save $${Math.round(annualSavingsTotal)} in year 1, then $${Math.round(annualSavingsFromTimer)}/year ongoing.`,
    lifestyle_impact:
      'Zero. Pool is still clean and ready when you want to swim. Equipment just runs while you sleep instead of during the day.',
    confidence: 0.90,
    estimated_annual_savings: Math.round(annualSavingsTotal),
    payback_period_months: Math.round(paybackMonths * 10) / 10,
  };
}
