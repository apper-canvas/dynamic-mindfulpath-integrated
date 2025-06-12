import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ErrorFeedback = ({ message, onRetry }) => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <Text as="h3" className="text-lg font-semibold text-gray-800 mb-2">Unable to load data</Text>
        <Text as="p" className="text-gray-600 mb-4">{message}</Text>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorFeedback;