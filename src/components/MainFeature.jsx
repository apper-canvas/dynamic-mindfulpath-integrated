import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { moodService, gratitudeService, screenTimeService } from '../services';

const moodOptions = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'text-green-500' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-500' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'text-yellow-500' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'text-red-500' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'text-purple-500' }
];

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('mood');
  const [loading, setLoading] = useState(false);
  
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
      }
      if (gratitude) {
        setGratitudeContent(gratitude.content);
      }
      if (screenTime) {
        setScreenHours(screenTime.hours.toString());
        setScreenMinutes(screenTime.minutes.toString());
      }
    } catch (error) {
      toast.error('Failed to load today\'s data');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

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

  const handleGratitudeSubmit = async (e) => {
    e.preventDefault();
    if (!gratitudeContent.trim()) {
      toast.error('Please enter your gratitude');
      return;
    }

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

  const handleScreenTimeSubmit = async (e) => {
    e.preventDefault();
    const hours = parseInt(screenHours) || 0;
    const minutes = parseInt(screenMinutes) || 0;

    if (hours === 0 && minutes === 0) {
      toast.error('Please enter screen time');
      return;
    }

    if (minutes >= 60) {
      toast.error('Minutes must be less than 60');
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
          Quick Log
        </h1>
        <p className="text-gray-600">
          Track your wellness journey with today's entries
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ApperIcon name={tab.icon} size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        {activeTab === 'mood' && (
          <form onSubmit={handleMoodSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                How are you feeling today?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {moodOptions.map((mood) => (
                  <motion.button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMood === mood.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{mood.emoji}</div>
                    <div className={`text-sm font-medium ${
                      selectedMood === mood.id ? 'text-primary' : 'text-gray-700'
                    }`}>
                      {mood.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                placeholder="Any thoughts about your mood today?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedMood}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : todaysMood ? 'Update Mood' : 'Log Mood'}
            </button>
          </form>
        )}

        {activeTab === 'gratitude' && (
          <form onSubmit={handleGratitudeSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What are you grateful for today?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Take a moment to reflect on one thing that brings you joy
              </p>
            </div>

            <div>
              <textarea
                value={gratitudeContent}
                onChange={(e) => setGratitudeContent(e.target.value)}
                placeholder="I'm grateful for..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !gratitudeContent.trim()}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : todaysGratitude ? 'Update Gratitude' : 'Log Gratitude'}
            </button>
          </form>
        )}

        {activeTab === 'screentime' && (
          <form onSubmit={handleScreenTimeSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Today's Screen Time
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Track your daily digital device usage
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={screenHours}
                  onChange={(e) => setScreenHours(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={screenMinutes}
                  onChange={(e) => setScreenMinutes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : todaysScreenTime ? 'Update Screen Time' : 'Log Screen Time'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default MainFeature;