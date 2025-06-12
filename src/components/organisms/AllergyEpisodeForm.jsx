import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import TagChip from '@/components/molecules/TagChip';

const commonTriggers = [
  'pollen', 'dust mites', 'pet dander', 'mold', 'food - nuts',
  'food - dairy', 'food - shellfish', 'food - eggs', 'medication',
  'latex', 'insect stings', 'fragrances', 'cleaning products'
];

const commonSymptoms = [
  'sneezing', 'runny nose', 'congestion', 'itchy eyes', 'watery eyes',
  'coughing', 'wheezing', 'hives', 'skin rash', 'swelling',
  'difficulty breathing', 'throat irritation', 'headache', 'fatigue', 'nausea'
];

const commonRemedies = [
  'antihistamine', 'nasal spray', 'eye drops', 'inhaler', 'epinephrine',
  'steroid cream', 'saline rinse', 'air purifier', 'removed from environment',
  'cold compress', 'shower/change clothes', 'steam inhalation', 'rest',
  'emergency room visit'
];

const AllergyEpisodeForm = ({
  showModal,
  setShowModal,
  editingEpisode,
  onSubmit,
  loading,
  resetFormState,
  initialFormData
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [customTrigger, setCustomTrigger] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [customRemedy, setCustomRemedy] = useState('');

  useEffect(() => {
    setFormData(initialFormData);
    setCustomTrigger('');
    setCustomSymptom('');
    setCustomRemedy('');
  }, [initialFormData, showModal]);

  const toggleArrayItem = (item, field) => {
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
    onSubmit({ ...formData, trigger: formData.trigger.trim() });
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
                {editingEpisode ? 'Edit Episode' : 'Log New Episode'}
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
                label="Date & Time"
                type="datetime-local"
                value={formData.datetime}
                onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                required
              />

              <div>
                <Label>Trigger</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {commonTriggers.map((trigger) => (
                    <Button
                      key={trigger}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, trigger }))}
                      variant={formData.trigger === trigger ? 'primary' : 'outline'}
                      size="small"
                      className="text-left"
                    >
                      {trigger}
                    </Button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <FormField
                    type="text"
                    value={formData.trigger}
                    onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                    placeholder="Or enter custom trigger..."
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Symptoms Experienced</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {commonSymptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      type="button"
                      onClick={() => toggleArrayItem(symptom, 'symptoms')}
                      variant={formData.symptoms.includes(symptom) ? 'warning' : 'outline'}
                      size="small"
                      className="text-left"
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <FormField
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="Add custom symptom..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem(customSymptom, setCustomSymptom, 'symptoms', commonSymptoms))}
                  />
                  <Button
                    type="button"
                    onClick={() => addCustomItem(customSymptom, setCustomSymptom, 'symptoms', commonSymptoms)}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                {formData.symptoms.length > 0 && (
                  <div className="mt-3">
                    <Text as="p" className="text-sm text-gray-600 mb-2">Selected symptoms:</Text>
                    <div className="flex flex-wrap gap-2">
                      {formData.symptoms.map((symptom) => (
                        <TagChip
                          key={symptom}
                          text={symptom}
                          onRemove={() => removeItem(symptom, 'symptoms')}
                          color="warning"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Remedies/Treatments Taken</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {commonRemedies.map((remedy) => (
                    <Button
                      key={remedy}
                      type="button"
                      onClick={() => toggleArrayItem(remedy, 'remedies')}
                      variant={formData.remedies.includes(remedy) ? 'success' : 'outline'}
                      size="small"
                      className="text-left"
                    >
                      {remedy}
                    </Button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <FormField
                    type="text"
                    value={customRemedy}
                    onChange={(e) => setCustomRemedy(e.target.value)}
                    placeholder="Add custom remedy..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem(customRemedy, setCustomRemedy, 'remedies', commonRemedies))}
                  />
                  <Button
                    type="button"
                    onClick={() => addCustomItem(customRemedy, setCustomRemedy, 'remedies', commonRemedies)}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                {formData.remedies.length > 0 && (
                  <div className="mt-3">
                    <Text as="p" className="text-sm text-gray-600 mb-2">Selected remedies:</Text>
                    <div className="flex flex-wrap gap-2">
                      {formData.remedies.map((remedy) => (
                        <TagChip
                          key={remedy}
                          text={remedy}
                          onRemove={() => removeItem(remedy, 'remedies')}
                          color="success"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : editingEpisode ? 'Update Episode' : 'Log Episode'}
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

export default AllergyEpisodeForm;