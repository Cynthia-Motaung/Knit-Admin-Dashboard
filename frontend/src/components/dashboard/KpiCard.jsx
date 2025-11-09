import React from 'react';

const KpiCard = ({ label, value, change, trend, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  const isPositive = trend === 'positive';
  const isNegative = trend === 'negative';
  
  const changeColor = isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-orange-600';
  const changeBg = isPositive ? 'bg-green-50' : isNegative ? 'bg-red-50' : 'bg-orange-50';
  const changeIcon = isPositive ? '↗' : isNegative ? '↘' : '→';

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <div className={`text-xs px-2 py-1 rounded-full ${changeBg} ${changeColor}`}>
          {changeIcon} {Math.abs(change)}%
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className={`text-xs ${changeColor}`}>
        {isPositive ? 'Increase' : isNegative ? 'Decrease' : 'No change'} from last period
      </div>
    </div>
  );
};

export default KpiCard;