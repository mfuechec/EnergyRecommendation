'use client';

import { EnrichedCustomer } from '@/lib/types';
import UsageChart from './UsageChart';

interface CustomerDashboardProps {
  customer: EnrichedCustomer;
  loading: boolean;
  onGetRecommendations: () => void;
  onBack: () => void;
}

export default function CustomerDashboard({
  customer,
  loading,
  onGetRecommendations,
  onBack,
}: CustomerDashboardProps) {
  const { raw_data, profile, insights } = customer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {profile.personal.display_name}
          </h2>
          <p className="text-gray-600 mt-1">{insights.segment_description}</p>
        </div>
        <button onClick={onBack} className="btn-secondary">
          ← Change Customer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Current Annual Cost</div>
          <div className="text-3xl font-bold text-gray-900">
            ${insights.financial_analysis.current_annual_cost.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            ${(insights.financial_analysis.current_annual_cost / 12).toFixed(0)}/month
          </div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Average Usage</div>
          <div className="text-3xl font-bold text-gray-900">
            {insights.usage_analysis.avg_monthly_kwh.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">kWh/month</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Time on Plan</div>
          <div className="text-3xl font-bold text-gray-900">
            {insights.financial_analysis.years_on_current_plan}
          </div>
          <div className="text-sm text-gray-600 mt-1">years</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Potential Savings</div>
          <div className="text-3xl font-bold text-primary-600">
            ${insights.estimated_max_savings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">per year</div>
        </div>
      </div>

      {/* Usage Pattern */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          12-Month Usage Pattern
        </h3>
        <UsageChart usageHistory={raw_data.usage_history as any} />
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Pattern Type</div>
            <div className="font-semibold">
              {insights.usage_analysis.pattern_type
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Peak Month</div>
            <div className="font-semibold">
              {insights.usage_analysis.peak_month && insights.usage_analysis.peak_kwh
                ? `${insights.usage_analysis.peak_month} (${insights.usage_analysis.peak_kwh?.toLocaleString()} kWh)`
                : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Seasonal Variance</div>
            <div className="font-semibold">
              {typeof insights.usage_analysis.seasonal_variance_pct === 'number'
                ? `${Math.round(insights.usage_analysis.seasonal_variance_pct * 10) / 10}%`
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Provider</div>
            <div className="font-semibold">{raw_data.current_plan.provider}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Plan</div>
            <div className="font-semibold">{raw_data.current_plan.plan_name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Rate</div>
            <div className="font-semibold">
              ${raw_data.current_plan.rate_per_kwh}/kWh
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Monthly Fee</div>
            <div className="font-semibold">${raw_data.current_plan.monthly_fee}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Renewable</div>
            <div className="font-semibold">
              {raw_data.current_plan.renewable_percentage}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Contract</div>
            <div className="font-semibold">
              {raw_data.current_plan.contract_length_months === 0
                ? 'Month-to-month'
                : `${raw_data.current_plan.contract_length_months} months`}
            </div>
          </div>
        </div>

        {/* Rate History */}
        {insights.financial_analysis.rate_trend.increases_count > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-semibold text-yellow-800">
              ⚠️ Rate Increases Detected
            </div>
            <div className="text-sm text-yellow-700 mt-1">
              Your rate has increased {insights.financial_analysis.rate_trend.total_increase_pct}%
              over {insights.financial_analysis.years_on_current_plan} years (
              {insights.financial_analysis.rate_trend.increases_count} increases)
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      {(insights.risk_factors.length > 0 || insights.opportunities.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk Factors */}
          {insights.risk_factors.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Factors</h3>
              <ul className="space-y-2">
                {insights.risk_factors.map((risk, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <span className="text-sm text-gray-700">
                      {risk.replace(/_/g, ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opportunities */}
          {insights.opportunities.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Opportunities</h3>
              <ul className="space-y-2">
                {insights.opportunities.map((opp, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-700">
                      {opp.replace(/_/g, ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick={onGetRecommendations}
          disabled={loading}
          className="btn-primary text-lg px-12 py-4"
        >
          {loading ? 'Generating Recommendations...' : 'Get My Recommendations'}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          AI will analyze 20 plans and find your best options
        </p>
      </div>
    </div>
  );
}
