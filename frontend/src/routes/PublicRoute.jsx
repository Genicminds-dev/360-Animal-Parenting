import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f48563]"></div>
    </div>
  );
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

export default PublicRoute;