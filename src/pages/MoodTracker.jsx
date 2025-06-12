import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import { moodService } from '../services';

const moodOptions = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#22c55e', value: 5 },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: '#8b5cf6', value: 4 },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#6b7280', value: 3 },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#eab308', value: 2 },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#3b82f6', value: 1 },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#ef4444', value: 0 }
];

const MoodTracker = () => {
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
      }
    } catch (err) {
      setError(err.message || 'Failed to load mood data');
      toast.error('Failed to load mood data');
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
      
      await loadData();
    } catch (error) {
      toast.error('Failed to save mood');
    } finally {
      setLoading(false);
    }
  };

  const getMoodOption = (moodId) => {
    return moodOptions.find(option => option.id === moodId) || moodOptions[2];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getChartData = (trends) => {
    const data = trends.map(entry => ({
      x: formatDate(entry.date),
      y: getMoodOption(entry.mood).value
    }));

    return {
      series: [{
        name: 'Mood',
        data: data
      }],
      options: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: false
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        colors: ['#7C9885'],
        xaxis: {
          categories: trends.map(entry => formatDate(entry.date)),
          labels: {
            style: {
              colors: '#6b7280'
            }
          }
        },
        yaxis: {
          min: 0,
          max: 5,
          tickAmount: 5,
          labels: {
            formatter: (value) => {
              const mood = moodOptions.find(m => m.value === value);
              return mood ? mood.emoji : '';
            },
            style: {
              colors: '#6b7280'
            }
          }
        },
        grid: {
          borderColor: '#e5e7eb'
        },
        tooltip: {
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const entry = trends[dataPointIndex];
            const mood = getMoodOption(entry.mood);
            return `
              <div class="p-3 bg-white shadow-lg rounded-lg border">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-lg">${mood.emoji}</span>
                  <span class="font-semibold">${mood.label}</span>
                </div>
                <div class="text-sm text-gray-600">${formatDate(entry.date)}</div>
                ${entry.notes ? `<div class="text-sm text-gray-700 mt-1">${entry.notes}</div>` : ''}
              </div>
            `;
          }
        }
      }
    };
  };

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
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load mood data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
          Mood Tracker
        </h1>
        <p className="text-gray-600">
          Track your daily emotions and visualize your mood patterns
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg max-w-md">
        {[
          { id: 'today', label: 'Today\'s Mood', icon: 'Plus' },
          { id: 'trends', label: 'Mood Trends', icon: 'TrendingUp' }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === view.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ApperIcon name={view.icon} size={16} />
            <span>{view.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeView === 'today' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleMoodSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  How are you feeling today?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                      <div className="text-3xl mb-2">{mood.emoji}</div>
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
                  rows={4}
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
          </div>
        )}

        {activeView === 'trends' && (
          <div className="space-y-6">
            {/* Chart Toggle */}
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('weekly')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Weekly Trends
              </button>
              <button
                onClick={() => setActiveView('monthly')}
                className="px-4 py-2 bg-secondary text-gray-700 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Monthly Trends
              </button>
            </div>

            {/* Weekly Chart */}
            {(activeView === 'weekly' || activeView === 'trends') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Weekly Mood Trends
                </h3>
                {weeklyTrends.length > 0 ? (
                  <Chart
                    options={getChartData(weeklyTrends).options}
                    series={getChartData(weeklyTrends).series}
                    type="line"
                    height={350}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-4" />
                    <p>No mood data available for the past week</p>
                    <p className="text-sm mt-1">Start logging your mood to see trends</p>
                  </div>
                )}
              </div>
            )}

            {/* Monthly Chart */}
            {activeView === 'monthly' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Monthly Mood Trends
                </h3>
                {monthlyTrends.length > 0 ? (
                  <Chart
                    options={getChartData(monthlyTrends).options}
                    series={getChartData(monthlyTrends).series}
                    type="line"
                    height={350}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-4" />
                    <p>No mood data available for the past month</p>
                    <p className="text-sm mt-1">Start logging your mood to see trends</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MoodTracker;