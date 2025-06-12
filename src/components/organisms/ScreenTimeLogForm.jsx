import React from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const ScreenTimeLogForm = ({
  screenHours,
  setScreenHours,
  screenMinutes,
  setScreenMinutes,
  todaysEntry,
  loading,
  onSubmit,
  className = ''
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const hours = parseInt(screenHours) || 0;
    const minutes = parseInt(screenMinutes) || 0;

    if (hours === 0 && minutes === 0) {
      toast.error('Please enter screen time');
      return;
    }

    if (minutes >= 60) {
      toast.error('Minutes must be less than 60');
      return;
    }

    if (hours > 24) {
      toast.error('Hours cannot exceed 24');
      return;
    }
    onSubmit();
  };

  return (
    <Card className={className}>
      <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">
        Log Today's Screen Time
      </Text>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Hours"
            type="number"
            min="0"
            max="24"
            value={screenHours}
            onChange={(e) => setScreenHours(e.target.value)}
            placeholder="0"
          />
          <FormField
            label="Minutes"
            type="number"
            min="0"
            max="59"
            value={screenMinutes}
            onChange={(e) => setScreenMinutes(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <Text as="h4" className="text-sm font-medium text-gray-700 mb-2">Tips for Healthy Screen Time:</Text>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Take breaks every 20-30 minutes</li>
            <li>• Use the 20-20-20 rule: Look at something 20 feet away for 20 seconds every 20 minutes</li>
            <li>• Set device-free zones in your home</li>
            <li>• Avoid screens 1 hour before bedtime</li>
          </ul>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : todaysEntry ? 'Update Screen Time' : 'Log Screen Time'}
        </Button>
      </form>
    </Card>
  );
};

export default ScreenTimeLogForm;