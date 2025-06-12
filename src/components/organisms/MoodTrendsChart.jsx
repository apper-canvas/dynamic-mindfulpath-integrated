import React from 'react';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const moodOptions = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#22c55e', value: 5 },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: '#8b5cf6', value: 4 },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#6b7280', value: 3 },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#eab308', value: 2 },
  { id: 'sad', emoji: '😢', label: '#3b82f6', value: 1 },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#ef4444', value: 0 }
];

const MoodTrendsChart = ({ trends, title, className = '' }) => {
  const getMoodOption = (moodId) => {
    return moodOptions.find(option => option.id === moodId) || moodOptions[2];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const chartData = {
    series: [{
      name: 'Mood',
      data: trends.map(entry => ({
        x: formatDate(entry.date),
        y: getMoodOption(entry.mood).value
      }))
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#7C9885'],
      xaxis: {
        categories: trends.map(entry => formatDate(entry.date)),
        labels: {
          style: {
            colors: '#6b7280'
          }
        }
      },
      yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5,
        labels: {
          formatter: (value) => {
            const mood = moodOptions.find(m => m.value === value);
            return mood ? mood.emoji : '';
          },
          style: {
            colors: '#6b7280'
          }
        }
      },
      grid: {
        borderColor: '#e5e7eb'
      },
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          const entry = trends[dataPointIndex];
          const mood = getMoodOption(entry.mood);
          return `
            <div class="p-3 bg-white shadow-lg rounded-lg border">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-lg">${mood.emoji}</span>
                <span class="font-semibold">${mood.label}</span>
              </div>
              <div class="text-sm text-gray-600">${formatDate(entry.date)}</div>
              ${entry.notes ? `<div class="text-sm text-gray-700 mt-1">${entry.notes}</div>` : ''}
            </div>
          `;
        }
      }
    }
  };

  return (
    <Card className={className}>
      <Text as="h3" className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </Text>
      {trends.length > 0 ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      ) : (
        <div className="text-center py-12 text-gray-500">
          <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-4" />
          <Text as="p">No mood data available for this period</Text>
          <Text as="small" className="mt-1">Start logging your mood to see trends</Text>
        </div>
      )}
    </Card>
  );
};

export default MoodTrendsChart;