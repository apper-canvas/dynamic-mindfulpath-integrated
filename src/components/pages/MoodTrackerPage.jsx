import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorFeedback from '@/components/atoms/ErrorFeedback';
import ToggleTabs from '@/components/molecules/ToggleTabs';
import MoodLogForm from '@/components/organisms/MoodLogForm';
import MoodTrendsChart from '@/components/organisms/MoodTrendsChart';

import { moodService } from '@/services';

const MoodTrackerPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('today');

  // Today's mood form
  const [selectedMood, setSelectedMood] = useState('');
  const [moodNotes, setMoodNotes] = useState('');
  const [todaysMood, setTodaysMood] = useState(null);

  // Trends data
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [todayEntry, weekly, monthly] = await Promise.all([
        moodService.getTodaysEntry(),
        moodService.getWeeklyTrends(),
        moodService.getMonthlyTrends()
      ]);

      setTodaysMood(todayEntry);
      setWeeklyTrends(weekly);
      setMonthlyTrends(monthly);

      if (todayEntry) {
        setSelectedMood(todayEntry.mood);
        setMoodNotes(todayEntry.notes || '');
      } else {
        setSelectedMood('');
        setMoodNotes('');
      }
    } catch (err) {
      setError(err.message || 'Failed to load mood data');
      toast.error('Failed to load mood data');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const moodData = {
        date: today,
        mood: selectedMood,
        notes: moodNotes
      };

      if (todaysMood) {
        await moodService.update(todaysMood.id, moodData);
        toast.success('Mood updated successfully!');
      } else {
        await moodService.create(moodData);
        toast.success('Mood logged successfully!');
      }

      await loadData();
    } catch (error) {
      toast.error('Failed to save mood');
    } finally {
      setLoading(false);
    }
  };

  const viewTabs = [
    { id: 'today', label: 'Today\'s Mood', icon: 'Plus' },
    { id: 'trends', label: 'Mood Trends', icon: 'TrendingUp' }
  ];

  if (loading && !todaysMood && weeklyTrends.length === 0) {
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
          Mood Tracker
        </Text>
        <Text as="p" className="text-gray-600">
          Track your daily emotions and visualize your mood patterns
        </Text>
      </div>

      <ToggleTabs tabs={viewTabs} activeTab={activeView} setActiveTab={setActiveView} className="max-w-md" />

      {/* Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeView === 'today' && (
          <MoodLogForm
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            moodNotes={moodNotes}
            setMoodNotes={setMoodNotes}
            todaysMood={todaysMood}
            loading={loading}
            onSubmit={handleMoodSubmit}
          />
        )}

        {activeView === 'trends' && (
          <div className="space-y-6">
            <MoodTrendsChart trends={weeklyTrends} title="Weekly Mood Trends" />
            <MoodTrendsChart trends={monthlyTrends} title="Monthly Mood Trends" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MoodTrackerPage;