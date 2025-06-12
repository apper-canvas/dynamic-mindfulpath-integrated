import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Text from '@/components/atoms/Text';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorFeedback from '@/components/atoms/ErrorFeedback';
import DashboardDailyOverview from '@/components/organisms/DashboardDailyOverview';
import GratitudeStreakCard from '@/components/organisms/GratitudeStreakCard';
import DashboardRecentActivity from '@/components/organisms/DashboardRecentActivity';
import DashboardQuickActions from '@/components/organisms/DashboardQuickActions';

import {
  moodService,
  therapyService,
  allergyService,
  gratitudeService,
  screenTimeService
} from '@/services';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    todaysMood: null,
    todaysGratitude: null,
    todaysScreenTime: null,
    recentTherapy: null,
    recentAllergies: [],
    gratitudeStreak: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        todaysMood,
        todaysGratitude,
        todaysScreenTime,
        recentTherapy,
        recentAllergies,
        gratitudeStreak
      ] = await Promise.all([
        moodService.getTodaysEntry(),
        gratitudeService.getTodaysEntry(),
        screenTimeService.getTodaysEntry(),
        therapyService.getRecentSessions(1),
        allergyService.getRecentEpisodes(3),
        gratitudeService.getCurrentStreak()
      ]);

      setDashboardData({
        todaysMood,
        todaysGratitude,
        todaysScreenTime,
        recentTherapy: recentTherapy[0] || null,
        recentAllergies,
        gratitudeStreak
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorFeedback message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Text as="h1" className="text-3xl font-heading font-bold text-gray-800 mb-2">
          Welcome back!
        </Text>
        <Text as="p" className="text-gray-600">
          Here's an overview of your wellness journey today
        </Text>
      </div>

      {/* Today's Entries Grid */}
      <DashboardDailyOverview
        todaysMood={dashboardData.todaysMood}
        todaysGratitude={dashboardData.todaysGratitude}
        todaysScreenTime={dashboardData.todaysScreenTime}
        navigate={navigate}
      />

      {/* Streaks and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GratitudeStreakCard streak={dashboardData.gratitudeStreak} delay={0.4} />
        <DashboardRecentActivity
          recentTherapy={dashboardData.recentTherapy}
          recentAllergies={dashboardData.recentAllergies}
          delay={0.5}
        />
      </div>

      {/* Quick Actions */}
      <DashboardQuickActions navigate={navigate} delay={0.6} />
    </div>
  );
};

export default DashboardPage;