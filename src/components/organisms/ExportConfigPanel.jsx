import React from 'react';
import Card from '@/components/molecules/Card';
import FormField from '@/components/molecules/FormField';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const ExportConfigPanel = ({
  dateRange,
  setDateRange,
  selectedCategories,
  toggleCategory,
  dataCounts,
  format,
  setFormat,
  categories,
  delay = 0
}) => {
  return (
    <div className="space-y-6">
      {/* Date Range */}
      <Card delay={delay}>
        <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">Date Range</Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Start Date"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          />
          <FormField
            label="End Date"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </Card>

      {/* Data Categories */}
      <Card delay={delay + 0.1}>
        <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">Select Data to Export</Text>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories[category.id]}
                onChange={() => toggleCategory(category.id)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <ApperIcon name={category.icon} className={`w-5 h-5 ${category.color}`} />
              <div className="flex-1">
                <Text as="span" className="font-medium text-gray-700">{category.label}</Text>
                <Text as="span" className="ml-2 text-sm text-gray-500">
                  ({dataCounts[category.id]} entries)
                </Text>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Export Format */}
      <Card delay={delay + 0.2}>
        <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">Export Format</Text>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="csv"
              checked={format === 'csv'}
              onChange={(e) => setFormat(e.target.value)}
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <ApperIcon name="FileText" className="w-5 h-5 text-green-600" />
            <div>
              <Text as="span" className="font-medium text-gray-700">CSV Format</Text>
              <Text as="p" className="text-sm text-gray-500">Compatible with Excel and Google Sheets</Text>
            </div>
          </label>
          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="json"
              checked={format === 'json'}
              onChange={(e) => setFormat(e.target.value)}
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <ApperIcon name="Code" className="w-5 h-5 text-blue-600" />
            <div>
              <Text as="span" className="font-medium text-gray-700">JSON Format</Text>
              <Text as="p" className="text-sm text-gray-500">Structured data for developers</Text>
            </div>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default ExportConfigPanel;