import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Login function (required by Login component)
  const login = (email, password, rememberMe) => {
    // This is a placeholder - the actual API call happens in Login component
    // This function just updates the context state
    return { success: true };
  };

  // Login success handler (to be called after successful API response)
  const loginSuccess = (token, userData, rememberMe) => {
    // Add avatar based on email first letter
    const userWithAvatar = {
      ...userData,
      avatar: userData.email?.charAt(0).toUpperCase() || 'U'
    };

    // Store token and user data
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userWithAvatar));
    } else {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userData', JSON.stringify(userWithAvatar));
    }

    setUser(userWithAvatar);
    setIsAuthenticated(true);
    
    return { success: true, user: userWithAvatar, token };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockUntil');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    navigate('/login');
  };

  const checkAuth = () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return !!token;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    loginSuccess,
    logout,
    setIsAuthenticated: setIsAuthenticated,
    setUser: setUser,
    checkAuth,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};