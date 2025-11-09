import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import KpiGrid from '../components/dashboard/KpiGrid';
import GrowthTrendsChart from '../components/charts/GrowthTrendsChart';
import RetentionCohortTable from '../components/dashboard/RetentionCohortTable';
import SchoolEngagementTable from '../components/dashboard/SchoolEngagementTable';
import InsightsPanel from '../components/dashboard/InsightsPanel';

const Dashboard = () => {
  console.log('Dashboard component rendering...');
  
  return (
    <DashboardLayout>
      {/* KPI Section */}
      <section>
        <KpiGrid />
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Charts & Tables */}
        <div className="xl:col-span-2 space-y-6">
          <GrowthTrendsChart />
          <RetentionCohortTable />
          <SchoolEngagementTable />
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-6">
          <InsightsPanel />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;