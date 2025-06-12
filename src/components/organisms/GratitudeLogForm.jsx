import React from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const GratitudeLogForm = ({
  gratitudeContent,
  setGratitudeContent,
  todaysEntry,
  editingEntry,
  loading,
  onSubmit,
  onCancelEdit,
  className = ''
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gratitudeContent.trim()) {
      toast.error('Please enter your gratitude');
      return;
    }
    onSubmit();
  };

  return (
    <Card className={className}>
      <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">
        {editingEntry
          ? `Editing entry from ${editingEntry.date ? new Date(editingEntry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}`
          : "What are you grateful for today?"
        }
      </Text>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          type="textarea"
          value={gratitudeContent}
          onChange={(e) => setGratitudeContent(e.target.value)}
          placeholder="I'm grateful for..."
          rows={4}
          required
        />

        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={loading || !gratitudeContent.trim()}
            className="flex-1"
          >
            {loading ? 'Saving...' : editingEntry ? 'Update Entry' : todaysEntry ? 'Update Today\'s Gratitude' : 'Save Gratitude'}
          </Button>

          {editingEntry && (
            <Button
              type="button"
              onClick={onCancelEdit}
              variant="outline"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default GratitudeLogForm;