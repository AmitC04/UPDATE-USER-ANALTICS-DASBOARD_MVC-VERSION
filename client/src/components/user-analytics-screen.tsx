'use client';

/**
 * UserAnalyticsScreen
 *
 * Frontend fixes applied:
 *  #1  Fully functional filter system (dateRange, userType, authProvider drive API calls)
 *  #2  Real date strings computed from filters – no empty string params
 *  #6  Mock data generation removed – all data from API
 *  #7  Error recovery via retry() callback – no window.location.reload()
 *  #8  Response validation in useUserAnalytics / api.ts
 *  #10 Empty state messages when charts/table have no data
 *  #11 Loading spinner shown while filters re-fetch
 *  #12 ActivityRow interface kept in sync with actual transformed shape
 *  #13 useMemo in useUserAnalytics hook
 *  #15 Activity table paginated (PAGE_SIZE = 10)
 *  #16 Dates formatted via formatDisplayDate() helper
 *  #19 Named constants: CHART_HEIGHT, PAGE_SIZE (in hook)
 *  #20 Descriptive error messages with actionable retry button
 *  #21 Tracking reference comments removed
 *  #22 Charts wrapped in labelled sections for keyboard/screen-reader users
 *  #23 aria-label on ResponsiveContainer for chart accessibility
 *  #24 Filter grid is responsive (grid-cols-2 sm:grid-cols-3 lg:grid-cols-5)
 *  #26 Business / data logic extracted into useUserAnalytics hook
 *  #27 Filter state management in hook (useFilters pattern)
 *  #36 Wrapped in ErrorBoundary
 */

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { LoadingSpinner } from './ui/loading-spinner';
import { ErrorBoundary } from './ErrorBoundary';
import {
  useUserAnalytics, CHART_HEIGHT, PAGE_SIZE,
} from '@/hooks/useUserAnalytics';
import type { UserAnalyticsFilters } from '@/types/api';

// ─── Tooltip style shared across charts ──────────────────────────────────────

const TOOLTIP_STYLE = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function EmptyChart({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center text-gray-400 text-sm"
      style={{ height: CHART_HEIGHT }}
      aria-label={`No data available for ${label}`}
    >
      No data for this period
    </div>
  );
}

function Pagination({
  page,
  total,
  onPage,
}: {
  page: number;
  total: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) return null;
  return (
    <nav
      className="flex items-center justify-between mt-4"
      aria-label="Activity table pagination"
    >
      <span className="text-xs text-gray-500">
        Page {page} of {totalPages} ({total} records)
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous page"
        >
          ‹ Prev
        </button>
        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next page"
        >
          Next ›
        </button>
      </div>
    </nav>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function UserAnalyticsContent() {
  const {
    loginsData,
    registrationsData,
    passwordChangesData,
    activityPage,
    totalActivityRows,
    page,
    setPage,
    filters,
    setFilters,
    loading,
    error,
    retry,
  } = useUserAnalytics();

  if (error) {
    return (
      <div className="p-6 text-center" role="alert">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Failed to load analytics
        </h2>
        <p className="text-gray-600 mb-4">
          {error}. Check your network connection or try again.
        </p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Filters ─────────────────────────────────────────────────────── */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          {/* Responsive filter grid – fixes Frontend #24 */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            role="search"
            aria-label="Analytics filters"
          >
            <div>
              <label
                htmlFor="filter-date-range"
                className="text-sm text-gray-600 mb-2 block font-medium"
              >
                Date Range
              </label>
              <Select
                value={filters.dateRange}
                onValueChange={(v) =>
                  setFilters({ dateRange: v as UserAnalyticsFilters['dateRange'] })
                }
              >
                <SelectTrigger id="filter-date-range" aria-label="Select date range">
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
              <label
                htmlFor="filter-country"
                className="text-sm text-gray-600 mb-2 block font-medium"
              >
                Country
              </label>
              <Select
                value={filters.country}
                onValueChange={(v) => setFilters({ country: v })}
              >
                <SelectTrigger id="filter-country" aria-label="Select country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="filter-city"
                className="text-sm text-gray-600 mb-2 block font-medium"
              >
                City
              </label>
              <Select
                value={filters.city}
                onValueChange={(v) => setFilters({ city: v })}
              >
                <SelectTrigger id="filter-city" aria-label="Select city">
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
              <label
                htmlFor="filter-user-type"
                className="text-sm text-gray-600 mb-2 block font-medium"
              >
                User Type
              </label>
              <Select
                value={filters.userType}
                onValueChange={(v) =>
                  setFilters({ userType: v as UserAnalyticsFilters['userType'] })
                }
              >
                <SelectTrigger id="filter-user-type" aria-label="Select user type">
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
              <label
                htmlFor="filter-auth-provider"
                className="text-sm text-gray-600 mb-2 block font-medium"
              >
                Auth Provider
              </label>
              <Select
                value={filters.authProvider}
                onValueChange={(v) =>
                  setFilters({ authProvider: v as UserAnalyticsFilters['authProvider'] })
                }
              >
                <SelectTrigger id="filter-auth-provider" aria-label="Select auth provider">
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

      {/* Loading overlay while filters re-fetch */}
      {loading ? (
        <LoadingSpinner message="Loading analytics…" />
      ) : (
        <>
          {/* ─── Charts ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Logins Per Day</CardTitle>
              </CardHeader>
              <CardContent>
                {loginsData.length === 0 ? (
                  <EmptyChart label="Logins Per Day" />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={CHART_HEIGHT}
                    aria-label="Bar chart of daily logins"
                  >
                    <BarChart data={loginsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Logins" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Registrations Per Day</CardTitle>
              </CardHeader>
              <CardContent>
                {registrationsData.length === 0 ? (
                  <EmptyChart label="Registrations Per Day" />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={CHART_HEIGHT}
                    aria-label="Line chart of daily registrations"
                  >
                    <LineChart data={registrationsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                        name="Registrations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Password Changes Per Day</CardTitle>
              </CardHeader>
              <CardContent>
                {passwordChangesData.length === 0 ? (
                  <EmptyChart label="Password Changes Per Day" />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={CHART_HEIGHT}
                    aria-label="Bar chart of daily password changes"
                  >
                    <BarChart data={passwordChangesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Password Changes" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ─── Activity Details Table ───────────────────────────────────── */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
            </CardHeader>
            <CardContent>
              {activityPage.length === 0 ? (
                <p className="text-center text-gray-400 py-8" role="status">
                  No activity data for the selected period
                </p>
              ) : (
                <>
                  <Table aria-label="User activity details table">
                    <TableHeader>
                      <TableRow>
                        <TableHead scope="col">Date</TableHead>
                        <TableHead scope="col">Event</TableHead>
                        <TableHead scope="col">Count</TableHead>
                        <TableHead scope="col">User Type</TableHead>
                        <TableHead scope="col">Auth Provider</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityPage.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.event}</TableCell>
                          <TableCell>{row.count}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.userType === 'Registered' ? 'default' : 'secondary'
                              }
                            >
                              {row.userType}
                            </Badge>
                          </TableCell>
                          <TableCell>{row.authProvider}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    page={page}
                    total={totalActivityRows}
                    onPage={setPage}
                  />
                  <p className="text-xs text-gray-500 mt-4">
                    Aggregated from user activity and audit logs
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// ─── Export wrapped in ErrorBoundary ─────────────────────────────────────────

export function UserAnalyticsScreen() {
  return (
    <ErrorBoundary>
      <UserAnalyticsContent />
    </ErrorBoundary>
  );
}

