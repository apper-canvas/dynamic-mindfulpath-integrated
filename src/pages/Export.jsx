import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { 
  moodService, 
  therapyService, 
  allergyService, 
  gratitudeService, 
  screenTimeService 
} from '../services';

const Export = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState({
    mood: true,
    therapy: true,
    allergies: true,
    gratitude: true,
    screenTime: true
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });
  const [format, setFormat] = useState('csv');
  const [dataCounts, setDataCounts] = useState({
    mood: 0,
    therapy: 0,
    allergies: 0,
    gratitude: 0,
    screenTime: 0
  });

  const categories = [
    { id: 'mood', label: 'Mood Entries', icon: 'Smile', color: 'text-green-600' },
    { id: 'therapy', label: 'Therapy Sessions', icon: 'BookOpen', color: 'text-blue-600' },
    { id: 'allergies', label: 'Allergy Episodes', icon: 'Shield', color: 'text-yellow-600' },
    { id: 'gratitude', label: 'Gratitude Entries', icon: 'Heart', color: 'text-pink-600' },
    { id: 'screenTime', label: 'Screen Time Logs', icon: 'Smartphone', color: 'text-purple-600' }
  ];

  useEffect(() => {
    loadDataCounts();
  }, [dateRange]);

  const loadDataCounts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [moodData, therapyData, allergyData, gratitudeData, screenTimeData] = await Promise.all([
        moodService.getAll(),
        therapyService.getAll(),
        allergyService.getAll(),
        gratitudeService.getAll(),
        screenTimeService.getAll()
      ]);

      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date

      const filterByDateRange = (data, dateField) => {
        return data.filter(item => {
          const itemDate = new Date(item[dateField]);
          return itemDate >= startDate && itemDate <= endDate;
        });
      };

      setDataCounts({
        mood: filterByDateRange(moodData, 'date').length,
        therapy: filterByDateRange(therapyData, 'date').length,
        allergies: filterByDateRange(allergyData, 'datetime').length,
        gratitude: filterByDateRange(gratitudeData, 'date').length,
        screenTime: filterByDateRange(screenTimeData, 'date').length
      });
    } catch (err) {
      setError(err.message || 'Failed to load data counts');
      toast.error('Failed to load data counts');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleExport = async () => {
    const selectedCount = Object.values(selectedCategories).filter(Boolean).length;
    if (selectedCount === 0) {
      toast.error('Please select at least one category to export');
      return;
    }

    setLoading(true);
    try {
      // Collect all selected data
      const exportData = {};
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999);

      const filterByDateRange = (data, dateField) => {
        return data.filter(item => {
          const itemDate = new Date(item[dateField]);
          return itemDate >= startDate && itemDate <= endDate;
        });
      };

      if (selectedCategories.mood) {
        const moodData = await moodService.getAll();
        exportData.mood = filterByDateRange(moodData, 'date');
      }

      if (selectedCategories.therapy) {
        const therapyData = await therapyService.getAll();
        exportData.therapy = filterByDateRange(therapyData, 'date');
      }

      if (selectedCategories.allergies) {
        const allergyData = await allergyService.getAll();
        exportData.allergies = filterByDateRange(allergyData, 'datetime');
      }

      if (selectedCategories.gratitude) {
        const gratitudeData = await gratitudeService.getAll();
        exportData.gratitude = filterByDateRange(gratitudeData, 'date');
      }

      if (selectedCategories.screenTime) {
        const screenTimeData = await screenTimeService.getAll();
        exportData.screenTime = filterByDateRange(screenTimeData, 'date');
      }

      // Generate and download the file
      if (format === 'csv') {
        downloadCSV(exportData);
      } else {
        downloadJSON(exportData);
      }

      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data) => {
    let csvContent = '';
    
    Object.entries(data).forEach(([category, items]) => {
      if (items.length === 0) return;
      
      csvContent += `\n${category.toUpperCase()} DATA\n`;
      
      // Get headers from first item
      const headers = Object.keys(items[0]);
      csvContent += headers.join(',') + '\n';
      
      // Add data rows
      items.forEach(item => {
        const row = headers.map(header => {
          let value = item[header];
          if (Array.isArray(value)) {
            value = value.join('; ');
          }
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        });
        csvContent += row.join(',') + '\n';
      });
      
      csvContent += '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mindfulpath-export-${dateRange.startDate}-to-${dateRange.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = (data) => {
    const exportObject = {
      exportDate: new Date().toISOString(),
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      },
      data: data
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mindfulpath-export-${dateRange.startDate}-to-${dateRange.endDate}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotalSelectedEntries = () => {
    return Object.entries(selectedCategories).reduce((total, [category, selected]) => {
      return total + (selected ? dataCounts[category] : 0);
    }, 0);
  };

  if (loading && Object.values(dataCounts).every(count => count === 0)) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load export data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDataCounts}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
          Export Data
        </h1>
        <p className="text-gray-600">
          Download your wellness tracking data for backup or analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date Range */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Data Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Data to Export</h3>
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
                    <span className="font-medium text-gray-700">{category.label}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({dataCounts[category.id]} entries)
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Export Format */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Format</h3>
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
                  <span className="font-medium text-gray-700">CSV Format</span>
                  <p className="text-sm text-gray-500">Compatible with Excel and Google Sheets</p>
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
                  <span className="font-medium text-gray-700">JSON Format</span>
                  <p className="text-sm text-gray-500">Structured data for developers</p>
                </div>
              </label>
            </div>
          </motion.div>
        </div>

        {/* Export Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Summary</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Date Range</div>
              <div className="font-medium text-gray-800">
                {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Entries</div>
              <div className="text-2xl font-bold text-primary">
                {getTotalSelectedEntries()}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Format</div>
              <div className="font-medium text-gray-800 uppercase">
                {format}
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={loading || getTotalSelectedEntries() === 0}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  <span>Preparing Export...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Download" className="w-4 h-4" />
                  <span>Export Data</span>
                </>
              )}
            </button>

            {getTotalSelectedEntries() === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No data available for the selected date range and categories
              </p>
            )}
          </div>

          {/* Export Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Export Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• CSV files can be opened in Excel</li>
              <li>• JSON files preserve data structure</li>
              <li>• Export regularly for backup</li>
              <li>• Check date ranges carefully</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Export;