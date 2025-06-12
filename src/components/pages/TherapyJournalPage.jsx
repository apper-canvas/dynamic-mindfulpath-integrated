import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorFeedback from '@/components/atoms/ErrorFeedback';
import ActionButton from '@/components/molecules/ActionButton';
import TherapySessionForm from '@/components/organisms/TherapySessionForm';
import TherapySessionList from '@/components/organisms/TherapySessionList';

import { therapyService } from '@/services';

const TherapyJournalPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const defaultFormData = {
    date: new Date().toISOString().split('T')[0],
    topics: [],
    reflection: ''
  };
  const [initialFormData, setInitialFormData] = useState(defaultFormData);

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

  const handleFormSubmit = async (formData) => {
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
      await loadSessions();
    } catch (error) {
      toast.error('Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setInitialFormData({
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

  const handleAddSessionClick = () => {
    setEditingSession(null);
    setInitialFormData(defaultFormData);
    setShowAddForm(true);
  };

  const resetFormState = () => {
    setEditingSession(null);
    setInitialFormData(defaultFormData);
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
    return <ErrorFeedback message={error} onRetry={loadSessions} />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Text as="h1" className="text-3xl font-heading font-bold text-gray-800 mb-2">
            Therapy Journal
          </Text>
          <Text as="p" className="text-gray-600">
            Record and reflect on your therapy sessions
          </Text>
        </div>
        <ActionButton
          iconName="Plus"
          onClick={handleAddSessionClick}
          variant="primary"
        >
          Add Session
        </ActionButton>
      </div>

      {/* Add/Edit Form Modal */}
      <TherapySessionForm
        showModal={showAddForm}
        setShowModal={setShowAddForm}
        editingSession={editingSession}
        onSubmit={handleFormSubmit}
        loading={loading}
        resetFormState={resetFormState}
        initialFormData={initialFormData}
      />

      {/* Sessions List */}
      <TherapySessionList
        sessions={sessions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddSession={handleAddSessionClick}
      />
    </div>
  );
};

export default TherapyJournalPage;