'use client';

import { useState } from 'react';
import { PlanRecommendation } from '@/lib/types';

interface PlanCardProps {
  plan: PlanRecommendation;
}

export default function PlanCard({ plan }: PlanCardProps) {
  const [expanded, setExpanded] = useState(plan.rank === 1);

  return (
    <div
      className={`card ${
        plan.rank === 1
          ? 'border-2 border-primary-500 bg-primary-50'
          : 'border border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {plan.rank === 1 && (
              <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">
                BEST MATCH
              </span>
            )}
            <span className="text-sm font-semibold text-gray-600">
              Rank #{plan.rank}
            </span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">{plan.plan_name}</h4>
          <p className="text-gray-600">{plan.provider}</p>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600">Annual Savings</div>
          <div className="text-3xl font-bold text-primary-600">
            ${plan.financial_impact.annual_savings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            (${plan.financial_impact.monthly_savings.toFixed(0)}/month)
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🤖</span>
          <div>
            <p className="text-gray-800 leading-relaxed">{plan.explanation}</p>
            <p className="text-xs text-gray-500 mt-2">
              AI-generated explanation based on your usage pattern
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Rate</div>
          <div className="font-semibold">
            {plan.rate_per_kwh ? `$${plan.rate_per_kwh.toFixed(3)}/kWh` : 'Variable (TOU)'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Monthly Fee</div>
          <div className="font-semibold">${plan.monthly_fee}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Renewable</div>
          <div className="font-semibold">{plan.renewable_percentage}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Contract</div>
          <div className="font-semibold">
            {plan.contract_length_months === 0
              ? 'Month-to-month'
              : `${plan.contract_length_months} mo`}
          </div>
        </div>
      </div>

      {/* Fit Score */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Fit Score</span>
          <span className="font-semibold">{plan.fit_score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full"
            style={{ width: `${plan.fit_score}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
          <div>
            <div className="text-gray-600">Cost</div>
            <div className="font-semibold">{plan.fit_breakdown.cost_score}</div>
          </div>
          <div>
            <div className="text-gray-600">Green</div>
            <div className="font-semibold">{plan.fit_breakdown.renewable_score}</div>
          </div>
          <div>
            <div className="text-gray-600">Flex</div>
            <div className="font-semibold">{plan.fit_breakdown.flexibility_score}</div>
          </div>
          <div>
            <div className="text-gray-600">Rating</div>
            <div className="font-semibold">{plan.fit_breakdown.rating_score}</div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mb-4">
        <h5 className="font-semibold text-gray-900 mb-2">Key Benefits</h5>
        <ul className="space-y-1">
          {plan.key_benefits.map((benefit, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Considerations */}
      {plan.considerations.length > 0 && (
        <div className="mb-4">
          <h5 className="font-semibold text-gray-900 mb-2">Considerations</h5>
          <ul className="space-y-1">
            {plan.considerations.map((consideration, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="text-yellow-500 mr-2">⚠</span>
                <span className="text-gray-700">{consideration}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expand/Collapse Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
      >
        {expanded ? '▼ Hide Details' : '▶ Show Details'}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h6 className="font-semibold text-gray-900 mb-2">Financial Impact</h6>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Projected Annual Cost:</span>
                  <span className="font-semibold">
                    ${plan.financial_impact.projected_annual_cost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Savings Percentage:</span>
                  <span className="font-semibold">
                    {plan.financial_impact.savings_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5-Year Savings:</span>
                  <span className="font-semibold">
                    ${plan.financial_impact.total_5yr_savings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h6 className="font-semibold text-gray-900 mb-2">Next Steps</h6>
              <div className="space-y-1">
                <div>
                  <span className="text-gray-600">Time to switch:</span>
                  <span className="font-semibold ml-1">
                    {plan.next_steps.estimated_time_to_complete}
                  </span>
                </div>
                {plan.next_steps.arbor_commission && (
                  <div className="text-xs text-gray-500 mt-2">
                    Arbor earns ${plan.next_steps.arbor_commission} commission when you switch
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
