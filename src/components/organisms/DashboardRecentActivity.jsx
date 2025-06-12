import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const DashboardRecentActivity = ({ recentTherapy, recentAllergies, delay = 0 }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card delay={delay}>
      <div className="flex items-center justify-between mb-4">
        <Text as="h3" className="text-lg font-semibold text-gray-800">Recent Activity</Text>
        <ApperIcon name="Activity" className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-3">
        {recentTherapy && (
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
            <ApperIcon name="BookOpen" className="w-4 h-4 text-primary" />
            <div className="flex-1 min-w-0">
              <Text as="p" className="text-sm font-medium text-gray-800">Therapy Session</Text>
              <Text as="p" className="text-xs text-gray-600">
                {formatDate(recentTherapy.date)}
              </Text>
            </div>
          </div>
        )}

        {recentAllergies.slice(0, 2).map((episode) => (
          <div key={episode.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
            <ApperIcon name="Shield" className="w-4 h-4 text-warning" />
            <div className="flex-1 min-w-0">
              <Text as="p" className="text-sm font-medium text-gray-800">Allergy Episode</Text>
              <Text as="p" className="text-xs text-gray-600">
                {episode.trigger} - {formatDate(episode.datetime)}
              </Text>
            </div>
          </div>
        ))}

        {!recentTherapy && recentAllergies.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <Text as="p" className="text-sm">No recent activity</Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardRecentActivity;