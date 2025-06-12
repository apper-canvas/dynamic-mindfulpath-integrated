import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const LoadingSpinner = ({ size = 24, className = 'text-primary' }) => (
  <ApperIcon name="Loader2" size={size} className={`animate-spin ${className}`} />
);

export default LoadingSpinner;