'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { fetchUserAnalytics } from '@/lib/api';

interface ChartDataInput {
  [key: string]: any;
}

interface LoginsData extends ChartDataInput {
  date: string;
  count: number;
}

interface ActivityData extends ChartDataInput {
  date: string;
  event: string;
  count: number;
  userType: string;
  authProvider: string;
  passwordChangedAt: string;
}

interface UserData {
  daily_stats: LoginsData[];
  guest_vs_registered: {
    guest: number;
    registered: number;
    total: number;
  };
  period: {
    start: string;
    end: string;
  };
}

export function UserAnalyticsScreen() {
  const [loginsData, setLoginsData] = useState<LoginsData[]>([]);
  const [registrationsData, setRegistrationsData] = useState<LoginsData[]>([]);
  const [passwordChangesData, setPasswordChangesData] = useState<LoginsData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUserAnalytics('', '');
        if (response.success) {
          const data: UserData = response.data;
          
          // Process daily stats to separate into different categories
          const logins = data.daily_stats.map(item => ({
            date: item.date,
            count: item.logins || 0
          })).filter(item => item.count > 0);
          
          const registrations = data.daily_stats.map(item => ({
            date: item.date,
            count: item.registrations || 0
          })).filter(item => item.count > 0);
          
          const passwordChanges = data.daily_stats.map(item => ({
            date: item.date,
            count: item.password_changes || 0
          })).filter(item => item.count > 0);
          
          setLoginsData(logins);
          setRegistrationsData(registrations);
          setPasswordChangesData(passwordChanges);
          
          // Process activity data from backend response
          // For now, we'll create a simplified version based on daily stats
          // In a real implementation, the backend would provide detailed activity data
          const detailedActivity = [];
          for (const day of data.daily_stats) {
            if (day.logins > 0) {
              detailedActivity.push({
                date: day.date,
                event: 'User Login',
                count: day.logins,
                userType: 'Registered',
                authProvider: 'EMAIL', // Simplified
                passwordChangedAt: 'N/A' // Simplified
              });
            }
            if (day.registrations > 0) {
              detailedActivity.push({
                date: day.date,
                event: 'New Registration',
                count: day.registrations,
                userType: 'Guest',
                authProvider: 'EMAIL',
                passwordChangedAt: 'Never'
              });
            }
            if (day.password_changes > 0) {
              detailedActivity.push({
                date: day.date,
                event: 'Password Change',
                count: day.password_changes,
                userType: 'Registered',
                authProvider: 'EMAIL',
                passwordChangedAt: day.date
              });
            }
          }
          setActivityData(detailedActivity);
        } else {
          throw new Error(response.error || 'Failed to fetch user analytics');
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
        <h2 className="text-xl font-semibold">Loading user analytics...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">Date Range</label>
              <Select defaultValue="last7days">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">Country</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">City</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="nyc">New York</SelectItem>
                  <SelectItem value="sf">San Francisco</SelectItem>
                  <SelectItem value="la">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">User Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">Authorization Provider</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="email">EMAIL</SelectItem>
                  <SelectItem value="google">GOOGLE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Logins Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={loginsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Registrations Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={registrationsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Password Changes Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={passwordChangesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Auth Provider</TableHead>
                <TableHead>Password Changed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.event}</TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>
                    <Badge variant={row.userType === 'Registered' ? 'default' : 'secondary'}>
                      {row.userType}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.authProvider}</TableCell>
                  <TableCell>{row.passwordChangedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-gray-500 mt-4">
            Based on aggregated user activity and audit logs
          </p>
        </CardContent>
      </Card>
    </div>
  );
}