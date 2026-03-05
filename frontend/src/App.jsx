import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import api from "./services/api/api";
import { PATHROUTES } from './routes/pathRoutes';
import { Endpoints } from "./services/api/EndPoint";
import SessionTimeoutModal from './components/Layout/Session/SessionTimeoutModal';

// Pages
import SellerRegistration from './pages/procurement/SellerRegistration';
import AnimalRegistration from './pages/procurement/AnimalRegistration';
import SellersList from './pages/management/sellers/SellersList';
import HealthCheckupList from './pages/procurement/HealthCheckupList';
import SellerDetails from './pages/management/sellers/SellerDetails';
import EditSeller from './pages/management/sellers/EditSeller';
import HealthCheckupForm from './pages/procurement/HealthCheckupForm';
import ProcurementView from './pages/AnimalProcuredList/ProcurementView';
import ProcurementList from './pages/AnimalProcuredList/ProcurementList';
import PAnimalRegistration from './pages/AnimalProcurementOld/PAnimalRegistration';


import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import AnimalDetails from './pages/management/animals/AnimalDetails';
import ProcuredAnimals from './pages/management/animals/AnimalsList';
import EditAnimal from './pages/management/animals/EditAnimal';
import HandoverList from './pages/management/handover/HandoverList';
import AddHandover from './pages/management/handover/AddHandover';
import EditHandover from './pages/management/handover/EditHandover';
import HandoverDetails from './pages/management/handover/HandoverDetails';
import BrokersList from './pages/management/broker/BrokersList';
import AddBroker from './pages/management/broker/AddBroker';
import EditBroker from './pages/management/broker/EditBroker';
import BrokerDetails from './pages/management/broker/BrokerDetails';
import ManageSchemesTable from './pages/manageSchemes/ManageSchemesTable';
import AddScheme from './pages/manageSchemes/AddScheme';
import EditScheme from './pages/manageSchemes/EditScheme';
import ManageUsersForm from './pages/manageUsers/ManageUsersForm';
import ManageUsersTable from './pages/manageUsers/ManageUsersTable';
import ViewUserDetails from './pages/manageUsers/ViewUserDetails';
import SettingsPage from './pages/settings/SettingPage';



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
          {/* <Route
            path={PATHROUTES.sellerRegistration.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <SellerRegistration />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path={PATHROUTES.animalRegistration.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <AnimalRegistration />
              </PrivateRoute>
            }
          /> */}

          {/* <Route
            path={PATHROUTES.healthCheckupList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <HealthCheckupList />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path={PATHROUTES.healthCheckupForm.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <HealthCheckupForm />
              </PrivateRoute>
            }
          /> */}

          {/* Management Menu Routes */}
          {/* <Route
            path={PATHROUTES.sellersList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <SellersList />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path={PATHROUTES.editSeller.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <EditSeller />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path={PATHROUTES.sellerDetails.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <SellerDetails />
              </PrivateRoute>
            }
          /> */}

          {/* Transporters */}
          {/* <Route
                  path={PATHROUTES.transporters.replace('/', '')}
                  element={
                    <PrivateRoute allowedRoles={[1, 2]}>
                      <Placeholder title="Transporters" />
                    </PrivateRoute>
                  }
                /> */}

          {/* Suppliers */}
          {/* <Route
                  path={PATHROUTES.suppliers.replace('/', '')}
                  element={
                    <PrivateRoute allowedRoles={[1, 2]}>
                      <Placeholder title="Suppliers" />
                    </PrivateRoute>
                  }
                /> */}

          {/* Beneficiaries */}
          {/* <Route
                  path={PATHROUTES.beneficiaries.replace('/', '')}
                  element={
                    <PrivateRoute allowedRoles={[1]}>
                      <Placeholder title="Beneficiaries" />
                    </PrivateRoute>
                  }
                /> */}

          {/* Team Members */}
          {/* <Route
                  path={PATHROUTES.team.replace('/', '')}
                  element={
                    <PrivateRoute allowedRoles={[1]}>
                      <Placeholder title="Team Members" />
                    </PrivateRoute>
                  }
                /> */}

          {/* Reports */}
          {/* <Route
                  path={PATHROUTES.reports.replace('/', '')}
                  element={
                    <PrivateRoute allowedRoles={[1, 2]}>
                      <Placeholder title="Reports" />
                    </PrivateRoute>
                  }
                /> */}


          {/* <Route
                  path={PATHROUTES.animalRegistration.replace('/', '')}
                  element={
                    <PrivateRoute allowedRoles={[1, 2, 3]}>
                      <PAnimalRegistration />
                    </PrivateRoute>
                  }
                /> */}

          {/* <Route
                  path={PATHROUTES.editanimalProcurement}
                  element={
                    <PrivateRoute allowedRoles={[1, 2, 3]}>
                      <PAnimalRegistration />
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
                /> */}


          {/* Animal Procurement */}
          <Route
            path={PATHROUTES.animalProcurement.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <Placeholder title="Beneficiaries" />
              </PrivateRoute>
            }
          />

          {/* Procured Animal*/}
          <Route
            path={PATHROUTES.procuredAnimals.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <ProcuredAnimals />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PATHROUTES.animalDetails.replace('/', '')}/:earTagId`}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <AnimalDetails />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PATHROUTES.editAnimal.replace('/', '')}/:earTagId`}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <EditAnimal />
              </PrivateRoute>
            }
          />

          {/* Handover */}
          <Route
            path={PATHROUTES.handoverList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <HandoverList />
              </PrivateRoute>
            }
          />

          <Route
            path={PATHROUTES.addHandover.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <AddHandover />
              </PrivateRoute>
            }
          />

          <Route
            path={`${PATHROUTES.editHandover.replace('/', '')}/:uid`}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <EditHandover />
              </PrivateRoute>
            }
          />

          <Route
            path={`${PATHROUTES.handoverDetails.replace('/', '')}/:uid`}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <HandoverDetails />
              </PrivateRoute>
            }
          />

          {/* Brokers */}
          <Route
            path={PATHROUTES.brokerList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <BrokersList />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PATHROUTES.brokerDetails.replace('/', '')}/:uid`}
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
            path={`${PATHROUTES.editBroker.replace('/', '')}/:uid`}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <EditBroker />
              </PrivateRoute>
            }
          />

          {/* Scheme Master */}
          <Route
            path={PATHROUTES.schemeList.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ManageSchemesTable />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHROUTES.addScheme.replace('/', '')}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <AddScheme />
              </PrivateRoute>
            }
          />

          <Route
            path={`${PATHROUTES.editScheme.replace('/', '')}/:id`}
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <EditScheme />
              </PrivateRoute>
            }
          />

          {/* User Management */}
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