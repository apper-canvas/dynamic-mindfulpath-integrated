import React from 'react';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const InfoCard = ({ title, value, iconName, iconColor = 'text-primary', className = '', delay = 0, onClick }) => {
  const cardProps = onClick ? { onClick, className: 'cursor-pointer hover:shadow-md transition-shadow' } : {};
  return (
    <Card className={className} delay={delay} {...cardProps}>
      <div className="flex items-center justify-between mb-2">
        <Text as="h3" className="text-sm font-medium text-gray-600">{title}</Text>
        <ApperIcon name={iconName} className={`w-5 h-5 ${iconColor}`} />
      </div>
      <Text as="p" className="text-2xl font-bold text-gray-800">{value}</Text>
    </Card>
  );
};

export default InfoCard;