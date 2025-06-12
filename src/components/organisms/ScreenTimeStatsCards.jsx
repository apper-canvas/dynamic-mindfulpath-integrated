import React from 'react';
import InfoCard from '@/components/molecules/InfoCard';

const ScreenTimeStatsCards = ({ todaysEntry, weeklyTrends, averageScreenTime, formatScreenTime, getTotalMinutes, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <InfoCard
        title="Today's Screen Time"
        value={todaysEntry ? formatScreenTime(todaysEntry.hours, todaysEntry.minutes) : '0m'}
        iconName="Smartphone"
        delay={0}
        onClick={onCardClick ? () => onCardClick('today') : undefined}
      />
      <InfoCard
        title="7-Day Average"
        value={formatScreenTime(Math.floor(averageScreenTime / 60), averageScreenTime % 60)}
        iconName="TrendingUp"
        delay={0.1}
      />
      <InfoCard
        title="Weekly Total"
        value={formatScreenTime(
          Math.floor(weeklyTrends.reduce((sum, entry) => sum + getTotalMinutes(entry.hours, entry.minutes), 0) / 60),
          weeklyTrends.reduce((sum, entry) => sum + getTotalMinutes(entry.hours, entry.minutes), 0) % 60
        )}
        iconName="Calendar"
        delay={0.2}
      />
    </div>
  );
};

export default ScreenTimeStatsCards;