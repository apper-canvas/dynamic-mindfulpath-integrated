import React from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import MoodOptionButton from '@/components/molecules/MoodOptionButton';
import Card from '@/components/molecules/Card';

const moodOptions = [
  { id: 'happy', emoji: '😊', label: 'Happy', value: 5 },
  { id: 'excited', emoji: '🤩', label: 'Excited', value: 4 },
  { id: 'neutral', emoji: '😐', label: 'Neutral', value: 3 },
  { id: 'anxious', emoji: '😰', label: 'Anxious', value: 2 },
  { id: 'sad', emoji: '😢', label: 'Sad', value: 1 },
  { id: 'angry', emoji: '😠', label: 'Angry', value: 0 }
];

const MoodLogForm = ({
  selectedMood,
  setSelectedMood,
  moodNotes,
  setMoodNotes,
  todaysMood,
  loading,
  onSubmit,
  className = ''
}) => {

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }
    onSubmit();
  };

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">
            How are you feeling today?
          </Text>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {moodOptions.map((mood) => (
              <MoodOptionButton
                key={mood.id}
                mood={mood}
                selected={selectedMood === mood.id}
                onClick={setSelectedMood}
              />
            ))}
          </div>
        </div>

        <FormField
          label="Notes (optional)"
          id="moodNotes"
          type="textarea"
          value={moodNotes}
          onChange={(e) => setMoodNotes(e.target.value)}
          placeholder="Any thoughts about your mood today?"
          rows={4}
        />

        <Button
          type="submit"
          disabled={loading || !selectedMood}
          className="w-full"
        >
          {loading ? 'Saving...' : todaysMood ? 'Update Mood' : 'Log Mood'}
        </Button>
      </form>
    </Card>
  );
};

export default MoodLogForm;