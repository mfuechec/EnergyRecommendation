'use client';

import { useState, useEffect } from 'react';
import { CustomerListItem } from '@/lib/dataLoader';
import { EnrichedCustomer, RecommendationResponse } from '@/lib/types';
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';
import RecommendationsDisplay from '@/components/recommendations/RecommendationsDisplay';

export default function Home() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customer, setCustomer] = useState<EnrichedCustomer | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load customer list on mount
  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch('/api/customers');
        const data = await response.json();
        setCustomers(data.customers);
      } catch (err) {
        console.error('Failed to load customers:', err);
        setError('Failed to load customer list');
      }
    }
    loadCustomers();
  }, []);

  // Load customer data when selection changes
  useEffect(() => {
    async function loadCustomer() {
      if (!selectedCustomerId) {
        setCustomer(null);
        setRecommendations(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/customers/${selectedCustomerId}`);
        if (!response.ok) {
          throw new Error('Failed to load customer');
        }
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        console.error('Failed to load customer:', err);
        setError('Failed to load customer data');
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
  }, [selectedCustomerId]);

  async function getRecommendations() {
    if (!selectedCustomerId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Landing / Customer Selection */}
      {!customer && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Energy Recommendations
            </h2>
            <p className="text-xl text-gray-600">
              Powered by AI. Find the perfect plan for you.
            </p>
          </div>

          <div className="card">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Customer Profile
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                For this demo, choose one of the pre-loaded customer profiles:
              </p>

              <select
                className="select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">-- Select a customer --</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.display_name} - {c.description}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900 mb-1">Find Better Plans</h4>
              <p className="text-sm text-gray-600">
                AI analyzes your usage to find savings
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-2">💡</div>
              <h4 className="font-semibold text-gray-900 mb-1">Optimize Your Usage</h4>
              <p className="text-sm text-gray-600">
                Get personalized tips to reduce costs
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-2">🌱</div>
              <h4 className="font-semibold text-gray-900 mb-1">Go Green</h4>
              <p className="text-sm text-gray-600">
                Switch to renewable energy easily
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Customer Dashboard */}
      {customer && !recommendations && (
        <CustomerDashboard
          customer={customer}
          loading={loading}
          onGetRecommendations={getRecommendations}
          onBack={() => {
            setSelectedCustomerId('');
            setCustomer(null);
          }}
        />
      )}

      {/* Recommendations Display */}
      {customer && recommendations && (
        <RecommendationsDisplay
          customer={customer}
          recommendations={recommendations}
          onBack={() => setRecommendations(null)}
        />
      )}
    </div>
  );
}
