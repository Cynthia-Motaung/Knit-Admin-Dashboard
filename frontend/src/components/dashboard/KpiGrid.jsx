import React from 'react';
import { useGrowthSummary } from '../../hooks/useDashboardData';
import KpiCard from './KpiCard';

const KpiGrid = () => {
  const { data, isLoading, error } = useGrowthSummary();

  console.log('KpiGrid data:', { data, isLoading, error });

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 text-center border border-orange-200">
            <div className="text-orange-500 text-lg mb-2">⚠️</div>
            <p className="text-orange-600 text-sm font-medium">Data unavailable</p>
          </div>
        ))}
      </div>
    );
  }

  const kpiData = data?.data?.metrics || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpiData.map((kpi, index) => (
        <KpiCard
          key={kpi.id || index}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          trend={kpi.trend}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default KpiGrid;