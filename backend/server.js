import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Import routes
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Knit Dashboard API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test endpoint with comprehensive mock data
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    endpoints: {
      health: '/api/health',
      growth: '/api/dashboard/growth-summary',
      collections: '/api/dashboard/collections-summary',
      schools: '/api/dashboard/school-engagement'
    },
    sampleData: {
      metrics: [
        { id: 1, label: 'Total Schools', value: 1542, change: 2.4, trend: 'positive' },
        { id: 2, label: 'Active Collections', value: 8921, change: 5.7, trend: 'positive' },
        { id: 3, label: 'Parent MAU', value: 45231, change: -1.2, trend: 'negative' },
        { id: 4, label: 'Adoption Rate', value: 67.8, change: 3.1, trend: 'positive' },
        { id: 5, label: 'Retention Rate', value: 84.5, change: 0.8, trend: 'positive' }
      ]
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard API available at http://localhost:${PORT}/api/dashboard`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Using mock data mode - ready for frontend development`);
});

export default app;