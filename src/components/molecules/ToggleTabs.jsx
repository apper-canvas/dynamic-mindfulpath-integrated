import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ToggleTabs = ({ tabs, activeTab, setActiveTab, className = '' }) => {
  return (
    <div className={`flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {tab.icon && <ApperIcon name={tab.icon} size={16} />}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ToggleTabs;