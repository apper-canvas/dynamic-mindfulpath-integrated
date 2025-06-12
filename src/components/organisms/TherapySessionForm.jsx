import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import Pill from '@/components/atoms/Pill';
import TagChip from '@/components/molecules/TagChip';

const commonTopics = [
  'anxiety management', 'depression', 'work stress', 'family relationships',
  'communication skills', 'boundary setting', 'self-esteem', 'coping strategies',
  'trauma', 'goal setting', 'mindfulness', 'grief', 'anger management',
  'sleep issues', 'social anxiety'
];

const TherapySessionForm = ({
  showModal,
  setShowModal,
  editingSession,
  onSubmit,
  loading,
  resetFormState,
  initialFormData
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [customTopic, setCustomTopic] = useState('');

  useEffect(() => {
    setFormData(initialFormData);
    setCustomTopic('');
  }, [initialFormData, showModal]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reflection.trim()) {
      toast.error('Please add your reflection');
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setShowModal(false);
    resetFormState();
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <Text as="h2" className="text-xl font-semibold text-gray-800">
                {editingSession ? 'Edit Session' : 'Add New Session'}
              </Text>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="small"
                className="p-2"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Session Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />

              <div>
                <Label>Topics Discussed</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {commonTopics.map((topic) => (
                    <Button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      variant={formData.topics.includes(topic) ? 'primary' : 'outline'}
                      size="small"
                      className="text-left"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <FormField
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Add custom topic..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTopic())}
                  />
                  <Button
                    type="button"
                    onClick={addCustomTopic}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>

                {formData.topics.length > 0 && (
                  <div className="mt-4">
                    <Text as="p" className="text-sm text-gray-600 mb-2">Selected topics:</Text>
                    <div className="flex flex-wrap gap-2">
                      {formData.topics.map((topic) => (
                        <TagChip
                          key={topic}
                          text={topic}
                          onRemove={() => removeTopic(topic)}
                          color="primary"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <FormField
                label="Reflection Notes"
                type="textarea"
                value={formData.reflection}
                onChange={(e) => setFormData(prev => ({ ...prev, reflection: e.target.value }))}
                placeholder="How did the session go? What insights did you gain? What would you like to work on next?"
                rows={6}
                required
              />

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : editingSession ? 'Update Session' : 'Add Session'}
                </Button>
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TherapySessionForm;