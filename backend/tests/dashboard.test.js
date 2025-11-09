import request from 'supertest';
import express from 'express';
import dashboardRoutes from '../routes/dashboard.js';

// Mock Supabase
jest.mock('../config/supabase.js', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [{ id: 1, name: 'Test School' }],
        error: null
      })),
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: 1, name: 'Test School' }],
          error: null
        }))
      })),
      order: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: 1, name: 'Test School' }],
          error: null
        }))
      }))
    }))
  }
}));

const app = express();
app.use(express.json());
app.use('/api/dashboard', dashboardRoutes);

describe('Dashboard API Routes', () => {
  test('GET /api/dashboard/growth-summary returns metrics', async () => {
    const response = await request(app)
      .get('/api/dashboard/growth-summary')
      .expect(200);

    expect(response.body).toHaveProperty('metrics');
    expect(response.body.metrics).toBeInstanceOf(Array);
    expect(response.body).toHaveProperty('lastUpdated');
  });

  test('GET /api/dashboard/school-engagement with pagination', async () => {
    const response = await request(app)
      .get('/api/dashboard/school-engagement?page=1&limit=5')
      .expect(200);

    expect(response.body).toHaveProperty('schools');
    expect(response.body).toHaveProperty('pagination');
    expect(response.body.pagination).toHaveProperty('page', 1);
    expect(response.body.pagination).toHaveProperty('limit', 5);
  });

  test('GET /api/dashboard/school-engagement with filters', async () => {
    const response = await request(app)
      .get('/api/dashboard/school-engagement?segment=Enterprise')
      .expect(200);

    expect(response.body.filters).toHaveProperty('segment', 'Enterprise');
  });
});