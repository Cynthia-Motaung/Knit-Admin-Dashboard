import React from 'react';
import { useRetentionCohorts } from '../../hooks/useDashboardData';

const RetentionCohortTable = () => {
  const { data, isLoading, error } = useRetentionCohorts();

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-orange-500 text-2xl mb-2">📊</div>
          <p className="text-orange-500 font-medium">Retention data unavailable</p>
          <p className="text-gray-500 text-sm mt-1">Failed to load cohort analysis</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex space-x-4">
              <div className="h-12 bg-gray-200 rounded w-1/5"></div>
              <div className="h-12 bg-gray-200 rounded w-1/5"></div>
              <div className="h-12 bg-gray-200 rounded w-1/5"></div>
              <div className="h-12 bg-gray-200 rounded w-1/5"></div>
              <div className="h-12 bg-gray-200 rounded w-1/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cohorts = data?.data?.cohorts || [];

  if (cohorts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-2xl mb-2">👥</div>
          <p className="text-gray-500 font-medium">No cohort data available</p>
          <p className="text-gray-400 text-sm mt-1">Retention analysis will appear here</p>
        </div>
      </div>
    );
  }

  const getRetentionColor = (percentage) => {
    if (percentage >= 90) return 'bg-blue-600 text-white';
    if (percentage >= 80) return 'bg-blue-400 text-white';
    return 'bg-blue-200 text-gray-900';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">👥 Retention Cohort Analysis</h3>
        <div className="text-sm text-gray-500">Weekly cohort performance</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-900 bg-gray-50 rounded-l-lg">Cohort Week</th>
              <th className="text-center p-4 font-semibold text-gray-900 bg-gray-50">Week 1</th>
              <th className="text-center p-4 font-semibold text-gray-900 bg-gray-50">Week 2</th>
              <th className="text-center p-4 font-semibold text-gray-900 bg-gray-50">Week 3</th>
              <th className="text-center p-4 font-semibold text-gray-900 bg-gray-50 rounded-r-lg">Week 4</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort, index) => (
              <tr 
                key={cohort.week} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {cohort.week}
                  </div>
                </td>
                {cohort.retention.map((retention, idx) => (
                  <td key={idx} className="p-4 text-center">
                    <div
                      className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold transition-all ${getRetentionColor(
                        retention.percentage
                      )}`}
                      title={`Cohort of ${retention.schoolCount} schools retained ${retention.percentage}%`}
                    >
                      {retention.percentage}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetentionCohortTable;