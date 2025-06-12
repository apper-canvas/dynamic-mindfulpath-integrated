import React from 'react';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ApperIcon from '@/components/ApperIcon';

const ExportSummaryPanel = ({
  dateRange,
  totalSelectedEntries,
  format,
  loading,
  handleExport,
  delay = 0
}) => {
  return (
    <Card delay={delay}>
      <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">Export Summary</Text>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Text as="small" className="text-gray-600 mb-1 block">Date Range</Text>
          <Text as="p" className="font-medium text-gray-800">
            {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
          </Text>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <Text as="small" className="text-gray-600 mb-1 block">Total Entries</Text>
          <Text as="p" className="text-2xl font-bold text-primary">
            {totalSelectedEntries}
          </Text>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <Text as="small" className="text-gray-600 mb-1 block">Format</Text>
          <Text as="p" className="font-medium text-gray-800 uppercase">
            {format}
          </Text>
        </div>

        <Button
          onClick={handleExport}
          disabled={loading || totalSelectedEntries === 0}
          className="w-full flex items-center justify-center space-x-2"
          size="large"
        >
          {loading ? (
            <>
              <LoadingSpinner size={16} className="text-white" />
              <span>Preparing Export...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Download" className="w-4 h-4" />
              <span>Export Data</span>
            </>
          )}
        </Button>

        {totalSelectedEntries === 0 && (
          <Text as="p" className="text-sm text-gray-500 text-center">
            No data available for the selected date range and categories
          </Text>
        )}
      </div>

      {/* Export Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <Text as="h4" className="text-sm font-semibold text-blue-800 mb-2">Export Tips</Text>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• CSV files can be opened in Excel</li>
          <li>• JSON files preserve data structure</li>
          <li>• Export regularly for backup</li>
          <li>• Check date ranges carefully</li>
        </ul>
      </div>
    </Card>
  );
};

export default ExportSummaryPanel;