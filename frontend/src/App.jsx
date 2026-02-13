import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Import Context Provider
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Layout component
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import SellerRegistration from './pages/procurement/SellerRegistration';
import AnimalRegistration from './pages/procurement/AnimalRegistration';

import AgentRegistration from './pages/procurement/AgentRegistration';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import SellersList from './pages/management/sellers/SellersList';
import AgentsList from './pages/management/agents/AgentsList';
import AnimalsList from './pages/management/animals/AnimalsList';
import AnimalDetails from './pages/management/animals/AnimalDetails';

// Import path routes
import { PATHROUTES } from './routes/pathRoutes';

// Import API and endpoints
import api from "./services/api/api";
import { Endpoints } from "./services/api/EndPoint";
import SessionTimeoutModal from './components/SessionTimeoutModal';
import HealthCheckupList from './pages/procurement/HealthCheckupList';
import AgentDetails from './pages/management/agents/AgentDetails';
import EditAgent from './pages/management/agents/EditAgent';
import SellerDetails from './pages/management/sellers/SellerDetails';
import EditSeller from './pages/management/sellers/EditSeller';
import HealthCheckupForm from './pages/procurement/HealthCheckupForm';
import ManageUsersForm from './pages/manageUsers/ManageUsersForm';
import ManageUsersTable from './pages/manageUsers/ManageUsersTable';
import ViewUserDetails from './pages/manageUsers/ViewUserDetails';
import { Edit3Icon } from 'lucide-react';
import EditAnimal from './pages/management/animals/EditAnimal';

// ProtectedRoute Component
const ProtectedRoute = ({ children, allowedRoles = [1, 2, 3] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// PublicRoute Component
const PublicRoute = ({ children, restricted = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (restricted && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f48563]"></div>
    </div>
  );
};

// Placeholder component for incomplete pages
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-6xl mb-4">🚧</div>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">{title} Page</h1>
    <p className="text-gray-600">This page is under construction</p>
    <p className="text-gray-500 text-sm mt-4">Coming soon with complete functionality</p>
  </div>
);

// Main App Component
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loginSuccess, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const checkAuthStatus = useCallback(() => {
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        // AuthContext already handles user state
        setSessionExpired(false);
      } catch (error) {
        console.error("Invalid Token", error);
        handleLogout();
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]);

  const handleLogout = async (isSessionExpired = false) => {
    try {
      const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (authToken) {
        await api.post(
          Endpoints.LOGOUT,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      }
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      // Call AuthContext logout
      logout();
      if (isSessionExpired) {
        setSessionExpired(true);
      }
      navigate(PATHROUTES.login, { replace: true });
    }
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path={PATHROUTES.login}
          element={
            <PublicRoute restricted>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={PATHROUTES.dashboard} replace />} />
          <Route path={PATHROUTES.dashboard.replace('/', '')} element={<Dashboard />} />

          {/* Procurement Routes with Role-based Access */}
          <Route
            path={PATHROUTES.agentRegistration.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <AgentRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.sellerRegistration.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <SellerRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.animalRegistration.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3]}>
                <AnimalRegistration />
              </ProtectedRoute>
            }
          />

          <Route
            path={PATHROUTES.healthCheckupList.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3]}>
                <HealthCheckupList />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.healthCheckupForm.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3]}>
                <HealthCheckupForm />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path={PATHROUTES.healthCheck.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <HealthCheck />
              </ProtectedRoute>
            }
          /> */}

          {/* Management Menu Routes */}
          <Route
            path={PATHROUTES.sellersList.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <SellersList />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.editSeller.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <EditSeller />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.sellerDetails.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <SellerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.agentsList.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <AgentsList />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.agentDetails.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <AgentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.editAgent.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <EditAgent />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.animalsList.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3]}>
                <AnimalsList />
              </ProtectedRoute>
            }
          />
          <Route
            path={PATHROUTES.animalDetails.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3]}>
                <AnimalDetails />
              </ProtectedRoute>
            }
          />
           <Route
            path={PATHROUTES.editAnimal.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3]}>
                <EditAnimal/>
              </ProtectedRoute>
            }
          />

          {/* Transporters */}
          <Route
            path={PATHROUTES.transporters.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <Placeholder title="Transporters" />
              </ProtectedRoute>
            }
          />

          {/* Suppliers */}
          <Route
            path={PATHROUTES.suppliers.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <Placeholder title="Suppliers" />
              </ProtectedRoute>
            }
          />

          {/* Beneficiaries */}
          <Route
            path={PATHROUTES.beneficiaries.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <Placeholder title="Beneficiaries" />
              </ProtectedRoute>
            }
          />

          {/* Team Members */}
          <Route
            path={PATHROUTES.team.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <Placeholder title="Team Members" />
              </ProtectedRoute>
            }
          />

          {/* Reports */}
          <Route
            path={PATHROUTES.reports.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <Placeholder title="Reports" />
              </ProtectedRoute>
            }
          />

          <Route
            path={PATHROUTES.manageUsers.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <ManageUsersTable />
              </ProtectedRoute>
            }
          />

          <Route
            path={PATHROUTES.addUsers.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <ManageUsersForm />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${PATHROUTES.editUsers.replace('/', '')}/:id`}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <ManageUsersForm />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${PATHROUTES.viewUsers}/:id`}
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <ViewUserDetails />
              </ProtectedRoute>
            }
          />


          {/* Settings */}
          <Route
            path={PATHROUTES.settings.replace('/', '')}
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <Placeholder title="Settings" />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <SessionTimeoutModal isAuthenticated={isAuthenticated} onLogout={handleLogout}
      />
    </>
  );
};

// Main App Component with Router and AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;