import { promises as fs } from 'fs';
import path from 'path';
import {
  RawCustomerData,
  UserProfile,
  CustomerInsights,
  EnrichedCustomer,
  SupplierPlan,
} from './types';

// ============================================================================
// Data File Paths
// ============================================================================

const DATA_DIR = path.join(process.cwd(), 'data');

const DATA_FILES = {
  rawUtilityData: path.join(DATA_DIR, 'raw_utility_data.json'),
  userProfiles: path.join(DATA_DIR, 'user_profiles.json'),
  systemAnalysis: path.join(DATA_DIR, 'system_analysis.json'),
  supplierPlans: path.join(DATA_DIR, 'supplier_plans.json'),
  usageAssumptions: path.join(DATA_DIR, 'usage_assumptions.json'),
};

// ============================================================================
// Layer 1: Raw Utility Data
// ============================================================================

let rawDataCache: { customers: RawCustomerData[] } | null = null;

export async function loadRawUtilityData(customerId?: string): Promise<RawCustomerData | RawCustomerData[]> {
  if (!rawDataCache) {
    const fileContent = await fs.readFile(DATA_FILES.rawUtilityData, 'utf-8');
    rawDataCache = JSON.parse(fileContent);
  }

  if (customerId) {
    const customer = rawDataCache!.customers.find((c) => c.customer_id === customerId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found in raw utility data`);
    }
    return customer;
  }

  return rawDataCache!.customers;
}

// ============================================================================
// Layer 2: User Profiles
// ============================================================================

let profilesCache: { profiles: UserProfile[] } | null = null;

export async function loadUserProfile(customerId: string): Promise<UserProfile> {
  if (!profilesCache) {
    const fileContent = await fs.readFile(DATA_FILES.userProfiles, 'utf-8');
    profilesCache = JSON.parse(fileContent);
  }

  const profile = profilesCache!.profiles.find((p) => p.customer_id === customerId);
  if (!profile) {
    throw new Error(`Profile for customer ${customerId} not found`);
  }

  return profile;
}

export async function loadAllUserProfiles(): Promise<UserProfile[]> {
  if (!profilesCache) {
    const fileContent = await fs.readFile(DATA_FILES.userProfiles, 'utf-8');
    profilesCache = JSON.parse(fileContent);
  }

  return profilesCache!.profiles;
}

// ============================================================================
// Layer 3: AI-Generated Insights
// ============================================================================

let insightsCache: { insights: CustomerInsights[] } | null = null;

export async function loadSystemAnalysis(customerId: string): Promise<CustomerInsights> {
  if (!insightsCache) {
    const fileContent = await fs.readFile(DATA_FILES.systemAnalysis, 'utf-8');
    insightsCache = JSON.parse(fileContent);
  }

  const insights = insightsCache!.insights.find((i) => i.customer_id === customerId);
  if (!insights) {
    throw new Error(`Insights for customer ${customerId} not found`);
  }

  return insights;
}

// ============================================================================
// Enriched Customer (All 3 Layers Combined)
// ============================================================================

export async function loadEnrichedCustomer(customerId: string): Promise<EnrichedCustomer> {
  const [rawData, profile, insights] = await Promise.all([
    loadRawUtilityData(customerId) as Promise<RawCustomerData>,
    loadUserProfile(customerId),
    loadSystemAnalysis(customerId),
  ]);

  return {
    raw_data: rawData,
    profile,
    insights,
  };
}

// ============================================================================
// Supplier Plans
// ============================================================================

let plansCache: { plans: SupplierPlan[] } | null = null;

export async function loadSupplierPlans(zipCode?: string): Promise<SupplierPlan[]> {
  if (!plansCache) {
    const fileContent = await fs.readFile(DATA_FILES.supplierPlans, 'utf-8');
    plansCache = JSON.parse(fileContent);
  }

  // For demo, all plans are Austin-based, so ignore zip code filtering
  return plansCache!.plans;
}

export async function loadSupplierPlan(planId: string): Promise<SupplierPlan> {
  if (!plansCache) {
    const fileContent = await fs.readFile(DATA_FILES.supplierPlans, 'utf-8');
    plansCache = JSON.parse(fileContent);
  }

  const plan = plansCache!.plans.find((p) => p.plan_id === planId);
  if (!plan) {
    throw new Error(`Plan ${planId} not found`);
  }

  return plan;
}

// ============================================================================
// Customer List (For Dropdown)
// ============================================================================

export interface CustomerListItem {
  customer_id: string;
  display_name: string;
  description: string;
}

export async function loadCustomerList(): Promise<CustomerListItem[]> {
  const profiles = await loadAllUserProfiles();
  const insights = await loadAllInsights();

  return profiles.map((profile) => {
    const insight = insights.find((i) => i.customer_id === profile.customer_id);

    return {
      customer_id: profile.customer_id,
      display_name: profile.personal.display_name,
      description: insight?.segment_description || 'Customer profile',
    };
  });
}

async function loadAllInsights(): Promise<CustomerInsights[]> {
  if (!insightsCache) {
    const fileContent = await fs.readFile(DATA_FILES.systemAnalysis, 'utf-8');
    insightsCache = JSON.parse(fileContent);
  }

  return insightsCache!.insights;
}

// ============================================================================
// Cache Clearing (for testing)
// ============================================================================

export function clearAllCaches() {
  rawDataCache = null;
  profilesCache = null;
  insightsCache = null;
  plansCache = null;
}
