// ============================================================================
// Core Data Types (Three-Layer Model)
// ============================================================================

// Layer 1: Raw Utility Data
export interface MonthlyUsage {
  month: string;
  kwh: number;
  bill_amount?: number;
  days_in_period?: number;
}

export interface SolarMonthlyUsage {
  month: string;
  consumption_kwh: number;
  generation_kwh: number;
  net_from_grid: number;
  net_to_grid: number;
  bill_amount?: number;
  credit_applied?: number;
}

export interface BillingHistoryEntry {
  effective_date: string;
  rate_per_kwh: number;
  change_type: string;
}

export interface CurrentPlan {
  provider: string;
  plan_id: string;
  plan_name: string;
  rate_per_kwh?: number;
  rate_per_kwh_base?: number;
  rate_per_kwh_peak?: number;
  rate_per_kwh_buyback?: number;
  peak_months?: number[];
  monthly_fee: number;
  rate_structure: 'fixed' | 'variable' | 'time_of_use';
  contract_start_date: string;
  contract_end_date: string | null;
  contract_length_months: number;
  early_termination_fee: number;
  renewable_percentage: number;
  time_of_use?: boolean;
  net_metering_type?: string;
}

export interface RawCustomerData {
  customer_id: string;
  account: {
    account_number: string;
    start_date: string;
    status: string;
    meter_type: string;
    service_type: string;
    solar_system_kw?: number;
    solar_install_date?: string;
  };
  service_address: {
    zip_code: string;
    city: string;
    state: string;
    utility: string;
  };
  usage_history: MonthlyUsage[] | SolarMonthlyUsage[];
  current_plan: CurrentPlan;
  billing_history: BillingHistoryEntry[];
}

// Layer 2: User Profile
export interface UserProfile {
  customer_id: string;
  personal: {
    display_name: string;
    email?: string;
    created_at: string;
    onboarding_completed: boolean;
  };
  home_attributes: {
    home_type: string;
    square_feet?: number;
    year_built?: number;
    occupants: number;
    bedrooms?: number;
    has_solar: boolean;
    solar_system_kw?: number | null;
    solar_install_date?: string | null;
    solar_investment_amount?: number | null;
    has_ev: boolean;
    ev_make_model?: string | null;
    ev_year?: number | null;
    ev_battery_kwh?: number | null;
    ev_charging_location?: string | null;
    ev_typical_charging_time?: string | null;
    ev_monthly_kwh_estimate?: number | null;
    has_pool: boolean;
    pool_size_gallons?: number | null;
    pool_type?: string | null;
    pool_equipment?: string | null;
    pool_equipment_schedule?: string | null;
    pool_optimized?: boolean;
    has_hot_tub?: boolean;
    work_from_home: boolean;
    heating_type?: string;
    cooling_type?: string;
    water_heater_type?: string;
  };
  preferences: {
    primary_concern: 'cost_savings' | 'renewable_energy' | 'flexibility' | 'balanced';
    renewable_priority: 'low' | 'moderate' | 'high' | '100_percent';
    max_contract_months: number;
    willing_to_change_behavior: boolean;
    notifications_enabled: boolean;
    notification_types?: string[];
    language: string;
    updated_at: string;
  };
}

// Layer 3: AI-Generated Insights
export interface UsageAnalysis {
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
  summer_avg_kwh?: number;
  winter_avg_kwh?: number;
  baseline_avg_kwh?: number;
  ev_monthly_kwh_detected?: number;
  ev_percentage_of_total?: number;
  pool_avg_monthly_kwh?: number;
  pool_percentage_of_total?: number;
  ev_charging_pattern_detected?: string;
  ev_optimization_opportunity?: string;
  total_consumption_kwh?: number;
  total_generation_kwh?: number;
  net_grid_purchase_kwh?: number;
  total_excess_generation_kwh?: number;
  solar_offset_percentage?: number;
  solar_performance?: string;
}

export interface FinancialAnalysis {
  current_annual_cost: number;
  current_avg_monthly_bill?: number;
  years_on_current_plan: number;
  tenure_category: string;
  rate_trend: {
    direction: string;
    original_rate: number;
    current_rate: number;
    total_increase_pct: number;
    total_increase_absolute?: number;
    increases_count: number;
    avg_annual_increase_pct?: number;
    note?: string;
  };
  vs_market_average: {
    market_avg_rate: number;
    market_avg_annual_cost?: number;
    overpaying_pct: number;
    overpaying_absolute?: number;
    estimated_annual_overpayment: number;
    percentile_rank?: number;
    note?: string;
  };
  solar_roi_analysis?: {
    system_investment: number;
    current_annual_benefit: number;
    current_payback_years: number;
    potential_annual_benefit_better_plan: number;
    potential_payback_years_better_plan: number;
    roi_improvement_opportunity: string;
  };
  ev_portion_of_annual_cost?: number;
  pool_portion_of_annual_cost?: number;
  summer_avg_monthly_bill?: number;
  winter_avg_monthly_bill?: number;
  buyback_credits_received?: number;
  effective_annual_cost?: number;
}

export interface CustomerInsights {
  customer_id: string;
  analysis_version: string;
  generated_at: string;
  expires_at: string;
  cache_ttl_days: number;
  usage_analysis: UsageAnalysis;
  financial_analysis: FinancialAnalysis;
  customer_segment: string;
  segment_confidence: number;
  segment_description: string;
  risk_factors: string[];
  opportunities: string[];
  behavior_analysis?: {
    detected_overnight_usage_increase?: boolean;
    confidence?: number;
    hypothesis?: string;
    recommendation?: string;
    pool_current_schedule_assumed?: string;
    pool_optimal_schedule?: string;
    timer_cost_estimate?: number;
    behavior_change_difficulty?: string;
    lifestyle_impact?: string;
    one_time_setup_required?: boolean;
  };
  ai_recommendation_priority: string;
  estimated_max_savings: number;
  confidence_score: number;
  special_notes?: string;
}

// Enriched Customer (All 3 Layers Combined)
export interface EnrichedCustomer {
  raw_data: RawCustomerData;
  profile: UserProfile;
  insights: CustomerInsights;
}

// ============================================================================
// Supplier Plan Types
// ============================================================================

export interface SupplierPlan {
  plan_id: string;
  provider: string;
  plan_name: string;
  rate_structure: 'fixed' | 'variable' | 'time_of_use';
  rate_per_kwh?: number;
  rate_per_kwh_base?: number;
  rate_per_kwh_peak?: number;
  rate_per_kwh_offpeak?: number;
  rate_per_kwh_super_offpeak?: number;
  peak_months?: number[];
  peak_hours?: string;
  offpeak_hours?: string;
  super_offpeak_hours?: string;
  monthly_fee: number;
  contract_length_months: number;
  early_termination_fee: number;
  renewable_percentage: number;
  renewable_type: string;
  supplier_rating: number;
  customer_reviews: number;
  fact_sheet_url: string;
  special_terms: string;
  minimum_usage_fee: number | null;
  solar_buyback_rate?: number;
  time_of_use: boolean;
  ev_optimized?: boolean;
  smart_home_integration?: boolean;
  notes?: string;
}

// ============================================================================
// Recommendation Types
// ============================================================================

export interface FinancialImpact {
  projected_annual_cost: number;
  annual_savings: number;
  monthly_savings: number;
  savings_percentage: number;
  payback_period_months: number | null;
  total_5yr_savings: number;
}

export interface FitScoreBreakdown {
  cost_score: number;
  renewable_score: number;
  flexibility_score: number;
  rating_score: number;
}

export interface PlanRecommendation {
  rank: number;
  plan_id: string;
  plan_name: string;
  provider: string;
  rate_per_kwh?: number;
  monthly_fee: number;
  rate_structure: string;
  contract_length_months: number;
  renewable_percentage: number;
  financial_impact: FinancialImpact;
  fit_score: number;
  fit_breakdown: FitScoreBreakdown;
  explanation: string;
  key_benefits: string[];
  considerations: string[];
  next_steps: {
    action: string;
    estimated_time_to_complete: string;
    arbor_commission?: number;
  };
}

export interface BehaviorOpportunity {
  type: string;
  headline: string;
  summary: string;
  current_behavior: string;
  recommended_behavior: string;
  implementation: {
    difficulty: string;
    time_to_implement: string;
    equipment_needed: string | null;
    equipment_cost: number | null;
    steps: string[];
  };
  savings_summary: string;
  lifestyle_impact: string;
  confidence: number;
  estimated_annual_savings: number;
  payback_period_months?: number;
}

export interface CurrentPlanAnalysis {
  overpaying_estimate: number;
  vs_market_average_pct: number;
  rate_trend: string;
  loyalty_penalty: string;
}

export interface RecommendationMetadata {
  plans_analyzed: number;
  plans_excluded: number;
  exclusion_reasons: string[];
  ai_explanation_source: string;
  fallback_used: boolean;
}

export interface RecommendationResponse {
  request_id: string;
  generated_at: string;
  processing_time_ms: number;
  customer_summary: {
    customer_id: string;
    display_name: string;
    current_annual_cost: number;
    avg_monthly_kwh: number;
    years_on_plan: number;
  };
  top_recommendations: PlanRecommendation[];
  behavior_suggestions: BehaviorOpportunity[] | null;
  current_plan_analysis: CurrentPlanAnalysis;
  metadata: RecommendationMetadata;
}

// ============================================================================
// Usage Assumptions Types
// ============================================================================

export interface TOUDistribution {
  peak_pct: number;
  offpeak_pct: number;
  super_offpeak_pct: number;
}

export interface UsageAssumptions {
  baseline_residential: TOUDistribution;
  work_from_home?: TOUDistribution;
  ev_charging_optimized?: TOUDistribution;
  ev_charging_not_optimized?: TOUDistribution;
  pool_peak_hours?: TOUDistribution;
  pool_optimized?: TOUDistribution;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface RecommendationRequest {
  customer_id: string;
  preferences?: {
    priority?: 'cost_savings' | 'renewable_energy' | 'flexibility' | 'balanced';
    renewable_preference?: 'low' | 'moderate' | 'high' | '100_percent';
    max_contract_months?: number;
  };
  force_refresh?: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

export type RateStructure = 'fixed' | 'variable' | 'time_of_use';
export type CustomerSegment =
  | 'loyalty_penalty_victim'
  | 'variable_rate_victim'
  | 'solar_buyback_victim'
  | 'ev_owner_flat_rate'
  | 'pool_owner_peak_usage'
  | 'price_conscious_shopper'
  | 'green_energy_advocate';

export type PrimaryConcern = 'cost_savings' | 'renewable_energy' | 'flexibility' | 'balanced';
export type RenewablePriority = 'low' | 'moderate' | 'high' | '100_percent';
