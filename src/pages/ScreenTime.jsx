import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import { screenTimeService } from '../services';

const ScreenTime = () => {
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
      }
    } catch (err) {
      setError(err.message || 'Failed to load screen time data');
      toast.error('Failed to load screen time data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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

    if (hours > 24) {
      toast.error('Hours cannot exceed 24');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalMinutes = (hours, minutes) => {
    return (hours * 60) + minutes;
  };

  const getChartData = (trends) => {
    const data = trends.map(entry => ({
      x: formatDate(entry.date),
      y: getTotalMinutes(entry.hours, entry.minutes)
    }));

    return {
      series: [{
        name: 'Screen Time (minutes)',
        data: data
      }],
      options: {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 90, 100]
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
          labels: {
            formatter: (value) => {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              if (hours === 0) return `${minutes}m`;
              if (minutes === 0) return `${hours}h`;
              return `${hours}h ${minutes}m`;
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
            const totalMinutes = getTotalMinutes(entry.hours, entry.minutes);
            return `
              <div class="p-3 bg-white shadow-lg rounded-lg border">
                <div class="font-semibold mb-1">${formatScreenTime(entry.hours, entry.minutes)}</div>
                <div class="text-sm text-gray-600">${formatDate(entry.date)}</div>
              </div>
            `;
          }
        }
      }
    };
  };

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
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load screen time data</h3>
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
          Screen Time Tracker
        </h1>
        <p className="text-gray-600">
          Monitor your digital device usage and identify patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Today's Screen Time</h3>
            <ApperIcon name="Smartphone" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {todaysEntry ? formatScreenTime(todaysEntry.hours, todaysEntry.minutes) : '0m'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">7-Day Average</h3>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatScreenTime(Math.floor(averageScreenTime / 60), averageScreenTime % 60)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Weekly Total</h3>
            <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatScreenTime(
              Math.floor(weeklyTrends.reduce((sum, entry) => sum + getTotalMinutes(entry.hours, entry.minutes), 0) / 60),
              weeklyTrends.reduce((sum, entry) => sum + getTotalMinutes(entry.hours, entry.minutes), 0) % 60
            )}
          </p>
        </motion.div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg max-w-md">
        {[
          { id: 'today', label: 'Log Today', icon: 'Plus' },
          { id: 'trends', label: 'View Trends', icon: 'BarChart3' }
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Log Today's Screen Time
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tips for Healthy Screen Time:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Take breaks every 20-30 minutes</li>
                  <li>• Use the 20-20-20 rule: Look at something 20 feet away for 20 seconds every 20 minutes</li>
                  <li>• Set device-free zones in your home</li>
                  <li>• Avoid screens 1 hour before bedtime</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : todaysEntry ? 'Update Screen Time' : 'Log Screen Time'}
              </button>
            </form>
          </div>
        )}

        {activeView === 'trends' && (
          <div className="space-y-6">
            {/* Weekly Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Weekly Screen Time Trends
              </h3>
              {weeklyTrends.length > 0 ? (
                <Chart
                  options={getChartData(weeklyTrends).options}
                  series={getChartData(weeklyTrends).series}
                  type="area"
                  height={350}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-4" />
                  <p>No screen time data available for the past week</p>
                  <p className="text-sm mt-1">Start logging your screen time to see trends</p>
                </div>
              )}
            </div>

            {/* Monthly Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Monthly Screen Time Trends
              </h3>
              {monthlyTrends.length > 0 ? (
                <Chart
                  options={getChartData(monthlyTrends).options}
                  series={getChartData(monthlyTrends).series}
                  type="area"
                  height={350}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-4" />
                  <p>No screen time data available for the past month</p>
                  <p className="text-sm mt-1">Start logging your screen time to see trends</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScreenTime;