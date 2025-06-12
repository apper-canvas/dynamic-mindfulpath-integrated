import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ToggleTabs from '@/components/molecules/ToggleTabs';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

import MoodLogForm from '@/components/organisms/MoodLogForm';
import GratitudeLogForm from '@/components/organisms/GratitudeLogForm';
import ScreenTimeLogForm from '@/components/organisms/ScreenTimeLogForm';

import { moodService, gratitudeService, screenTimeService } from '@/services';

const QuickLogSection = () => {
  const [activeTab, setActiveTab] = useState('mood');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state for initial data load

  // Mood tracking state
  const [selectedMood, setSelectedMood] = useState('');
  const [moodNotes, setMoodNotes] = useState('');
  const [todaysMood, setTodaysMood] = useState(null);

  // Gratitude state
  const [gratitudeContent, setGratitudeContent] = useState('');
  const [todaysGratitude, setTodaysGratitude] = useState(null);

  // Screen time state
  const [screenHours, setScreenHours] = useState('');
  const [screenMinutes, setScreenMinutes] = useState('');
  const [todaysScreenTime, setTodaysScreenTime] = useState(null);

  useEffect(() => {
    loadTodaysData();
  }, []);

  const loadTodaysData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mood, gratitude, screenTime] = await Promise.all([
        moodService.getTodaysEntry(),
        gratitudeService.getTodaysEntry(),
        screenTimeService.getTodaysEntry()
      ]);

      setTodaysMood(mood);
      setTodaysGratitude(gratitude);
      setTodaysScreenTime(screenTime);

      if (mood) {
        setSelectedMood(mood.mood);
        setMoodNotes(mood.notes || '');
      } else {
        setSelectedMood('');
        setMoodNotes('');
      }
      if (gratitude) {
        setGratitudeContent(gratitude.content);
      } else {
        setGratitudeContent('');
      }
      if (screenTime) {
        setScreenHours(screenTime.hours.toString());
        setScreenMinutes(screenTime.minutes.toString());
      } else {
        setScreenHours('');
        setScreenMinutes('');
      }
    } catch (err) {
      setError(err.message || 'Failed to load today\'s data');
      toast.error('Failed to load today\'s data');
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

      await loadTodaysData();
    } catch (error) {
      toast.error('Failed to save mood');
    } finally {
      setLoading(false);
    }
  };

  const handleGratitudeSubmit = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const gratitudeData = {
        date: today,
        content: gratitudeContent.trim()
      };

      if (todaysGratitude) {
        await gratitudeService.update(todaysGratitude.id, gratitudeData);
        toast.success('Gratitude updated successfully!');
      } else {
        await gratitudeService.create(gratitudeData);
        toast.success('Gratitude logged successfully!');
      }

      await loadTodaysData();
    } catch (error) {
      toast.error('Failed to save gratitude');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenTimeSubmit = async () => {
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

      if (todaysScreenTime) {
        await screenTimeService.update(todaysScreenTime.id, screenTimeData);
        toast.success('Screen time updated successfully!');
      } else {
        await screenTimeService.create(screenTimeData);
        toast.success('Screen time logged successfully!');
      }

      await loadTodaysData();
    } catch (error) {
      toast.error('Failed to save screen time');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'mood', label: 'Mood Tracker', icon: 'Smile' },
    { id: 'gratitude', label: 'Gratitude', icon: 'Heart' },
    { id: 'screentime', label: 'Screen Time', icon: 'Smartphone' }
  ];

  if (loading && !todaysMood && !todaysGratitude && !todaysScreenTime) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Text as="h1" className="text-2xl font-heading font-bold text-gray-800 mb-2">
          Quick Log
        </Text>
        <Text as="p" className="text-gray-600">
          Track your wellness journey with today's entries
        </Text>
      </div>

      <ToggleTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'mood' && (
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

        {activeTab === 'gratitude' && (
          <GratitudeLogForm
            gratitudeContent={gratitudeContent}
            setGratitudeContent={setGratitudeContent}
            todaysEntry={todaysGratitude}
            loading={loading}
            onSubmit={handleGratitudeSubmit}
          />
        )}

        {activeTab === 'screentime' && (
          <ScreenTimeLogForm
            screenHours={screenHours}
            setScreenHours={setScreenHours}
            screenMinutes={screenMinutes}
            setScreenMinutes={setScreenMinutes}
            todaysEntry={todaysScreenTime}
            loading={loading}
            onSubmit={handleScreenTimeSubmit}
          />
        )}
      </motion.div>
    </>
  );
};

export default QuickLogSection;