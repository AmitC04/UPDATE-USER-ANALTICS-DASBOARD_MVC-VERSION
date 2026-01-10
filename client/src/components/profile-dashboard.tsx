'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { fetchUser } from '@/lib/api';

interface UserData {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  auth_provider: string;
  password_changed_at: string;
}

export function ProfileDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchUser();
        if (res.success) {
          setUserData(res.data);
        } else {
          setError(res.error || 'Failed to fetch user data');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error loading profile</h2>
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
        <h2 className="text-xl font-semibold">Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">User ID</label>
              <p className="font-medium">{userData?.user_id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Email</label>
              <p className="font-medium">{userData?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">First Name</label>
              <p className="font-medium">{userData?.first_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Last Name</label>
              <p className="font-medium">{userData?.last_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Auth Provider</label>
              <p className="font-medium">{userData?.auth_provider}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Password Changed At</label>
              <p className="font-medium">{userData?.password_changed_at}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}