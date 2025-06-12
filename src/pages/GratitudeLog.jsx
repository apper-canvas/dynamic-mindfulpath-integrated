import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { gratitudeService } from '../services';

const GratitudeLog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entries, setEntries] = useState([]);
  const [todaysEntry, setTodaysEntry] = useState(null);
  const [gratitudeContent, setGratitudeContent] = useState('');
  const [streak, setStreak] = useState(0);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [allEntries, todayEntry, currentStreak] = await Promise.all([
        gratitudeService.getAll(),
        gratitudeService.getTodaysEntry(),
        gratitudeService.getCurrentStreak()
      ]);
      
      setEntries(allEntries.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setTodaysEntry(todayEntry);
      setStreak(currentStreak);
      
      if (todayEntry) {
        setGratitudeContent(todayEntry.content);
      }
    } catch (err) {
      setError(err.message || 'Failed to load gratitude entries');
      toast.error('Failed to load gratitude entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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

      if (todaysEntry) {
        await gratitudeService.update(todaysEntry.id, gratitudeData);
        toast.success('Gratitude updated successfully!');
      } else {
        await gratitudeService.create(gratitudeData);
        toast.success('Gratitude logged successfully!');
      }
      
      await loadData();
    } catch (error) {
      toast.error('Failed to save gratitude');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setGratitudeContent(entry.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!gratitudeContent.trim() || !editingEntry) return;

    setLoading(true);
    try {
      await gratitudeService.update(editingEntry.id, {
        content: gratitudeContent.trim()
      });
      toast.success('Entry updated successfully!');
      setEditingEntry(null);
      setGratitudeContent(todaysEntry?.content || '');
      await loadData();
    } catch (error) {
      toast.error('Failed to update entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (!confirm('Are you sure you want to delete this gratitude entry?')) return;
    
    setLoading(true);
    try {
      await gratitudeService.delete_(entryId);
      toast.success('Entry deleted successfully');
      if (editingEntry?.id === entryId) {
        setEditingEntry(null);
        setGratitudeContent(todaysEntry?.content || '');
      }
      await loadData();
    } catch (error) {
      toast.error('Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setGratitudeContent(todaysEntry?.content || '');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading && entries.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load gratitude entries</h3>
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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
          Daily Gratitude
        </h1>
        <p className="text-gray-600">
          Cultivate positivity by reflecting on what you're grateful for
        </p>
      </div>

      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 mb-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {streak} Day{streak !== 1 ? 's' : ''}
            </h2>
            <p className="text-white/80">
              {streak > 0 ? 'Gratitude streak! Keep it going! 🔥' : 'Start your gratitude journey today'}
            </p>
          </div>
          <div className="text-4xl">
            {streak > 0 ? '🌟' : '💫'}
          </div>
        </div>
      </motion.div>

      {/* Today's Entry Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingEntry 
            ? `Editing entry from ${formatDate(editingEntry.date)}`
            : "What are you grateful for today?"
          }
        </h3>
        
        <form onSubmit={editingEntry ? handleUpdate : handleSubmit} className="space-y-4">
          <textarea
            value={gratitudeContent}
            onChange={(e) => setGratitudeContent(e.target.value)}
            placeholder="I'm grateful for..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={4}
            required
          />
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || !gratitudeContent.trim()}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : editingEntry ? 'Update Entry' : todaysEntry ? 'Update Today\'s Gratitude' : 'Save Gratitude'}
            </button>
            
            {editingEntry && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Entries Archive */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Gratitude Journey
        </h3>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No gratitude entries yet</h3>
          <p className="text-gray-600 mb-4">
            Start your daily gratitude practice by writing your first entry above
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                editingEntry?.id === entry.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {formatDate(entry.date)}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {getRelativeDate(entry.date)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-gray-500 hover:text-error hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {entry.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GratitudeLog;