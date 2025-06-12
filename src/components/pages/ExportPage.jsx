import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorFeedback from '@/components/atoms/ErrorFeedback';
import ExportConfigPanel from '@/components/organisms/ExportConfigPanel';
import ExportSummaryPanel from '@/components/organisms/ExportSummaryPanel';

import {
  moodService,
  therapyService,
  allergyService,
  gratitudeService,
  screenTimeService
} from '@/services';

const ExportPage = () => {
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
    return <ErrorFeedback message={error} onRetry={loadDataCounts} />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Text as="h1" className="text-3xl font-heading font-bold text-gray-800 mb-2">
          Export Data
        </Text>
        <Text as="p" className="text-gray-600">
          Download your wellness tracking data for backup or analysis
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <ExportConfigPanel
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            dataCounts={dataCounts}
            format={format}
            setFormat={setFormat}
            categories={categories}
          />
        </div>

        {/* Export Summary */}
        <ExportSummaryPanel
          dateRange={dateRange}
          totalSelectedEntries={getTotalSelectedEntries()}
          format={format}
          loading={loading}
          handleExport={handleExport}
        />
      </div>
    </div>
  );
};

export default ExportPage;