'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchFunnel } from '@/lib/api';

interface FunnelStep {
  step: string;
  count: number;
  dropOff: number;
  color?: string;
}

interface FunnelData {
  funnel: FunnelStep[];
  overall_conversion: number;
}

export function ConversionFunnelScreen() {
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFunnelData = async () => {
      try {
        const response = await fetchFunnel('', '');
        if (response.success && response.data) {
          // Add colors to the funnel steps
          const funnelWithColors = response.data.funnel.map((step: FunnelStep, index: number) => ({
            ...step,
            color: getColorForIndex(index, response.data.funnel.length)
          }));
          
          setFunnelData({
            funnel: funnelWithColors,
            overall_conversion: response.data.overall_conversion
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch funnel data');
      } finally {
        setLoading(false);
      }
    };

    loadFunnelData();
  }, []);

  const getColorForIndex = (index: number, total: number) => {
    // Define a color palette for the funnel steps
    const colors = [
      'bg-blue-500',    // First step - Visitors
      'bg-blue-600',    // Second step - Registered Users
      'bg-indigo-600',  // Third step - Added to Cart
      'bg-purple-600',  // Fourth step - Checkout Started
      'bg-violet-600'   // Fifth step - Payment Success
    ];
    
    // Cycle through colors if there are more steps than predefined colors
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">Loading conversion funnel data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">Error loading funnel data: {error}</div>
      </div>
    );
  }

  if (!funnelData || !funnelData.funnel.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">No funnel data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Conversion Funnel Analysis</CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Track user journey from initial visit to successful payment
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-3">
              {funnelData.funnel.map((step, index) => {
                const widthPercentage = 100 - index * 15;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`${step.color} text-white rounded-lg py-6 px-8 transition-all hover:scale-105 cursor-pointer shadow-md font-medium`}
                      style={{ width: `${widthPercentage}%` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium opacity-100">{step.step}</p>
                          <p className="text-2xl font-bold mt-1">{step.count.toLocaleString()}</p>
                        </div>
                        {step.dropOff > 0 && (
                          <div className="text-right">
                            <p className="text-xs font-medium opacity-90">Drop-off</p>
                            <p className="text-lg font-bold">-{step.dropOff}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < funnelData.funnel.length - 1 && (
                      <ChevronDown className="w-6 h-6 text-gray-400 my-1" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Overall Conversion</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">{funnelData.overall_conversion}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Drop-off per Step</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">
                    {funnelData.funnel.length > 1 
                      ? (funnelData.funnel.slice(1).reduce((sum, step) => sum + step.dropOff, 0) / (funnelData.funnel.length - 1)).toFixed(2) + '%'
                      : '0%'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Steps</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">{funnelData.funnel.length}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6 text-center">
              Derived from user journey events
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Largest drop-off occurs between Visitors and Registered Users (75%)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Cart abandonment rate is 40% (Checkout Started vs Added to Cart)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Payment success rate is 70% once checkout is initiated
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Simplify registration process to reduce friction
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Add email recovery campaigns for abandoned carts
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Optimize checkout flow to minimize payment failures
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}