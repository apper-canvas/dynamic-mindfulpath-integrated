import React from 'react';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const ScreenTimeTrendsChart = ({ trends, title, formatScreenTime, getTotalMinutes, className = '' }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const chartData = {
    series: [{
      name: 'Screen Time (minutes)',
      data: trends.map(entry => ({
        x: formatDate(entry.date),
        y: getTotalMinutes(entry.hours, entry.minutes)
      }))
    }],
    options: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
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
        labels: {
          formatter: (value) => {
            const hours = Math.floor(value / 60);
            const minutes = value % 60;
            if (hours === 0) return `${minutes}m`;
            if (minutes === 0) return `${hours}h`;
            return `${hours}h ${minutes}m`;
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
          return `
            <div class="p-3 bg-white shadow-lg rounded-lg border">
              <div class="font-semibold mb-1">${formatScreenTime(entry.hours, entry.minutes)}</div>
              <div class="text-sm text-gray-600">${formatDate(entry.date)}</div>
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
          type="area"
          height={350}
        />
      ) : (
        <div className="text-center py-12 text-gray-500">
          <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-4" />
          <Text as="p">No screen time data available for this period</Text>
          <Text as="small" className="mt-1">Start logging your screen time to see trends</Text>
        </div>
      )}
    </Card>
  );
};

export default ScreenTimeTrendsChart;