import React from 'react';
import InfoCard from '@/components/molecules/InfoCard';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DashboardDailyOverview = ({ todaysMood, todaysGratitude, todaysScreenTime, navigate }) => {
  const formatScreenTime = (hours, minutes) => {
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊', sad: '😢', anxious: '😰', angry: '😠', neutral: '😐', excited: '🤩'
    };
    return moodMap[mood] || '😐';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Mood Card */}
      <InfoCard
        title="Today's Mood"
        iconName="Smile"
        delay={0.1}
        onClick={() => navigate('/mood')}
      >
        {todaysMood ? (
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getMoodEmoji(todaysMood.mood)}</span>
            <div>
              <Text as="p" className="font-medium text-gray-800 capitalize">
                {todaysMood.mood}
              </Text>
              {todaysMood.notes && (
                <Text as="p" className="text-sm text-gray-600 truncate">
                  {todaysMood.notes}
                </Text>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <Text as="p" className="mb-2">No mood logged yet</Text>
            <Text as="small" className="text-primary">Tap to add</Text>
          </div>
        )}
      </InfoCard>

      {/* Gratitude Card */}
      <InfoCard
        title="Gratitude"
        iconName="Heart"
        delay={0.2}
        onClick={() => navigate('/gratitude')}
      >
        {todaysGratitude ? (
          <div>
            <Text as="p" className="text-sm text-gray-600 line-clamp-2">
              {todaysGratitude.content}
            </Text>
            <div className="mt-2 text-xs text-success">
              ✓ Completed
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <Text as="p" className="mb-2">No gratitude logged yet</Text>
            <Text as="small" className="text-primary">Tap to add</Text>
          </div>
        )}
      </InfoCard>

      {/* Screen Time Card */}
      <InfoCard
        title="Screen Time"
        iconName="Smartphone"
        delay={0.3}
        onClick={() => navigate('/screen-time')}
      >
        {todaysScreenTime ? (
          <div>
            <Text as="p" className="text-2xl font-bold text-gray-800">
              {formatScreenTime(todaysScreenTime.hours, todaysScreenTime.minutes)}
            </Text>
            <div className="mt-2 text-xs text-success">
              ✓ Logged
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <Text as="p" className="mb-2">No screen time logged yet</Text>
            <Text as="small" className="text-primary">Tap to add</Text>
          </div>
        )}
      </InfoCard>
    </div>
  );
};

export default DashboardDailyOverview;