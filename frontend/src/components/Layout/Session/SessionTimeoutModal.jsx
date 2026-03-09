import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../../services/api/api";
import { PATHROUTES } from "../../../routes/pathRoutes";

const SessionTimeoutModal = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Session Expired");
  const [logoutMessage, setLogoutMessage] = useState(
    "Your session has expired. Please log in again."
  );

  const navigate = useNavigate();
  const forceLogoutRef = useRef(false);

  // Check token expiration on component mount and when isAuthenticated changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenOnLoad = () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // If token is already expired
        if (decoded.exp < currentTime) {
          setTitle("Session Expired");
          setLogoutMessage(
            "Your session has expired. Please log in again."
          );
          setIsOpen(true);
        }
      } catch (error) {
        // Invalid token
        setTitle("Session Expired");
        setLogoutMessage("Invalid session. Please log in again.");
        setIsOpen(true);
      }
    };

    // Check immediately on mount
    checkTokenOnLoad();

    // Also check whenever isAuthenticated changes
    const interval = setInterval(() => {
      if (forceLogoutRef.current) return;

      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired or about to expire (within 5 seconds)
        if (decoded.exp < currentTime + 5) {
          setTitle("Session Expired");
          setLogoutMessage(
            "Your session has expired. Please log in again."
          );
          setIsOpen(true);
        }
      } catch {
        setTitle("Session Expired");
        setLogoutMessage("Invalid session. Please log in again.");
        setIsOpen(true);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Interceptor for API responses
  useEffect(() => {
    if (!isAuthenticated) return;

    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 403 && data?.forceLogout) {
          forceLogoutRef.current = true;

          setTitle("Account Deactivated");
          setLogoutMessage(
            data.message ||
            "Your account has been deactivated by the administrator."
          );
          setIsOpen(true);

          return Promise.reject(error);
        }

        if (forceLogoutRef.current) {
          return Promise.reject(error);
        }

        if (status === 401) {
          setTitle("Session Expired");
          setLogoutMessage("Your session has expired. Please log in again.");
          setIsOpen(true);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated]);

  const handleConfirm = () => {
    // Call onLogout prop if provided
    if (onLogout) {
      onLogout();
    }

    // Clear all auth data
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("userData");

    // Clear login attempts if any
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockUntil');

    forceLogoutRef.current = false;
    setIsOpen(false);

    // Navigate to login page
    navigate(PATHROUTES.login, { replace: true });
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // If modal is not open but token is expired, force logout
  useEffect(() => {
    if (!isOpen && isAuthenticated) {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          // If token is expired but modal is not showing for some reason
          if (decoded.exp < currentTime) {
            handleConfirm();
          }
        } catch {
          handleConfirm();
        }
      }
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen || !isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop - NO onClick handler to prevent closing */}
      <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity duration-300" />
      
      {/* Modal - with higher z-index and no backdrop click closing */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 z-10 transition-colors duration-300">
        <div className="text-center">
          {/* Modal Icon */}
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m12-6a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Modal Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{logoutMessage}</p>

          {/* OK Button - only way to close */}
          <div className="flex justify-center">
            <button
              onClick={handleConfirm}
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-2 px-5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              autoFocus
            >
              OK
            </button>
          </div>

          {/* Additional message */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            You must click OK to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;