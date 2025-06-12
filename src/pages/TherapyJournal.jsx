import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { therapyService } from '../services';

const commonTopics = [
  'anxiety management',
  'depression',
  'work stress',
  'family relationships',
  'communication skills',
  'boundary setting',
  'self-esteem',
  'coping strategies',
  'trauma',
  'goal setting',
  'mindfulness',
  'grief',
  'anger management',
  'sleep issues',
  'social anxiety'
];

const TherapyJournal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topics: [],
    reflection: ''
  });
  const [customTopic, setCustomTopic] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await therapyService.getAll();
      setSessions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message || 'Failed to load therapy sessions');
      toast.error('Failed to load therapy sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reflection.trim()) {
      toast.error('Please add your reflection');
      return;
    }

    setLoading(true);
    try {
      if (editingSession) {
        await therapyService.update(editingSession.id, formData);
        toast.success('Session updated successfully!');
      } else {
        await therapyService.create(formData);
        toast.success('Session added successfully!');
      }
      
      setShowAddForm(false);
      setEditingSession(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        topics: [],
        reflection: ''
      });
      await loadSessions();
    } catch (error) {
      toast.error('Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      date: session.date,
      topics: session.topics || [],
      reflection: session.reflection
    });
    setShowAddForm(true);
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    setLoading(true);
    try {
      await therapyService.delete_(sessionId);
      toast.success('Session deleted successfully');
      await loadSessions();
    } catch (error) {
      toast.error('Failed to delete session');
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const addCustomTopic = () => {
    if (customTopic.trim() && !formData.topics.includes(customTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, customTopic.trim()]
      }));
      setCustomTopic('');
    }
  };

  const removeTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topic)
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load therapy sessions</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSessions}
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
            Therapy Journal
          </h1>
          <p className="text-gray-600">
            Record and reflect on your therapy sessions
          </p>
        </div>
        <motion.button
          onClick={() => {
            setShowAddForm(true);
            setEditingSession(null);
            setFormData({
              date: new Date().toISOString().split('T')[0],
              topics: [],
              reflection: ''
            });
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" size={20} />
          <span>Add Session</span>
        </motion.button>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingSession ? 'Edit Session' : 'Add New Session'}
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topics Discussed
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {commonTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          formData.topics.includes(topic)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Add custom topic..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTopic())}
                    />
                    <button
                      type="button"
                      onClick={addCustomTopic}
                      className="px-4 py-2 bg-secondary text-gray-700 rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {formData.topics.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Selected topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.topics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            <span>{topic}</span>
                            <button
                              type="button"
                              onClick={() => removeTopic(topic)}
                              className="hover:text-primary/80"
                            >
                              <ApperIcon name="X" size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reflection Notes
                  </label>
                  <textarea
                    value={formData.reflection}
                    onChange={(e) => setFormData(prev => ({ ...prev, reflection: e.target.value }))}
                    placeholder="How did the session go? What insights did you gain? What would you like to work on next?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={6}
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : editingSession ? 'Update Session' : 'Add Session'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No therapy sessions yet</h3>
          <p className="text-gray-600 mb-4">
            Start documenting your therapy journey by adding your first session
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Your First Session
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formatDate(session.date)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Session #{sessions.length - index}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(session)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="p-2 text-gray-500 hover:text-error hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              {session.topics && session.topics.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Topics Discussed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Reflection:</h4>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {session.reflection}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapyJournal;