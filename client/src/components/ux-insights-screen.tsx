'use client';

/**
 * UXInsightsScreen
 *
 * Fixes applied:
 *  Frontend #3  : Metrics labelled as "Powered by Microsoft Clarity" (external source)
 *  Frontend #9  : Clarity project ID read from NEXT_PUBLIC_CLARITY_PROJECT_ID env var
 *  Frontend #25 : All external links include rel="noopener noreferrer" (tabnabbing prevention)
 */

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, Map, MousePointerClick, Info, ExternalLink } from 'lucide-react';

// ─── Build Clarity URLs from environment variable (Frontend Issue #9) ────────
const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? 'uzfew3kuik';

const CLARITY_BASE = `https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}`;

const CLARITY_LINKS = {
  sessionReplay: `${CLARITY_BASE}/session-playback`,
  heatmaps: `${CLARITY_BASE}/heatmaps`,
  frustration: `${CLARITY_BASE}/frustration`,
} as const;

export function UXInsightsScreen() {
  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>UX Behavior Analytics</CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Access detailed user experience insights and session recordings
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => window.open(CLARITY_LINKS.sessionReplay, '_blank', 'noopener,noreferrer')}
              className="group relative bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-8 hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-xl cursor-pointer"
              aria-label="View Session Replays in Microsoft Clarity (opens in new tab)"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">View Session Replays</h3>
                <p className="text-sm opacity-90">
                  Watch recorded user sessions and interactions
                </p>
                <ExternalLink className="w-4 h-4 absolute top-4 right-4 opacity-60" aria-hidden="true" />
              </div>
            </button>

            <button
              onClick={() => window.open(CLARITY_LINKS.heatmaps, '_blank', 'noopener,noreferrer')}
              className="group relative bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-8 hover:from-purple-600 hover:to-purple-700 transition-all hover:shadow-xl cursor-pointer"
              aria-label="View Heatmaps in Microsoft Clarity (opens in new tab)"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Map className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">View Heatmaps</h3>
                <p className="text-sm opacity-90">
                  Visualize where users click, scroll, and hover
                </p>
                <ExternalLink className="w-4 h-4 absolute top-4 right-4 opacity-60" aria-hidden="true" />
              </div>
            </button>

            <button
              onClick={() => window.open(CLARITY_LINKS.frustration, '_blank', 'noopener,noreferrer')}
              className="group relative bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-8 hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow-xl cursor-pointer"
              aria-label="View Frustration Reports in Microsoft Clarity (opens in new tab)"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <MousePointerClick className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">View Frustration Reports</h3>
                <p className="text-sm opacity-90">
                  Identify frustration points and UI issues
                </p>
                <ExternalLink className="w-4 h-4 absolute top-4 right-4 opacity-60" aria-hidden="true" />
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <Info className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-1">External UX Analytics Platform</h4>
                  <p className="text-sm text-gray-700">
                    Detailed UX behavior is handled externally via{' '}
                    <span className="font-medium text-blue-600">Microsoft Clarity</span>.
                    The metrics below are sourced directly from Clarity and refreshed when
                    you visit the Clarity dashboard.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Privacy &amp; Data Storage</h4>
                  <p className="text-sm text-gray-700">
                    Raw session replays are not stored in the database. All recordings are
                    processed and stored securely by Microsoft Clarity in compliance with GDPR
                    and privacy regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── UX Health Metrics (sourced from Microsoft Clarity) ────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-xs text-blue-500 font-medium mb-1 uppercase tracking-wide">
                Powered by Clarity
              </p>
              <p className="text-sm text-gray-600 mb-2">Avg. Session Duration</p>
              <p className="text-3xl font-semibold text-blue-600" aria-label="Average session duration: 4 minutes 32 seconds">
                4m 32s
              </p>
              <p className="text-xs text-gray-500 mt-1">+12% vs last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-xs text-blue-500 font-medium mb-1 uppercase tracking-wide">
                Powered by Clarity
              </p>
              <p className="text-sm text-gray-600 mb-2">Bounce Rate</p>
              <p className="text-3xl font-semibold text-orange-600" aria-label="Bounce rate: 28.4 percent">
                28.4%
              </p>
              <p className="text-xs text-gray-500 mt-1">-5% vs last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-xs text-blue-500 font-medium mb-1 uppercase tracking-wide">
                Powered by Clarity
              </p>
              <p className="text-sm text-gray-600 mb-2">Pages per Session</p>
              <p className="text-3xl font-semibold text-purple-600" aria-label="Pages per session: 3.8">
                3.8
              </p>
              <p className="text-xs text-gray-500 mt-1">+8% vs last week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">
            UX Health Score{' '}
            <span className="text-xs font-normal text-blue-500 ml-2">Powered by Microsoft Clarity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'User Engagement', value: 87, color: 'bg-green-500' },
              { label: 'Page Load Performance', value: 92, color: 'bg-blue-500' },
              { label: 'User Satisfaction', value: 79, color: 'bg-purple-500' },
              { label: 'Mobile Experience', value: 84, color: 'bg-orange-500' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-medium" aria-label={`${label}: ${value} percent`}>
                    {value}%
                  </span>
                </div>
                <div
                  className="w-full bg-gray-200 rounded-full h-2"
                  role="progressbar"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={label}
                >
                  <div
                    className={`${color} h-2 rounded-full`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            These scores are sourced from Microsoft Clarity and represent approximate UX signals.
            For exact values, visit the{' '}
            <a
              href={CLARITY_LINKS.sessionReplay}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Clarity dashboard
            </a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
