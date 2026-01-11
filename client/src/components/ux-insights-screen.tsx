'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, Map, MousePointerClick, Info, ExternalLink } from 'lucide-react';

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
              onClick={() => window.open('https://clarity.microsoft.com/projects/view/uzfew3kuik/session-playback', '_blank')}
              className="group relative bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-8 hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-xl cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">View Session Replays</h3>
                <p className="text-sm opacity-90">
                  Watch recorded user sessions and interactions
                </p>
                <ExternalLink className="w-4 h-4 absolute top-4 right-4 opacity-60" />
              </div>
            </button>

            <button 
              onClick={() => window.open('https://clarity.microsoft.com/projects/view/uzfew3kuik/heatmaps', '_blank')}
              className="group relative bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-8 hover:from-purple-600 hover:to-purple-700 transition-all hover:shadow-xl cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Map className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">View Heatmaps</h3>
                <p className="text-sm opacity-90">
                  Visualize where users click, scroll, and hover
                </p>
                <ExternalLink className="w-4 h-4 absolute top-4 right-4 opacity-60" />
              </div>
            </button>

            <button 
              onClick={() => window.open('https://clarity.microsoft.com/projects/view/uzfew3kuik/frustration', '_blank')}
              className="group relative bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-8 hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow-xl cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <MousePointerClick className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">View Frustration Reports</h3>
                <p className="text-sm opacity-90">
                  Identify frustration points and UI issues
                </p>
                <ExternalLink className="w-4 h-4 absolute top-4 right-4 opacity-60" />
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <Info className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-1">External UX Analytics Platform</h4>
                  <p className="text-sm text-gray-700">
                    Detailed UX behavior is handled externally via{' '}
                    <span className="font-medium text-blue-600">Microsoft Clarity</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Privacy & Data Storage</h4>
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

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Avg. Session Duration</p>
              <p className="text-3xl font-semibold text-blue-600">4m 32s</p>
              <p className="text-xs text-gray-500 mt-1">+12% vs last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Bounce Rate</p>
              <p className="text-3xl font-semibold text-orange-600">28.4%</p>
              <p className="text-xs text-gray-500 mt-1">-5% vs last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Pages per Session</p>
              <p className="text-3xl font-semibold text-purple-600">3.8</p>
              <p className="text-xs text-gray-500 mt-1">+8% vs last week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">UX Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">User Engagement</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Page Load Performance</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">User Satisfaction</span>
                <span className="text-sm font-medium">79%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '79%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Mobile Experience</span>
                <span className="text-sm font-medium">84%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}