import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useGrowthSummary = () => {
  return useQuery({
    queryKey: ['growthSummary'],
    queryFn: () => api.get('/api/dashboard/growth-summary'),
    refetchInterval: 300000,
    retry: 1,
  });
};

export const useCollectionsSummary = () => {
  return useQuery({
    queryKey: ['collectionsSummary'],
    queryFn: () => api.get('/api/dashboard/collections-summary'),
    refetchInterval: 300000,
    retry: 1,
  });
};

export const useRetentionCohorts = () => {
  return useQuery({
    queryKey: ['retentionCohorts'],
    queryFn: () => api.get('/api/dashboard/retention-cohorts'),
    refetchInterval: 300000,
    retry: 1,
  });
};

export const useDashboardInsights = () => {
  return useQuery({
    queryKey: ['dashboardInsights'],
    queryFn: () => api.get('/api/dashboard/insights'),
    refetchInterval: 600000,
    retry: 1,
  });
};

export const useSchoolEngagement = (page = 1, limit = 10, filters = {}, sortBy = 'name', sortOrder = 'asc') => {
  return useQuery({
    queryKey: ['schoolEngagement', page, limit, filters, sortBy, sortOrder],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...filters,
      });
      return api.get(`/api/dashboard/school-engagement?${params}`);
    },
    keepPreviousData: true,
    retry: 1,
  });
};