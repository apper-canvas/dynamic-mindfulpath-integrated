import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DashboardQuickActions = ({ navigate, delay = 0 }) => {
  const actions = [
    { label: 'Log Mood', icon: 'Smile', path: '/mood', color: 'bg-green-500' },
    { label: 'Add Gratitude', icon: 'Heart', path: '/gratitude', color: 'bg-pink-500' },
    { label: 'Therapy Entry', icon: 'BookOpen', path: '/therapy', color: 'bg-blue-500' },
    { label: 'Screen Time', icon: 'Smartphone', path: '/screen-time', color: 'bg-purple-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mt-8 bg-surface rounded-xl p-6"
    >
      <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</Text>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            onClick={() => navigate(action.path)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
              <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
            </div>
            <Text as="span" className="text-sm font-medium text-gray-700">{action.label}</Text>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardQuickActions;