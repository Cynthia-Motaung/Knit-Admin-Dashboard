import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Mock Recharts at the top level
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="recharts-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock API at the top level
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn()
  }
}));

import api from '../services/api';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        // Reduce timeouts for tests
        staleTime: 0,
        cacheTime: 0
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API responses
    api.get.mockImplementation((url) => {
      const responses = {
        '/api/dashboard/growth-summary': {
          data: {
            metrics: [
              { id: 1, label: 'Total Schools', value: 1542, change: 2.4, trend: 'positive' },
              { id: 2, label: 'Active Collections', value: 8921, change: 5.7, trend: 'positive' },
              { id: 3, label: 'Parent MAU', value: 45231, change: -1.2, trend: 'negative' },
              { id: 4, label: 'Adoption Rate', value: 67.8, change: 3.1, trend: 'positive' },
              { id: 5, label: 'Retention Rate', value: 84.5, change: 0.8, trend: 'positive' }
            ]
          }
        },
        '/api/dashboard/collections-summary': {
          data: {
            weeklyData: [
              { week: 'Week 1', collections: 1842, outstanding: 892, adoption: 67 }
            ]
          }
        },
        '/api/dashboard/school-engagement': {
          data: {
            schools: [
              { 
                id: 1, 
                name: 'Test School', 
                segment: 'Enterprise', 
                parentMau: 1000, 
                collections: 50, 
                adoptionRate: 85,
                location: 'Test City',
                status: 'active'
              }
            ],
            pagination: { page: 1, total: 1, totalPages: 1 }
          }
        },
        '/api/dashboard/retention-cohorts': {
          data: {
            cohorts: [
              {
                week: '2024-W01',
                retention: [
                  { week: 1, percentage: 95, schoolCount: 120 },
                  { week: 2, percentage: 88, schoolCount: 113 }
                ]
              }
            ]
          }
        },
        '/api/dashboard/insights': {
          data: {
            insights: [
              {
                id: 1,
                category: 'performance',
                message: 'Test insight message',
                timestamp: new Date().toISOString(),
                priority: 'high'
              }
            ]
          }
        }
      };
      
      return Promise.resolve(responses[url] || { data: {} });
    });
  });

  test('renders all dashboard sections with data', async () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    // Wait for data to load and verify sections render
    await waitFor(() => {
      expect(screen.getByText('Total Schools')).toBeInTheDocument();
      expect(screen.getByText('1,542')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('🏫 School Engagement')).toBeInTheDocument();
      expect(screen.getByText('📈 Weekly Performance')).toBeInTheDocument();
      expect(screen.getByText('👥 Retention Cohort Analysis')).toBeInTheDocument();
      expect(screen.getByText('💡 Performance Insights')).toBeInTheDocument();
    });
  }, 10000);

  test('handles API errors gracefully', async () => {
    // Mock ALL API calls to fail
    api.get.mockRejectedValue(new Error('API Error'));

    render(<Dashboard />, { wrapper: createWrapper() });

    // Wait for the dashboard structure to render
    await waitFor(() => {
      // Check for the main dashboard heading (more specific than just text)
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Real-time platform analytics and insights')).toBeInTheDocument();
    });

    // Check that loading states are shown (skeletons)
    await waitFor(() => {
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      // Should have multiple skeleton elements for different components
      expect(skeletonElements.length).toBeGreaterThan(2);
    }, { timeout: 5000 });
  }, 10000);
});