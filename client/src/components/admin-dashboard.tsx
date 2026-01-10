'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { 
  Users, 
  UserCheck, 
  Activity, 
  DollarSign, 
  ShoppingCart, 
  RefreshCw,
  Shield,
  UserCog,
  Clock
} from 'lucide-react';
import { fetchOverview } from '@/lib/api';

interface AnalyticsData {
  visitors_today: number;
  logged_in_users_today: number;
  active_users_now: number;
  revenue_today: number;
  orders_today: number;
  refunds_today: number;
  recent_activity: Array<{ action: string; user: string; time: string }>;
  recent_profile_updates: Array<{ user: string; field: string; time: string }>;
  password_changes_today: number;
  profile_updates_today: number;
  last_sensitive_change: string | null;
}

export function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOverview();
        if (response.success) {
          setAnalyticsData(response.data);
        } else {
          setError(response.error || 'Failed to fetch data');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define icons for the KPI widgets
  const kpiWidgets = [
    {
      title: 'Visitors Today',
      value: loading ? 'Loading...' : analyticsData?.visitors_today?.toLocaleString() || '0',
      subtext: 'Unique page views',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Logged-in Users Today',
      value: loading ? 'Loading...' : analyticsData?.logged_in_users_today?.toLocaleString() || '0',
      subtext: 'Active sessions',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Users Now',
      value: loading ? 'Loading...' : analyticsData?.active_users_now?.toLocaleString() || '0',
      subtext: 'Currently online',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Revenue Today',
      value: loading ? 'Loading...' : `$${analyticsData?.revenue_today?.toLocaleString() || '0'}`,
      subtext: 'Total sales',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Orders Today',
      value: loading ? 'Loading...' : analyticsData?.orders_today?.toLocaleString() || '0',
      subtext: 'Completed orders',
      icon: ShoppingCart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Refunds Today',
      value: loading ? 'Loading...' : analyticsData?.refunds_today?.toLocaleString() || '0',
      subtext: 'Refunded orders',
      icon: RefreshCw,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* KPI Widgets */}
      <div className="grid grid-cols-3 gap-6">
        {kpiWidgets.map((widget, index) => {
          const Icon = widget.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{widget.title}</p>
                    <p className="text-3xl font-semibold mb-1">{widget.value}</p>
                    <p className="text-xs text-gray-500">{widget.subtext}</p>
                  </div>
                  <div className={`${widget.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${widget.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security & Profile Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Password Changes */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Password Changes Today</h3>
                <p className="text-3xl font-semibold">{loading ? '...' : analyticsData?.password_changes_today || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Security updates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Updates */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-cyan-50 p-3 rounded-lg">
                <UserCog className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Profile Updates Today</h3>
                <p className="text-3xl font-semibold">{loading ? '...' : analyticsData?.profile_updates_today || 0}</p>
                <p className="text-xs text-gray-500 mt-1">User data changes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Sensitive Change */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-amber-50 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Last Sensitive Change</h3>
                <p className="text-lg font-semibold">{loading ? '...' : analyticsData?.last_sensitive_change ? new Date(analyticsData.last_sensitive_change).toLocaleTimeString() : 'No changes'}</p>
                <p className="text-xs text-gray-500 mt-1">Latest activity time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Profile Updates */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Loading activity...</p>
              ) : analyticsData?.recent_activity.length ? (
                analyticsData.recent_activity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user}</p>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(activity.time).toLocaleTimeString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Who Updated Profile Data */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Profile Updates</h3>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Loading updates...</p>
              ) : analyticsData?.recent_profile_updates.length ? (
                analyticsData.recent_profile_updates.map((update, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{update.user}</p>
                      <p className="text-xs text-gray-500">Updated: {update.field}</p>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(update.time).toLocaleTimeString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent updates</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}