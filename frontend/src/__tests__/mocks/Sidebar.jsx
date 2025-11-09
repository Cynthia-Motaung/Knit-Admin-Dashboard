import React from 'react';

// Mock Sidebar component for tests
const Sidebar = () => (
  <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
    <div className="flex items-center justify-center h-16 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">K</span>
        </div>
        <span className="text-xl font-bold text-gray-900">Knit Admin</span>
      </div>
    </div>
    <nav className="flex-1 px-4 py-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
          <span className="text-lg">📊</span>
          <span>Dashboard</span>
        </div>
      </div>
    </nav>
  </div>
);

export default Sidebar;