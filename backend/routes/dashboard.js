import express from 'express';
import { supabase, testConnection } from '../config/supabase.js';

const router = express.Router();

// Helper function to simulate delay
const simulateDelay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for development
const mockSchools = [
  { id: 1, name: 'Lincoln High School', segment: 'Enterprise', parentMau: 2450, collections: 156, adoptionRate: 89, location: 'New York, NY', status: 'active' },
  { id: 2, name: 'Riverside Academy', segment: 'Growth', parentMau: 1870, collections: 132, adoptionRate: 76, location: 'Chicago, IL', status: 'active' },
  { id: 3, name: 'Maplewood Elementary', segment: 'Starter', parentMau: 920, collections: 89, adoptionRate: 65, location: 'Austin, TX', status: 'active' },
  { id: 4, name: 'Westside Charter', segment: 'Enterprise', parentMau: 3120, collections: 201, adoptionRate: 92, location: 'Los Angeles, CA', status: 'active' },
  { id: 5, name: 'Northgate Middle School', segment: 'Growth', parentMau: 1560, collections: 118, adoptionRate: 71, location: 'Seattle, WA', status: 'active' },
  { id: 6, name: 'Springfield Public', segment: 'Enterprise', parentMau: 4280, collections: 278, adoptionRate: 95, location: 'Springfield, IL', status: 'active' },
  { id: 7, name: 'Oakwood District', segment: 'Starter', parentMau: 780, collections: 67, adoptionRate: 58, location: 'Denver, CO', status: 'at-risk' },
  { id: 8, name: 'Hillside Academy', segment: 'Growth', parentMau: 1980, collections: 145, adoptionRate: 82, location: 'Boston, MA', status: 'active' },
  { id: 9, name: 'Valley View School', segment: 'Starter', parentMau: 650, collections: 54, adoptionRate: 62, location: 'Phoenix, AZ', status: 'active' },
  { id: 10, name: 'Central High', segment: 'Enterprise', parentMau: 3650, collections: 234, adoptionRate: 88, location: 'Miami, FL', status: 'active' }
];

const mockWeeklyData = [
  { week: 'Week 1', collections: 1842, outstanding: 892, adoption: 67 },
  { week: 'Week 2', collections: 1921, outstanding: 845, adoption: 69 },
  { week: 'Week 3', collections: 2103, outstanding: 912, adoption: 72 },
  { week: 'Week 4', collections: 1987, outstanding: 876, adoption: 71 },
  { week: 'Week 5', collections: 2234, outstanding: 834, adoption: 75 },
  { week: 'Week 6', collections: 2156, outstanding: 789, adoption: 76 }
];

const mockCohorts = [
  {
    week: '2024-W01',
    retention: [
      { week: 1, percentage: 95, schoolCount: 120 },
      { week: 2, percentage: 88, schoolCount: 113 },
      { week: 3, percentage: 82, schoolCount: 98 },
      { week: 4, percentage: 78, schoolCount: 94 }
    ]
  },
  {
    week: '2024-W02',
    retention: [
      { week: 1, percentage: 93, schoolCount: 135 },
      { week: 2, percentage: 87, schoolCount: 117 },
      { week: 3, percentage: 81, schoolCount: 109 },
      { week: 4, percentage: 76, schoolCount: 103 }
    ]
  }
];

const mockInsights = [
  {
    id: 1,
    category: 'performance',
    message: 'Schools in the Northeast region showed 15% higher adoption rates this week.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    actionLink: '/analytics/regions',
    priority: 'high'
  },
  {
    id: 2,
    category: 'risk',
    message: '3 schools have shown declining engagement for 2 consecutive weeks.',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    actionLink: '/schools/at-risk',
    priority: 'medium'
  },
  {
    id: 3,
    category: 'opportunity',
    message: 'Premium features adoption increased by 22% in enterprise segment.',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    actionLink: '/features/analytics',
    priority: 'low'
  }
];

// Test database connection on startup
let useRealDatabase = false;
testConnection().then(connected => {
  useRealDatabase = connected;
  console.log(connected ? '✅ Using real Supabase database' : '🔶 Using mock data for development');
});

// GET /api/dashboard/growth-summary
router.get('/growth-summary', async (req, res) => {
  try {
    await simulateDelay();

    console.log('📊 Fetching growth summary...');

    let metrics;
    
    if (useRealDatabase) {
      // Try to get real data from Supabase
      try {
        const { data: schools, error } = await supabase.from('schools').select('*');
        if (!error && schools) {
          const totalSchools = schools.length;
          const totalParentMau = schools.reduce((sum, school) => sum + (school.parent_mau || 0), 0);
          const avgAdoptionRate = schools.reduce((sum, school) => sum + (school.adoption_rate || 0), 0) / schools.length;

          metrics = [
            { id: 1, label: 'Total Schools', value: totalSchools, change: 2.4, trend: 'positive' },
            { id: 2, label: 'Active Collections', value: 8921, change: 5.7, trend: 'positive' },
            { id: 3, label: 'Parent MAU', value: totalParentMau, change: -1.2, trend: 'negative' },
            { id: 4, label: 'Adoption Rate', value: parseFloat(avgAdoptionRate.toFixed(1)), change: 3.1, trend: 'positive' },
            { id: 5, label: 'Retention Rate', value: 84.5, change: 0.8, trend: 'positive' }
          ];
        }
      } catch (dbError) {
        console.log('Falling back to mock data:', dbError.message);
      }
    }

    // Use mock data if real data isn't available
    if (!metrics) {
      metrics = [
        { id: 1, label: 'Total Schools', value: 1542, change: 2.4, trend: 'positive' },
        { id: 2, label: 'Active Collections', value: 8921, change: 5.7, trend: 'positive' },
        { id: 3, label: 'Parent MAU', value: 45231, change: -1.2, trend: 'negative' },
        { id: 4, label: 'Adoption Rate', value: 67.8, change: 3.1, trend: 'positive' },
        { id: 5, label: 'Retention Rate', value: 84.5, change: 0.8, trend: 'positive' }
      ];
    }

    const response = {
      metrics,
      lastUpdated: new Date().toISOString(),
      dataSource: useRealDatabase ? 'supabase' : 'mock'
    };

    console.log('✅ Growth summary sent successfully');
    res.json(response);
  } catch (error) {
    console.error('Growth summary error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch growth summary',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/dashboard/collections-summary
router.get('/collections-summary', async (req, res) => {
  try {
    await simulateDelay();

    const response = {
      weeklyData: mockWeeklyData,
      summary: {
        totalCollections: mockWeeklyData.reduce((sum, week) => sum + week.collections, 0),
        averageOutstanding: Math.round(mockWeeklyData.reduce((sum, week) => sum + week.outstanding, 0) / mockWeeklyData.length),
        growthRate: 12.5
      },
      lastUpdated: new Date().toISOString(),
      dataSource: 'mock'
    };

    res.json(response);
  } catch (error) {
    console.error('Collections summary error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch collections summary',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/dashboard/retention-cohorts
router.get('/retention-cohorts', async (req, res) => {
  try {
    await simulateDelay();

    const response = {
      cohorts: mockCohorts,
      averageRetention: {
        week1: Math.round(mockCohorts.reduce((sum, cohort) => sum + cohort.retention[0].percentage, 0) / mockCohorts.length),
        week4: Math.round(mockCohorts.reduce((sum, cohort) => sum + cohort.retention[3].percentage, 0) / mockCohorts.length)
      },
      lastUpdated: new Date().toISOString(),
      dataSource: 'mock'
    };

    res.json(response);
  } catch (error) {
    console.error('Retention cohorts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch retention cohorts',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/dashboard/insights
router.get('/insights', async (req, res) => {
  try {
    await simulateDelay();

    const response = {
      insights: mockInsights,
      summary: {
        total: mockInsights.length,
        performance: mockInsights.filter(i => i.category === 'performance').length,
        risk: mockInsights.filter(i => i.category === 'risk').length,
        opportunity: mockInsights.filter(i => i.category === 'opportunity').length
      },
      lastUpdated: new Date().toISOString(),
      dataSource: 'mock'
    };

    res.json(response);
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch insights',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/dashboard/school-engagement
router.get('/school-engagement', async (req, res) => {
  try {
    await simulateDelay();

    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      segment,
      adoptionRate
    } = req.query;

    let filteredSchools = [...mockSchools];

    // Apply filters
    if (segment) {
      filteredSchools = filteredSchools.filter(school => 
        school.segment.toLowerCase() === segment.toLowerCase()
      );
    }

    if (adoptionRate) {
      filteredSchools = filteredSchools.filter(school => {
        switch (adoptionRate) {
          case 'high': return school.adoptionRate >= 80;
          case 'medium': return school.adoptionRate >= 60 && school.adoptionRate < 80;
          case 'low': return school.adoptionRate < 60;
          default: return true;
        }
      });
    }

    // Apply sorting
    filteredSchools.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Apply pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedSchools = filteredSchools.slice(startIndex, endIndex);

    const response = {
      schools: paginatedSchools,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredSchools.length,
        totalPages: Math.ceil(filteredSchools.length / limitNum)
      },
      lastUpdated: new Date().toISOString(),
      dataSource: 'mock'
    };

    res.json(response);
  } catch (error) {
    console.error('School engagement error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch school engagement data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;