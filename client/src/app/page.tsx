'use client';

import { useState } from 'react';
import { AdminDashboard } from '@/components/admin-dashboard';
import { AdminAnalytics } from '@/components/admin-analytics';
import { UserAnalyticsScreen } from '@/components/user-analytics-screen';
import { ConversionFunnelScreen } from '@/components/conversion-funnel-screen';
import { UXInsightsScreen } from '@/components/ux-insights-screen';
import { ProfileDashboard } from '@/components/profile-dashboard';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-semibold text-blue-600 mb-4">
              User Activity Analytics
            </h1>
            <nav className="flex gap-1">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-t-lg transition-colors font-medium ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('admin-analytics')}
                className={`px-4 py-2 rounded-t-lg transition-colors font-medium ${
                  currentPage === 'admin-analytics'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Admin Analytics
              </button>
              <button
                onClick={() => setCurrentPage('user-analytics')}
                className={`px-4 py-2 rounded-t-lg transition-colors font-medium ${
                  currentPage === 'user-analytics'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                User Analytics
              </button>
              <button
                onClick={() => setCurrentPage('conversion')}
                className={`px-4 py-2 rounded-t-lg transition-colors font-medium ${
                  currentPage === 'conversion'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Conversion Funnel
              </button>
              <button
                onClick={() => setCurrentPage('ux-insights')}
                className={`px-4 py-2 rounded-t-lg transition-colors font-medium ${
                  currentPage === 'ux-insights'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                UX Insights
              </button>
              <button
                onClick={() => setCurrentPage('profile')}
                className={`px-4 py-2 rounded-t-lg transition-colors font-medium ${
                  currentPage === 'profile'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8">
          {currentPage === 'dashboard' && <AdminDashboard />}
          {currentPage === 'admin-analytics' && <AdminAnalytics />}
          {currentPage === 'user-analytics' && <UserAnalyticsScreen />}
          {currentPage === 'conversion' && <ConversionFunnelScreen />}
          {currentPage === 'ux-insights' && <UXInsightsScreen />}
          {currentPage === 'profile' && <ProfileDashboard />}
        </div>
      </div>
    </div>
  );
}