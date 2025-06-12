import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorFeedback from '@/components/atoms/ErrorFeedback';
import ToggleTabs from '@/components/molecules/ToggleTabs';
import ScreenTimeStatsCards from '@/components/organisms/ScreenTimeStatsCards';
import ScreenTimeLogForm from '@/components/organisms/ScreenTimeLogForm';
import ScreenTimeTrendsChart from '@/components/organisms/ScreenTimeTrendsChart';

import { screenTimeService } from '@/services';

const ScreenTimePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('today');

  // Today's screen time form
  const [screenHours, setScreenHours] = useState('');
  const [screenMinutes, setScreenMinutes] = useState('');
  const [todaysEntry, setTodaysEntry] = useState(null);

  // Trends data
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [averageScreenTime, setAverageScreenTime] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [todayEntry, weekly, monthly, average] = await Promise.all([
        screenTimeService.getTodaysEntry(),
        screenTimeService.getWeeklyTrends(),
        screenTimeService.getMonthlyTrends(),
        screenTimeService.getAverageScreenTime(7)
      ]);

      setTodaysEntry(todayEntry);
      setWeeklyTrends(weekly);
      setMonthlyTrends(monthly);
      setAverageScreenTime(average);

      if (todayEntry) {
        setScreenHours(todayEntry.hours.toString());
        setScreenMinutes(todayEntry.minutes.toString());
      } else {
        setScreenHours('');
        setScreenMinutes('');
      }
    } catch (err) {
      setError(err.message || 'Failed to load screen time data');
      toast.error('Failed to load screen time data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const hours = parseInt(screenHours) || 0;
      const minutes = parseInt(screenMinutes) || 0;
      const screenTimeData = {
        date: today,
        hours,
        minutes
      };

      if (todaysEntry) {
        await screenTimeService.update(todaysEntry.id, screenTimeData);
        toast.success('Screen time updated successfully!');
      } else {
        await screenTimeService.create(screenTimeData);
        toast.success('Screen time logged successfully!');
      }

      await loadData();
    } catch (error) {
      toast.error('Failed to save screen time');
    } finally {
      setLoading(false);
    }
  };

  const formatScreenTime = (hours, minutes) => {
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const getTotalMinutes = (hours, minutes) => {
    return (hours * 60) + minutes;
  };

  const viewTabs = [
    { id: 'today', label: 'Log Today', icon: 'Plus' },
    { id: 'trends', label: 'View Trends', icon: 'BarChart3' }
  ];

  if (loading && !todaysEntry && weeklyTrends.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorFeedback message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Text as="h1" className="text-3xl font-heading font-bold text-gray-800 mb-2">
          Screen Time Tracker
        </Text>
        <Text as="p" className="text-gray-600">
          Monitor your digital device usage and identify patterns
        </Text>
      </div>

      <ScreenTimeStatsCards
        todaysEntry={todaysEntry}
        weeklyTrends={weeklyTrends}
        averageScreenTime={averageScreenTime}
        formatScreenTime={formatScreenTime}
        getTotalMinutes={getTotalMinutes}
        onCardClick={setActiveView}
      />

      <ToggleTabs tabs={viewTabs} activeTab={activeView} setActiveTab={setActiveView} className="max-w-md" />

      {/* Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeView === 'today' && (
          <ScreenTimeLogForm
            screenHours={screenHours}
            setScreenHours={setScreenHours}
            screenMinutes={screenMinutes}
            setScreenMinutes={setScreenMinutes}
            todaysEntry={todaysEntry}
            loading={loading}
            onSubmit={handleSubmit}
          />
        )}

        {activeView === 'trends' && (
          <div className="space-y-6">
            <ScreenTimeTrendsChart
              trends={weeklyTrends}
              title="Weekly Screen Time Trends"
              formatScreenTime={formatScreenTime}
              getTotalMinutes={getTotalMinutes}
            />
            <ScreenTimeTrendsChart
              trends={monthlyTrends}
              title="Monthly Screen Time Trends"
              formatScreenTime={formatScreenTime}
              getTotalMinutes={getTotalMinutes}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScreenTimePage;