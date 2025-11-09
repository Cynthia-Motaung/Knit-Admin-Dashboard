A comprehensive admin dashboard with real-time analytics and Supabase integration.

🚀 Features
Real-time Analytics: Live data with auto-refresh every 5 minutes

KPI Dashboard: Key metrics with trend indicators

Interactive Charts: Collections and performance trends

School Management: Sortable and filterable school data

Retention Analysis: Cohort retention tracking

Smart Insights: Performance alerts and recommendations

Responsive Design: Works on desktop and mobile

🛠 Tech Stack
Frontend:

React 18 + Vite

Tailwind CSS

React Query

Recharts

React Router

Backend:

Node.js + Express

Supabase (PostgreSQL)

CORS + Helmet

📦 Quick Setup
Prerequisites
Node.js 16+

Supabase account

Git

Installation
Clone the repository

bash
git clone https://github.com/Cynthia-Motaung/Knit-Admin-Dashboard.git
cd Knit-Admin-Dashboard
Backend Setup

bash
cd backend
cp .env.example .env
# Add your Supabase credentials to .env
npm install
npm run dev
Frontend Setup

bash
cd frontend
npm install
npm run dev
Access the Dashboard

Frontend: http://localhost:3000

Backend API: http://localhost:5001

Environment Variables
Backend (.env):

env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
PORT=5001
CORS_ORIGIN=http://localhost:3000
📊 API Endpoints
GET /api/dashboard/growth-summary - KPI metrics

GET /api/dashboard/collections-summary - Chart data

GET /api/dashboard/school-engagement - School data

GET /api/dashboard/retention-cohorts - Retention analysis

GET /api/dashboard/insights - Performance insights

🧪 Testing
bash
cd frontend
npm test
📱 Usage
The dashboard automatically:

Fetches live data from Supabase

Updates every 5 minutes

Shows loading states during fetches

Handles errors gracefully

Works on all screen sizes
