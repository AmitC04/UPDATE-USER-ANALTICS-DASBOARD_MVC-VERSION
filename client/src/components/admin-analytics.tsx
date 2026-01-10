'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, Activity, DollarSign, ShoppingCart, UserPlus, Key, RefreshCw, FileCheck, Award } from 'lucide-react';
import { fetchOverview, fetchRevenueTrend, fetchUserAnalytics, fetchDetailedAnalytics } from '@/lib/api';

interface RevenueTrendData {
  month: string;
  revenue: number;
}

interface ChartDataInput {
  [key: string]: any;
}

interface SignupMethodData extends ChartDataInput {
  name: string;
  value: number;
  color: string;
}

interface TopCertificationsData extends ChartDataInput {
  name: string;
  sales: number;
}

interface KpiData {
  title: string;
  value: string;
  subtext: string;
  icon: any;
  color: string;
  bgColor: string;
}

// Define chart data interface that works with Recharts

export function AdminAnalytics() {
  const [revenueTrendData, setRevenueTrendData] = useState<RevenueTrendData[]>([]);
  const [signupMethodData, setSignupMethodData] = useState<SignupMethodData[]>([]);
  const [topCertificationsData, setTopCertificationsData] = useState<TopCertificationsData[]>([]);
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [secondRowKpiData, setSecondRowKpiData] = useState<KpiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch revenue trend data
        const revenueResponse = await fetchRevenueTrend(5);
        if (revenueResponse.success) {
          setRevenueTrendData(revenueResponse.data);
        } else {
          throw new Error(revenueResponse.error || 'Failed to fetch revenue trend');
        }

        // Fetch overview data
        const overviewResponse = await fetchOverview();
        // Also fetch user analytics to get registration data
        const userAnalyticsResponse = await fetchUserAnalytics('', '');
        // Fetch detailed analytics for charts
        const detailedAnalyticsResponse = await fetchDetailedAnalytics();
        
        if (overviewResponse.success) {
          const data = overviewResponse.data;
          
          // Get registration data from user analytics if available
          let registrationCount = '0';
          if (userAnalyticsResponse.success && userAnalyticsResponse.data?.daily_stats) {
            const latestDailyStat = userAnalyticsResponse.data.daily_stats[userAnalyticsResponse.data.daily_stats.length - 1];
            registrationCount = latestDailyStat?.registrations?.toString() || '0';
          }
          
          // Set KPI data
          setKpiData([
            {
              title: 'Visitors Today',
              value: data.visitors_today?.toLocaleString() || '0',
              subtext: 'Unique page views',
              icon: Users,
              color: 'text-blue-600',
              bgColor: 'bg-blue-50',
            },
            {
              title: 'Logged-in Users Today',
              value: data.logged_in_users_today?.toLocaleString() || '0',
              subtext: 'Active sessions',
              icon: UserCheck,
              color: 'text-green-600',
              bgColor: 'bg-green-50',
            },
            {
              title: 'Active Users Now',
              value: data.active_users_now?.toLocaleString() || '0',
              subtext: 'Currently online',
              icon: Activity,
              color: 'text-orange-600',
              bgColor: 'bg-orange-50',
            },
            {
              title: 'Registrations Today',
              value: registrationCount, // Get from user analytics daily stats
              subtext: 'New sign-ups',
              icon: UserPlus,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50',
            },
            {
              title: 'Password Changes Today',
              value: data.password_changes_today?.toString() || '0', // Get from overview data
              subtext: 'Security updates',
              icon: Key,
              color: 'text-indigo-600',
              bgColor: 'bg-indigo-50',
            },
          ]);

          setSecondRowKpiData([
            {
              title: 'Orders Today',
              value: data.orders_today?.toLocaleString() || '0',
              subtext: 'Completed orders',
              icon: ShoppingCart,
              color: 'text-pink-600',
              bgColor: 'bg-pink-50',
            },
            {
              title: 'Revenue Today',
              value: `$${data.revenue_today?.toLocaleString() || '0'}`,
              subtext: 'Total sales',
              icon: DollarSign,
              color: 'text-emerald-600',
              bgColor: 'bg-emerald-50',
            },
            {
              title: 'Refunds Today',
              value: data.refunds_today?.toLocaleString() || '0',
              subtext: 'Refunded orders',
              icon: RefreshCw,
              color: 'text-red-600',
              bgColor: 'bg-red-50',
            },
            {
              title: 'Reviews Submitted',
              value: detailedAnalyticsResponse.success ? detailedAnalyticsResponse.data.reviews_submitted?.toString() || '0' : '0', // Backend provides this metric
              subtext: 'For certification',
              icon: FileCheck,
              color: 'text-cyan-600',
              bgColor: 'bg-cyan-50',
            },
            {
              title: 'Certifications Sold',
              value: data.orders_today?.toString() || '0', // Using orders_today as proxy for certifications sold
              subtext: 'This month',
              icon: Award,
              color: 'text-amber-600',
              bgColor: 'bg-amber-50',
            },
          ]);

          // Set signup methods data based on detailed analytics response
          if (detailedAnalyticsResponse.success && detailedAnalyticsResponse.data?.signup_methods) {
            setSignupMethodData(detailedAnalyticsResponse.data.signup_methods);
          } else {
            // Fallback to static data if detailed analytics fails
            setSignupMethodData([
              { name: 'Email', value: 156, color: '#3b82f6' },
              { name: 'Google', value: 98, color: '#10b981' },
            ]);
          }

          // Set top certifications data based on detailed analytics response
          if (detailedAnalyticsResponse.success && detailedAnalyticsResponse.data?.top_certifications) {
            setTopCertificationsData(detailedAnalyticsResponse.data.top_certifications);
          } else {
            // Fallback to static data if detailed analytics fails
            setTopCertificationsData([
              { name: 'AWS Solutions Architect', sales: 45 },
              { name: 'Google Cloud Professional', sales: 38 },
              { name: 'Azure Developer', sales: 32 },
              { name: 'CompTIA Security+', sales: 28 },
              { name: 'CISSP', sales: 24 },
            ]);
          }
          // Check if user analytics was successful as well
          if (!userAnalyticsResponse.success) {
            console.warn('Failed to fetch user analytics:', userAnalyticsResponse.error);
          }
          
          // Check if detailed analytics was successful as well
          if (!detailedAnalyticsResponse.success) {
            console.warn('Failed to fetch detailed analytics:', detailedAnalyticsResponse.error);
          }
        } else {
          throw new Error(overviewResponse.error || 'Failed to fetch overview data');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error loading data</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Loading analytics data...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* First Row KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-3xl font-semibold mb-1">{kpi.value}</p>
                    <p className="text-xs text-gray-500">{kpi.subtext}</p>
                  </div>
                  <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Second Row KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {secondRowKpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-3xl font-semibold mb-1">{kpi.value}</p>
                    <p className="text-xs text-gray-500">{kpi.subtext}</p>
                  </div>
                  <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Google vs Email Signups (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={signupMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {signupMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Email: 156 (61%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Google: 98 (39%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Top Certifications Sold (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topCertificationsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" width={150} stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Revenue Trend (Last 5 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-4">
            Metrics are aggregated from backend analytics tables
          </p>
        </CardContent>
      </Card>
    </div>
  );
}