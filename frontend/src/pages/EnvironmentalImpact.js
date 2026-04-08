import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { 
  SparklesIcon,
  BeakerIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/outline';

const EnvironmentalImpact = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('30');

  const { data: environmentalStats, isLoading } = useQuery(
    ['environmental-stats', timeRange],
    async () => {
      const userId = localStorage.getItem('userId');
      const userType = localStorage.getItem('userRole');
      const response = await axios.get('/api/marketplace/environmental-stats', {
        params: { timeRange, userId, userType }
      });
      return response.data.data;
    }
  );

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  const overall = environmentalStats?.overall || {};
  const cropBreakdown = environmentalStats?.cropBreakdown || [];

  const impactMetrics = [
    {
      label: 'CO₂ Reduction',
      value: overall.totalCO2Reduction || 0,
      unit: 'kg',
      icon: BeakerIcon,
      color: 'bg-green-500',
      description: 'Carbon dioxide emissions prevented'
    },
    {
      label: 'PM2.5 Reduction',
      value: overall.totalPM25Reduction || 0,
      unit: 'kg',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      description: 'Air pollutants reduced'
    },
    {
      label: 'Trees Saved',
      value: overall.totalTreesSaved || 0,
      unit: '',
      icon: SparklesIcon,
      color: 'bg-emerald-500',
      description: 'Equivalent trees saved per year'
    },
    {
      label: 'Residue Utilized',
      value: overall.totalResidueUtilized || 0,
      unit: 'tons',
      icon: GlobeAltIcon,
      color: 'bg-purple-500',
      description: 'Total crop residue processed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('environmental_impact.title')}
          </h1>
          <p className="text-gray-600">
            Track your environmental contribution and sustainability metrics
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            {['7', '30', '90', '365'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range === '7' ? '7 Days' : range === '30' ? '30 Days' : range === '90' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className={`${metric.color} text-white rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-8 w-8 text-white/80" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">
                      {metric.value.toLocaleString()}
                    </p>
                    <p className="text-white/80 text-sm">{metric.unit}</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm">{metric.label}</p>
                <p className="text-white/70 text-xs mt-1">{metric.description}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Crop Breakdown Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Environmental Impact by Crop Type
            </h2>
            {cropBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cropBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalCO2Reduction" fill="#10b981" name="CO₂ Reduction (kg)" />
                  <Bar dataKey="totalResidue" fill="#3b82f6" name="Residue (tons)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data available for the selected time range
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Crop Type Distribution
            </h2>
            {cropBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cropBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalResidue"
                  >
                    {cropBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data available for the selected time range
              </div>
            )}
          </div>
        </div>

        {/* Environmental Benefits */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t('environmental_impact.environmental_benefits')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Air Quality Improvement
              </h3>
              <p className="text-gray-600">
                Reduced burning practices lead to better air quality and lower respiratory health risks
              </p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BeakerIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Climate Change Mitigation
              </h3>
              <p className="text-gray-600">
                CO₂ reduction helps combat climate change and global warming effects
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Soil Health
              </h3>
              <p className="text-gray-600">
                Proper residue management improves soil fertility and agricultural sustainability
              </p>
            </div>
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t('environmental_impact.sustainability_metrics')}
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Carbon Footprint Reduction</h3>
                <p className="text-sm text-gray-600">Total carbon emissions prevented</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {((overall.totalCO2Reduction || 0) / 1000).toFixed(2)} tons
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Air Quality Index Improvement</h3>
                <p className="text-sm text-gray-600">Estimated improvement in local air quality</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {overall.totalPM25Reduction > 1 ? 'Significant' : 'Moderate'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Sustainability Score</h3>
                <p className="text-sm text-gray-600">Based on environmental impact metrics</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.min(100, Math.round((overall.totalCO2Reduction || 0) / 10))}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
