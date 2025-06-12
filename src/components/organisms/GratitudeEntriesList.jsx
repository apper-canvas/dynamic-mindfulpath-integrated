import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const GratitudeEntryItem = ({ entry, index, onEdit, onDelete, editingEntry }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
        editingEntry?.id === entry.id
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <Text as="h4" className="font-medium text-gray-800">
            {formatDate(entry.date)}
          </Text>
          <Text as="p" className="text-sm text-gray-500">
            {getRelativeDate(entry.date)}
          </Text>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(entry)}
            variant="ghost"
            size="small"
            className="p-2"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            onClick={() => onDelete(entry.id)}
            variant="ghost"
            size="small"
            className="p-2 hover:text-error"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <Text as="p" className="text-gray-700 leading-relaxed">
        {entry.content}
      </Text>
    </motion.div>
  );
};

const GratitudeEntriesList = ({ entries, onEdit, onDelete, editingEntry }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <Text as="h3" className="text-lg font-semibold text-gray-800 mb-2">No gratitude entries yet</Text>
        <Text as="p" className="text-gray-600 mb-4">
          Start your daily gratitude practice by writing your first entry above
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <GratitudeEntryItem
          key={entry.id}
          entry={entry}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          editingEntry={editingEntry}
        />
      ))}
    </div>
  );
};

export default GratitudeEntriesList;