import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = true, delay = 0, ...props }) => {
  const baseStyle = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6';
  const mergedClassName = `${baseStyle} ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={mergedClassName}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={mergedClassName} {...props}>
      {children}
    </div>
  );
};

export default Card;