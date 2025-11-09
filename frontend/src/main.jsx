import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Simple error boundary for the root
const Root = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Root />);
} catch (error) {
  console.error('Failed to render React app:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>App Failed to Load</h2>
      <p>Error: ${error.message}</p>
      <button onclick="window.location.reload()">Reload Page</button>
    </div>
  `;
}