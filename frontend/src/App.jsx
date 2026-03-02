import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Import Context Provider
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Layout component
import Layout from './components/Layout/Layout';

// Import Route Components
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import SellerRegistration from './pages/procurement/SellerRegistration';
import AnimalRegistration from './pages/procurement/AnimalRegistration';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import SellersList from './pages/management/sellers/SellersList';
import AnimalsList from './pages/management/animals/AnimalsList';
import AnimalDetails from './pages/management/animals/AnimalDetails';

// Import path routes
import { PATHROUTES } from './routes/pathRoutes';

// Import API and endpoints
import api from "./services/api/api";
import { Endpoints } from "./services/api/EndPoint";
import SessionTimeoutModal from './components/Layout/Session/SessionTimeoutModal';
import HealthCheckupList from './pages/procurement/HealthCheckupList';
import SellerDetails from './pages/management/sellers/SellerDetails';
import EditSeller from './pages/management/sellers/EditSeller';
import HealthCheckupForm from './pages/procurement/HealthCheckupForm';
import ManageUsersForm from './pages/manageUsers/ManageUsersForm';
import ManageUsersTable from './pages/manageUsers/ManageUsersTable';
import ViewUserDetails from './pages/manageUsers/ViewUserDetails';
import EditAnimal from './pages/management/animals/EditAnimal';
import SettingsPage from './pages/settings/SettingPage';
import AnimalProcurement from './pages/AnimalProcurement/AnimalProcurement';
import ProcurementView from './pages/AnimalProcuredList/ProcurementView';
import ProcurementList from './pages/AnimalProcuredList/ProcurementList';



import BrokersList from './pages/management/broker/BrokersList';
import AddBroker from './pages/management/broker/AddBroker';
import EditBroker from './pages/management/broker/EditBroker';
import BrokerDetails from './pages/management/broker/BrokerDetails';
import ManageSchemesTable from './pages/manageSchemes/ManageSchemesTable';
import HandoverList from './pages/management/Handover/HandoverList';


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
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);


  // Define handleLogout first before it's used
  const handleLogout = useCallback(async (isSessionExpired = false) => {
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
  }, [logout, navigate]);

  // Then define checkAuthStatus that uses handleLogout
  const checkAuthStatus = useCallback(() => {
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        const currentTime = Date.now() / 1000;

        // If token is expired, trigger logout
        if (decoded.exp < currentTime) {
          handleLogout(true); // true for session expired
          return;
        }

        // AuthContext already handles user state
        setSessionExpired(false);
      } catch (error) {
        console.error("Invalid Token", error);
        handleLogout(true);
      }
    }
    setIsLoading(false);
  }, [handleLogout]);

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]);

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
            <PrivateRoute>
              <Layout onLogout={handleLogout} />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to={PATHROUTES.dashboard} replace />} />
          <Route path={PATHROUTES.dashboard.replace('/', '')} element={<Dashboard />} />

          {/* Procurement Routes with Role-based Access */}
          <Route
            path={PATHROUTES.sellerRegistration.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <SellerRegistration />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.animalRegistration.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <AnimalRegistration />
              </PrivateRoute>
            }
          />

          <Route
            path={PATHROUTES.healthCheckupList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <HealthCheckupList />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.healthCheckupForm.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <HealthCheckupForm />
              </PrivateRoute>
            }
          />

          {/* Management Menu Routes */}
          <Route
            path={PATHROUTES.sellersList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <SellersList />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.editSeller.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <EditSeller />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.sellerDetails.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <SellerDetails />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.brokerList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <BrokersList />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.brokerDetails.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <BrokerDetails />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.brokerRegistration.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <AddBroker />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.editBroker.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <EditBroker />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.animalsList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <AnimalsList />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.animalDetails.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <AnimalDetails />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.editAnimal.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <EditAnimal />
              </PrivateRoute>
            }
          />

          <Route
            path={PATHROUTES.schemeList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ManageSchemesTable />
              </PrivateRoute>
            }
          />

          <Route
            path={PATHROUTES.handoverList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <HandoverList />
              </PrivateRoute>
            }
          />




          {/* Transporters */}
          <Route
            path={PATHROUTES.transporters.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <Placeholder title="Transporters" />
              </PrivateRoute>
            }
          />

          {/* Suppliers */}
          <Route
            path={PATHROUTES.suppliers.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <Placeholder title="Suppliers" />
              </PrivateRoute>
            }
          />

          {/* Beneficiaries */}
          <Route
            path={PATHROUTES.beneficiaries.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1]}>
                <Placeholder title="Beneficiaries" />
              </PrivateRoute>
            }
          />

          {/* Team Members */}
          <Route
            path={PATHROUTES.team.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1]}>
                <Placeholder title="Team Members" />
              </PrivateRoute>
            }
          />

          {/* Reports */}
          <Route
            path={PATHROUTES.reports.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <Placeholder title="Reports" />
              </PrivateRoute>
            }
          />














          <Route
            path={PATHROUTES.animalProcurement.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <AnimalProcurement />
              </PrivateRoute>
            }
          />

          <Route
            path={PATHROUTES.editanimalProcurement}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <AnimalProcurement />
              </PrivateRoute>
            }
          />

          <Route
            path={PATHROUTES.animalProcuredList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <ProcurementList />
              </PrivateRoute>
            }
          />

          <Route
            path={`${PATHROUTES.animalProcurementView.replace('/', '')}/:id`}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <ProcurementView />
              </PrivateRoute>
            }
          />
























          <Route
            path={PATHROUTES.userList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ManageUsersTable />
              </PrivateRoute>
            }
          />

          <Route
            path={PATHROUTES.addUsers.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ManageUsersForm />
              </PrivateRoute>
            }
          />

          <Route
            path={`${PATHROUTES.editUsers.replace('/', '')}/:id`}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ManageUsersForm />
              </PrivateRoute>
            }
          />

          <Route
            path={`${PATHROUTES.viewUsers}/:id`}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ViewUserDetails />
              </PrivateRoute>
            }
          />

          {/* Settings */}
          <Route
            path={PATHROUTES.settings.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <SessionTimeoutModal isAuthenticated={isAuthenticated} onLogout={handleLogout} />
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