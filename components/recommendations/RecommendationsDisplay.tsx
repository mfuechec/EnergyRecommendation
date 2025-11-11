'use client';

import { EnrichedCustomer, RecommendationResponse } from '@/lib/types';
import PlanCard from './PlanCard';
import BehaviorCard from './BehaviorCard';

interface RecommendationsDisplayProps {
  customer: EnrichedCustomer;
  recommendations: RecommendationResponse;
  onBack: () => void;
}

export default function RecommendationsDisplay({
  customer,
  recommendations,
  onBack,
}: RecommendationsDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Your Personalized Recommendations
          </h2>
          <p className="text-gray-600 mt-1">
            AI analyzed {recommendations.metadata.plans_analyzed} plans in{' '}
            {(recommendations.processing_time_ms / 1000).toFixed(1)}s
          </p>
        </div>
        <button onClick={onBack} className="btn-secondary">
          ← Back to Dashboard
        </button>
      </div>

      {/* Current Plan Analysis */}
      {recommendations.current_plan_analysis.loyalty_penalty && (
        <div className="card bg-yellow-50 border-2 border-yellow-300">
          <div className="flex items-start">
            <span className="text-3xl mr-4">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loyalty Penalty Detected
              </h3>
              <p className="text-gray-700">
                {recommendations.current_plan_analysis.loyalty_penalty}
              </p>
              <p className="text-gray-700 mt-2">
                You're overpaying by approximately $
                {recommendations.current_plan_analysis.overpaying_estimate} annually (
                {recommendations.current_plan_analysis.vs_market_average_pct.toFixed(1)}% above
                market average).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Recommendations */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Top 3 Plans for You
        </h3>
        <div className="space-y-6">
          {recommendations.top_recommendations.map((plan) => (
            <PlanCard key={plan.plan_id} plan={plan} />
          ))}
        </div>
      </div>

      {/* Behavior Suggestions */}
      {recommendations.behavior_suggestions && recommendations.behavior_suggestions.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Optimize Your Usage
          </h3>
          <div className="space-y-6">
            {recommendations.behavior_suggestions.map((suggestion, index) => (
              <BehaviorCard key={index} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="card bg-gray-50">
        <div className="text-sm text-gray-600">
          <p>
            <strong>AI Source:</strong> {recommendations.metadata.ai_explanation_source}
          </p>
          <p>
            <strong>Plans Analyzed:</strong> {recommendations.metadata.plans_analyzed}
          </p>
          {recommendations.metadata.plans_excluded > 0 && (
            <p>
              <strong>Plans Excluded:</strong> {recommendations.metadata.plans_excluded} (
              {recommendations.metadata.exclusion_reasons.join(', ')})
            </p>
          )}
          <p className="mt-2 text-xs">
            Request ID: {recommendations.request_id}
          </p>
        </div>
      </div>
    </div>
  );
}
