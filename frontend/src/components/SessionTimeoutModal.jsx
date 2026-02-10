import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../services/api/api";
import { PATHROUTES } from "../routes/pathRoutes";

const SessionTimeoutModal = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Session Expired");
  const [logoutMessage, setLogoutMessage] = useState(
    "Your session has expired. Please log in again."
  );

  const navigate = useNavigate();

  const forceLogoutRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (forceLogoutRef.current) return;

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

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
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

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
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("userData");

    forceLogoutRef.current = false;
    setIsOpen(false);

    
  // Clear login attempts if any
  localStorage.removeItem('loginAttempts');
  localStorage.removeItem('lockUntil');

    navigate(PATHROUTES.login, { replace: true });
  };

  if (!isOpen || !isAuthenticated) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 max-w-md w-full">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="mb-6">{logoutMessage}</p>
          <button
            onClick={handleConfirm}
            className="bg-gradient-to-tr from-[#255c94] to-[#3F8F06] hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
