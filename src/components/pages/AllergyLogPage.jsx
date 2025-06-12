import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorFeedback from '@/components/atoms/ErrorFeedback';
import ActionButton from '@/components/molecules/ActionButton';
import AllergyEpisodeForm from '@/components/organisms/AllergyEpisodeForm';
import AllergyEpisodeList from '@/components/organisms/AllergyEpisodeList';

import { allergyService } from '@/services';

const AllergyLogPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);

  const defaultFormData = {
    datetime: new Date().toISOString().slice(0, 16),
    trigger: '',
    symptoms: [],
    remedies: []
  };
  const [initialFormData, setInitialFormData] = useState(defaultFormData);

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

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingEpisode) {
        await allergyService.update(editingEpisode.id, formData);
        toast.success('Episode updated successfully!');
      } else {
        await allergyService.create(formData);
        toast.success('Episode logged successfully!');
      }

      setShowAddForm(false);
      await loadEpisodes();
    } catch (error) {
      toast.error('Failed to save episode');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (episode) => {
    setEditingEpisode(episode);
    setInitialFormData({
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

  const handleLogEpisodeClick = () => {
    setEditingEpisode(null);
    setInitialFormData(defaultFormData);
    setShowAddForm(true);
  };

  const resetFormState = () => {
    setEditingEpisode(null);
    setInitialFormData(defaultFormData);
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
    return <ErrorFeedback message={error} onRetry={loadEpisodes} />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Text as="h1" className="text-3xl font-heading font-bold text-gray-800 mb-2">
            Allergy Log
          </Text>
          <Text as="p" className="text-gray-600">
            Track allergic reactions, triggers, and treatments
          </Text>
        </div>
        <ActionButton
          iconName="Plus"
          onClick={handleLogEpisodeClick}
          variant="primary"
        >
          Log Episode
        </ActionButton>
      </div>

      {/* Add/Edit Form Modal */}
      <AllergyEpisodeForm
        showModal={showAddForm}
        setShowModal={setShowAddForm}
        editingEpisode={editingEpisode}
        onSubmit={handleFormSubmit}
        loading={loading}
        resetFormState={resetFormState}
        initialFormData={initialFormData}
      />

      {/* Episodes List */}
      <AllergyEpisodeList
        episodes={episodes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onLogEpisode={handleLogEpisodeClick}
      />
    </div>
  );
};

export default AllergyLogPage;