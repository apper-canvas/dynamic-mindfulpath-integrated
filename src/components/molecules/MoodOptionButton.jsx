import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const MoodOptionButton = ({ mood, selected, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={() => onClick(mood.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <Text as="span" className="text-3xl mb-2 block">{mood.emoji}</Text>
      <Text as="span" className={`text-sm font-medium ${
        selected ? 'text-primary' : 'text-gray-700'
      }`}>
        {mood.label}
      </Text>
    </motion.button>
  );
};

export default MoodOptionButton;