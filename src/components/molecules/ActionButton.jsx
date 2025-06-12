import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ActionButton = ({ iconName, children, className = '', onClick, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={onClick}
        className={`flex items-center space-x-2 ${className}`}
        {...props}
      >
        <ApperIcon name={iconName} size={20} />
        <span>{children}</span>
      </Button>
    </motion.div>
  );
};

export default ActionButton;