import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const GratitudeStreakCard = ({ streak, className = '', delay = 0 }) => {
  return (
    <Card className={`bg-gradient-to-r from-primary to-accent text-white ${className}`} delay={delay}>
      <div className="flex items-center justify-between">
        <div>
          <Text as="h2" className="text-2xl font-bold mb-1 text-white">
            {streak} Day{streak !== 1 ? 's' : ''}
          </Text>
          <Text as="p" className="text-white/80">
            {streak > 0 ? 'Gratitude streak! Keep it going! 🔥' : 'Start your gratitude journey today'}
          </Text>
        </div>
        <div className="text-4xl">
          {streak > 0 ? '🌟' : '💫'}
        </div>
      </div>
    </Card>
  );
};

export default GratitudeStreakCard;