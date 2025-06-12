import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { 
  moodService, 
  therapyService, 
  allergyService, 
  gratitudeService, 
  screenTimeService 
} from '../services';

const Dashboard = () => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatScreenTime = (hours, minutes) => {
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      neutral: '😐',
      excited: '🤩'
    };
    return moodMap[mood] || '😐';
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
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your wellness journey today
        </p>
      </div>

      {/* Today's Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Mood Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/mood')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Today's Mood</h3>
            <ApperIcon name="Smile" className="w-5 h-5 text-primary" />
          </div>
          {dashboardData.todaysMood ? (
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getMoodEmoji(dashboardData.todaysMood.mood)}</span>
              <div>
                <p className="font-medium text-gray-800 capitalize">
                  {dashboardData.todaysMood.mood}
                </p>
                {dashboardData.todaysMood.notes && (
                  <p className="text-sm text-gray-600 truncate">
                    {dashboardData.todaysMood.notes}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="mb-2">No mood logged yet</p>
              <div className="text-xs text-primary">Tap to add</div>
            </div>
          )}
        </motion.div>

        {/* Gratitude Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/gratitude')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Gratitude</h3>
            <ApperIcon name="Heart" className="w-5 h-5 text-primary" />
          </div>
          {dashboardData.todaysGratitude ? (
            <div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {dashboardData.todaysGratitude.content}
              </p>
              <div className="mt-2 text-xs text-success">
                ✓ Completed
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="mb-2">No gratitude logged yet</p>
              <div className="text-xs text-primary">Tap to add</div>
            </div>
          )}
        </motion.div>

        {/* Screen Time Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/screen-time')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Screen Time</h3>
            <ApperIcon name="Smartphone" className="w-5 h-5 text-primary" />
          </div>
          {dashboardData.todaysScreenTime ? (
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {formatScreenTime(dashboardData.todaysScreenTime.hours, dashboardData.todaysScreenTime.minutes)}
              </p>
              <div className="mt-2 text-xs text-success">
                ✓ Logged
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="mb-2">No screen time logged yet</p>
              <div className="text-xs text-primary">Tap to add</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Streaks and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gratitude Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Gratitude Streak</h3>
            <ApperIcon name="Flame" className="w-5 h-5 text-warning" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {dashboardData.gratitudeStreak}
            </div>
            <p className="text-sm text-gray-600">
              {dashboardData.gratitudeStreak === 1 ? 'day' : 'days'} in a row
            </p>
            {dashboardData.gratitudeStreak > 0 && (
              <p className="text-xs text-success mt-1">
                Keep it up! 🌟
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <ApperIcon name="Activity" className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            {dashboardData.recentTherapy && (
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                <ApperIcon name="BookOpen" className="w-4 h-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">Therapy Session</p>
                  <p className="text-xs text-gray-600">
                    {formatDate(dashboardData.recentTherapy.date)}
                  </p>
                </div>
              </div>
            )}
            
            {dashboardData.recentAllergies.slice(0, 2).map((episode) => (
              <div key={episode.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                <ApperIcon name="Shield" className="w-4 h-4 text-warning" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">Allergy Episode</p>
                  <p className="text-xs text-gray-600">
                    {episode.trigger} - {formatDate(episode.datetime)}
                  </p>
                </div>
              </div>
            ))}

            {!dashboardData.recentTherapy && dashboardData.recentAllergies.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-surface rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Log Mood', icon: 'Smile', path: '/mood', color: 'bg-green-500' },
            { label: 'Add Gratitude', icon: 'Heart', path: '/gratitude', color: 'bg-pink-500' },
            { label: 'Therapy Entry', icon: 'BookOpen', path: '/therapy', color: 'bg-blue-500' },
            { label: 'Screen Time', icon: 'Smartphone', path: '/screen-time', color: 'bg-purple-500' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              onClick={() => navigate(action.path)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;