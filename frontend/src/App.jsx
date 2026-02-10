import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/PrivateRoute';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import SellerRegistration from './pages/procurement/SellerRegistration';
import AnimalRegistration from './pages/procurement/AnimalRegistration';
import HealthCheck from './pages/procurement/HealthCheck';
import AgentRegistration from './pages/procurement/AgentRegistration';
import ForgetPassword from './pages/Auth/ForgotPassword';
import SellersList from './pages/management/sellers/SellersList';
import AgentsList from './pages/management/agents/AgentsList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} /> {/* Add this route */}
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Procurement Routes */}
            <Route path="procurement/agent-registration" element={<AgentRegistration />} />
            <Route path="procurement/seller-registration" element={<SellerRegistration />} />
            <Route path="procurement/animal-registration" element={<AnimalRegistration />} />
            <Route path="procurement/health-check" element={<HealthCheck />} />

            {/* Management Menu Routes */}
            <Route path="management/sellers" element={<SellersList/>} />
            <Route path="management/commission-agents" element={<AgentsList/>} />

            {/* Placeholder routes for other pages */}
            <Route path="animals" element={<Placeholder title="Animals" />} />
            <Route path="transporters" element={<Placeholder title="Transporters" />} />
            <Route path="suppliers" element={<Placeholder title="Suppliers" />} />
            <Route path="agents" element={<Placeholder title="Commission Agents" />} />
            <Route path="beneficiaries" element={<Placeholder title="Beneficiaries" />} />
            <Route path="team" element={<Placeholder title="Team Members" />} />
            <Route path="reports" element={<Placeholder title="Reports" />} />
            <Route path="settings" element={<Placeholder title="Settings" />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Placeholder component for incomplete pages
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-6xl mb-4">🚧</div>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">{title} Page</h1>
    <p className="text-gray-600">This page is under construction</p>
    <p className="text-gray-500 text-sm mt-4">Coming soon with complete functionality</p>
  </div>
);

export default App;