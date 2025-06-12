import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorFeedback from '@/components/atoms/ErrorFeedback';
import GratitudeStreakCard from '@/components/organisms/GratitudeStreakCard';
import GratitudeLogForm from '@/components/organisms/GratitudeLogForm';
import GratitudeEntriesList from '@/components/organisms/GratitudeEntriesList';

import { gratitudeService } from '@/services';

const GratitudeLogPage = () => {
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
      } else {
        setGratitudeContent(''); // Clear form if no entry today
      }
      setEditingEntry(null); // Clear editing state on load
    } catch (err) {
      setError(err.message || 'Failed to load gratitude entries');
      toast.error('Failed to load gratitude entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
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

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await gratitudeService.update(editingEntry.id, {
        content: gratitudeContent.trim()
      });
      toast.success('Entry updated successfully!');
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
    return <ErrorFeedback message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Text as="h1" className="text-3xl font-heading font-bold text-gray-800 mb-2">
          Daily Gratitude
        </Text>
        <Text as="p" className="text-gray-600">
          Cultivate positivity by reflecting on what you're grateful for
        </Text>
      </div>

      <GratitudeStreakCard streak={streak} delay={0} />

      <GratitudeLogForm
        gratitudeContent={gratitudeContent}
        setGratitudeContent={setGratitudeContent}
        todaysEntry={todaysEntry}
        editingEntry={editingEntry}
        loading={loading}
        onSubmit={editingEntry ? handleUpdate : handleSubmit}
        onCancelEdit={cancelEdit}
        className="mb-8"
      />

      <div className="mb-6">
        <Text as="h3" className="text-xl font-semibold text-gray-800 mb-4">
          Your Gratitude Journey
        </Text>
      </div>

      <GratitudeEntriesList
        entries={entries}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editingEntry={editingEntry}
      />
    </div>
  );
};

export default GratitudeLogPage;