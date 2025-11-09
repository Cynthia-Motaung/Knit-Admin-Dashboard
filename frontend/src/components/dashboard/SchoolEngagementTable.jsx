import React, { useState } from 'react';
import { useSchoolEngagement } from '../../hooks/useDashboardData';

const SchoolEngagementTable = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    segment: '',
    adoptionRate: '',
  });

  const { data, isLoading, error } = useSchoolEngagement(page, 10, filters, sortBy, sortOrder);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleRowClick = (school) => {
    alert(`School Details:\nName: ${school.name}\nSegment: ${school.segment}\nParent MAU: ${school.parentMau}\nCollections: ${school.collections}\nAdoption Rate: ${school.adoptionRate}%`);
  };

  const clearFilters = () => {
    setFilters({ segment: '', adoptionRate: '' });
    setPage(1);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-orange-500 text-2xl mb-2">🏫</div>
          <p className="text-orange-500 font-medium">School data unavailable</p>
        </div>
      </div>
    );
  }

  const engagementData = data?.data?.schools || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const totalSchools = data?.data?.pagination?.total || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🏫 School Engagement</h3>
        
        <div className="flex items-center space-x-4">
          <select 
            value={filters.segment}
            onChange={(e) => handleFilterChange('segment', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Segments</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Growth">Growth</option>
            <option value="Starter">Starter</option>
          </select>
          
          <select 
            value={filters.adoptionRate}
            onChange={(e) => handleFilterChange('adoptionRate', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Adoption Rates</option>
            <option value="high">High (≥80%)</option>
            <option value="medium">Medium (60-79%)</option>
            <option value="low">Low (&lt;60%)</option>
          </select>

          {(filters.segment || filters.adoptionRate) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th 
                className="text-left p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSort('name')}
              >
                School {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-left p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSort('segment')}
              >
                Segment {sortBy === 'segment' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-right p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSort('parentMau')}
              >
                Parent MAU {sortBy === 'parentMau' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-right p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSort('collections')}
              >
                Collections {sortBy === 'collections' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-right p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSort('adoptionRate')}
              >
                Adoption Rate {sortBy === 'adoptionRate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton />
            ) : engagementData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No schools found matching your filters
                </td>
              </tr>
            ) : (
              engagementData.map((school) => (
                <tr 
                  key={school.id} 
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(school)}
                >
                  <td className="p-3 text-gray-900 font-medium">{school.name}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {school.segment}
                    </span>
                  </td>
                  <td className="p-3 text-right text-gray-900">
                    {school.parentMau?.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-gray-900">
                    {school.collections?.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      school.adoptionRate >= 80 ? 'bg-green-100 text-green-800' :
                      school.adoptionRate >= 60 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {school.adoptionRate}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1 || isLoading}
          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
        >
          ← Previous
        </button>
        
        <div className="text-sm text-gray-600">
          Showing {engagementData.length} of {totalSchools} schools
          {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
        </div>
        
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isLoading}
          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const TableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="border-b">
        {Array.from({ length: 5 }).map((_, cellIndex) => (
          <td key={cellIndex} className="p-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default SchoolEngagementTable;