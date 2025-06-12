import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Pill from '@/components/atoms/Pill';

const TagChip = ({ text, onRemove, color = 'primary' }) => {
  return (
    <Pill color={color} className="inline-flex items-center space-x-1">
      <span>{text}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={`hover:text-${color}/80`}
        >
          <ApperIcon name="X" size={14} />
        </button>
      )}
    </Pill>
  );
};

export default TagChip;