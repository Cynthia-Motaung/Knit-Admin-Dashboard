import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGrowthSummary, useSchoolEngagement } from '../hooks/useDashboardData';

// Mock the API module at the top level
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn()
  }
}));

import api from '../services/api';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Dashboard Data Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('useGrowthSummary fetches data successfully', async () => {
    const mockData = {
      metrics: [
        { id: 1, label: 'Total Schools', value: 1542, change: 2.4, trend: 'positive' }
      ]
    };
    
    api.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useGrowthSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(api.get).toHaveBeenCalledWith('/api/dashboard/growth-summary');
    expect(result.current.data.data).toEqual(mockData);
  });

  test('useSchoolEngagement handles pagination and filters', async () => {
    const mockData = { 
      schools: [], 
      pagination: { page: 1, total: 0, totalPages: 1 } 
    };
    api.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () => useSchoolEngagement(2, 10, { segment: 'Enterprise' }, 'name', 'asc'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(api.get).toHaveBeenCalledWith(
      '/api/dashboard/school-engagement?page=2&limit=10&sortBy=name&sortOrder=asc&segment=Enterprise'
    );
  });
});