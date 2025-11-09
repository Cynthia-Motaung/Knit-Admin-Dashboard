import React from 'react';
import { useDashboardInsights } from '../../hooks/useDashboardData';

const InsightsPanel = () => {
  const { data, isLoading, error } = useDashboardInsights();

  const getInsightConfig = (category) => {
    switch (category) {
      case 'performance':
        return {
          icon: '🚀',
          borderColor: 'border-l-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          badge: 'Performance'
        };
      case 'risk':
        return {
          icon: '⚠️',
          borderColor: 'border-l-orange-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          badge: 'Attention Needed'
        };
      case 'opportunity':
        return {
          icon: '💡',
          borderColor: 'border-l-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          badge: 'Opportunity'
        };
      default:
        return {
          icon: '📊',
          borderColor: 'border-l-gray-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          badge: 'Insight'
        };
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-orange-500 text-2xl mb-2">💡</div>
          <p className="text-orange-500 font-medium">Insights unavailable</p>
        </div>
      </div>
    );
  }

  const insights = data?.data?.insights || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">💡 Performance Insights</h3>
        <div className="text-sm text-gray-500">{insights.length} active</div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <InsightsSkeleton />
        ) : insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-2xl mb-2">📊</div>
            <p className="text-gray-500">No insights available</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
          </div>
        ) : (
          insights.map((insight) => {
            const config = getInsightConfig(insight.category);
            return (
              <div
                key={insight.id}
                className={`border-l-4 ${config.borderColor} ${config.bgColor} p-4 rounded-r-lg transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs font-semibold ${config.textColor} px-2 py-1 rounded-full bg-white`}>
                        {config.badge}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {insight.message}
                    </p>
                    {insight.actionLink && (
                      <a
                        href={insight.actionLink}
                        className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 mt-2 transition-colors"
                      >
                        View details <span className="ml-1">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const InsightsSkeleton = () => (
  <>
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="border-l-4 border-gray-200 p-4 bg-gray-50 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="flex space-x-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </>
);

export default InsightsPanel;