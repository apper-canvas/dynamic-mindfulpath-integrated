import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { allergyService } from '../services';

const commonTriggers = [
  'pollen',
  'dust mites',
  'pet dander',
  'mold',
  'food - nuts',
  'food - dairy',
  'food - shellfish',
  'food - eggs',
  'medication',
  'latex',
  'insect stings',
  'fragrances',
  'cleaning products'
];

const commonSymptoms = [
  'sneezing',
  'runny nose',
  'congestion',
  'itchy eyes',
  'watery eyes',
  'coughing',
  'wheezing',
  'hives',
  'skin rash',
  'swelling',
  'difficulty breathing',
  'throat irritation',
  'headache',
  'fatigue',
  'nausea'
];

const commonRemedies = [
  'antihistamine',
  'nasal spray',
  'eye drops',
  'inhaler',
  'epinephrine',
  'steroid cream',
  'saline rinse',
  'air purifier',
  'removed from environment',
  'cold compress',
  'shower/change clothes',
  'steam inhalation',
  'rest',
  'emergency room visit'
];

const AllergyLog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    datetime: new Date().toISOString().slice(0, 16),
    trigger: '',
    symptoms: [],
    remedies: []
  });
  const [customTrigger, setCustomTrigger] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [customRemedy, setCustomRemedy] = useState('');

  useEffect(() => {
    loadEpisodes();
  }, []);

  const loadEpisodes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await allergyService.getAll();
      setEpisodes(data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)));
    } catch (err) {
      setError(err.message || 'Failed to load allergy episodes');
      toast.error('Failed to load allergy episodes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.trigger.trim()) {
      toast.error('Please specify the trigger');
      return;
    }
    if (formData.symptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }

    setLoading(true);
    try {
      const episodeData = {
        ...formData,
        trigger: formData.trigger.trim()
      };

      if (editingEpisode) {
        await allergyService.update(editingEpisode.id, episodeData);
        toast.success('Episode updated successfully!');
      } else {
        await allergyService.create(episodeData);
        toast.success('Episode logged successfully!');
      }
      
      setShowAddForm(false);
      setEditingEpisode(null);
      resetForm();
      await loadEpisodes();
    } catch (error) {
      toast.error('Failed to save episode');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      datetime: new Date().toISOString().slice(0, 16),
      trigger: '',
      symptoms: [],
      remedies: []
    });
    setCustomTrigger('');
    setCustomSymptom('');
    setCustomRemedy('');
  };

  const handleEdit = (episode) => {
    setEditingEpisode(episode);
    setFormData({
      datetime: episode.datetime.slice(0, 16),
      trigger: episode.trigger,
      symptoms: episode.symptoms || [],
      remedies: episode.remedies || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (episodeId) => {
    if (!confirm('Are you sure you want to delete this allergy episode?')) return;
    
    setLoading(true);
    try {
      await allergyService.delete_(episodeId);
      toast.success('Episode deleted successfully');
      await loadEpisodes();
    } catch (error) {
      toast.error('Failed to delete episode');
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (array, item, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const addCustomItem = (customValue, setCustomValue, field, options) => {
    const trimmedValue = customValue.trim().toLowerCase();
    if (trimmedValue && !formData[field].includes(trimmedValue) && !options.includes(trimmedValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], trimmedValue]
      }));
      setCustomValue('');
    }
  };

  const removeItem = (item, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  const formatDateTime = (datetimeString) => {
    return new Date(datetimeString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading && episodes.length === 0) {
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load allergy episodes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadEpisodes}
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
            Allergy Log
          </h1>
          <p className="text-gray-600">
            Track allergic reactions, triggers, and treatments
          </p>
        </div>
        <motion.button
          onClick={() => {
            setShowAddForm(true);
            setEditingEpisode(null);
            resetForm();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" size={20} />
          <span>Log Episode</span>
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
                  {editingEpisode ? 'Edit Episode' : 'Log New Episode'}
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
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.datetime}
                    onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {commonTriggers.map((trigger) => (
                      <button
                        key={trigger}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, trigger }))}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                          formData.trigger === trigger
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.trigger.startsWith('custom:') ? formData.trigger.slice(7) : formData.trigger}
                      onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                      placeholder="Or enter custom trigger..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms Experienced
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {commonSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => toggleArrayItem(commonSymptoms, symptom, 'symptoms')}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                          formData.symptoms.includes(symptom)
                            ? 'bg-warning text-white border-warning'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      placeholder="Add custom symptom..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem(customSymptom, setCustomSymptom, 'symptoms', commonSymptoms))}
                    />
                    <button
                      type="button"
                      onClick={() => addCustomItem(customSymptom, setCustomSymptom, 'symptoms', commonSymptoms)}
                      className="px-4 py-2 bg-secondary text-gray-700 rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.symptoms.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Selected symptoms:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.symptoms.map((symptom) => (
                          <span
                            key={symptom}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm"
                          >
                            <span>{symptom}</span>
                            <button
                              type="button"
                              onClick={() => removeItem(symptom, 'symptoms')}
                              className="hover:text-warning/80"
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
                    Remedies/Treatments Taken
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {commonRemedies.map((remedy) => (
                      <button
                        key={remedy}
                        type="button"
                        onClick={() => toggleArrayItem(commonRemedies, remedy, 'remedies')}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                          formData.remedies.includes(remedy)
                            ? 'bg-success text-white border-success'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {remedy}
                      </button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customRemedy}
                      onChange={(e) => setCustomRemedy(e.target.value)}
                      placeholder="Add custom remedy..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem(customRemedy, setCustomRemedy, 'remedies', commonRemedies))}
                    />
                    <button
                      type="button"
                      onClick={() => addCustomItem(customRemedy, setCustomRemedy, 'remedies', commonRemedies)}
                      className="px-4 py-2 bg-secondary text-gray-700 rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.remedies.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Selected remedies:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.remedies.map((remedy) => (
                          <span
                            key={remedy}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-success/10 text-success rounded-full text-sm"
                          >
                            <span>{remedy}</span>
                            <button
                              type="button"
                              onClick={() => removeItem(remedy, 'remedies')}
                              className="hover:text-success/80"
                            >
                              <ApperIcon name="X" size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : editingEpisode ? 'Update Episode' : 'Log Episode'}
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

      {/* Episodes List */}
      {episodes.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Shield" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No allergy episodes logged</h3>
          <p className="text-gray-600 mb-4">
            Start tracking your allergic reactions to identify patterns and triggers
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Log Your First Episode
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {episodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {episode.trigger}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(episode.datetime)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(episode)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(episode.id)}
                    className="p-2 text-gray-500 hover:text-error hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {episode.symptoms && episode.symptoms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {episode.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-2 py-1 bg-warning/10 text-warning rounded text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {episode.remedies && episode.remedies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Remedies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {episode.remedies.map((remedy) => (
                        <span
                          key={remedy}
                          className="px-2 py-1 bg-success/10 text-success rounded text-sm"
                        >
                          {remedy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllergyLog;