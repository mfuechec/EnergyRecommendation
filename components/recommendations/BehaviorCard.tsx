'use client';

import { BehaviorOpportunity } from '@/lib/types';

interface BehaviorCardProps {
  suggestion: BehaviorOpportunity;
}

export default function BehaviorCard({ suggestion }: BehaviorCardProps) {
  return (
    <div className="card border-2 border-blue-300 bg-blue-50">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">
            BEHAVIOR OPTIMIZATION
          </span>
        </div>
        <h4 className="text-2xl font-bold text-gray-900">{suggestion.headline}</h4>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <p className="text-gray-800 leading-relaxed">{suggestion.summary}</p>
      </div>

      {/* Current vs Recommended */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-semibold text-gray-900 mb-1">Current Behavior</div>
          <p className="text-sm text-gray-700">{suggestion.current_behavior}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-semibold text-gray-900 mb-1">Recommended Behavior</div>
          <p className="text-sm text-gray-700">{suggestion.recommended_behavior}</p>
        </div>
      </div>

      {/* Savings */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Estimated Annual Savings</div>
            <div className="text-3xl font-bold text-green-600">
              ${suggestion.estimated_annual_savings.toLocaleString()}
            </div>
            {suggestion.payback_period_months && (
              <div className="text-sm text-gray-600 mt-1">
                Payback period: {suggestion.payback_period_months} months
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Difficulty</div>
            <div className="font-semibold capitalize">{suggestion.implementation.difficulty}</div>
          </div>
        </div>
      </div>

      {/* Implementation */}
      <div className="mb-4">
        <h5 className="font-semibold text-gray-900 mb-2">Implementation Steps</h5>
        {suggestion.implementation.equipment_needed && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-3">
            <div className="text-sm">
              <strong>Equipment Needed:</strong> {suggestion.implementation.equipment_needed}
            </div>
            {suggestion.implementation.equipment_cost && (
              <div className="text-sm">
                <strong>Cost:</strong> ${suggestion.implementation.equipment_cost}
              </div>
            )}
          </div>
        )}
        <div className="text-sm text-gray-600 mb-2">
          Time to implement: {suggestion.implementation.time_to_implement}
        </div>
        <ol className="space-y-2">
          {suggestion.implementation.steps.map((step, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Lifestyle Impact */}
      <div className="bg-white p-4 rounded-lg">
        <div className="text-sm font-semibold text-gray-900 mb-1">Lifestyle Impact</div>
        <p className="text-sm text-gray-700">{suggestion.lifestyle_impact}</p>
      </div>

      {/* Confidence */}
      <div className="mt-4 flex items-center">
        <div className="text-sm text-gray-600 mr-2">Confidence:</div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${suggestion.confidence * 100}%` }}
          />
        </div>
        <div className="text-sm font-semibold ml-2">
          {(suggestion.confidence * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
