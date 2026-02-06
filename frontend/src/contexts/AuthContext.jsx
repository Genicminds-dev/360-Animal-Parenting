import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('animal_procurement_user');
    const storedToken = localStorage.getItem('animal_procurement_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call - In real app, replace with actual API
    const users = [
      { 
        id: 1, 
        email: 'admin@360animal.com', 
        password: 'admin123', 
        role: 'admin', 
        name: 'Admin User',
        avatar: 'A'
      },
      { 
        id: 2, 
        email: 'procurement@360animal.com', 
        password: 'procurement123', 
        role: 'procurement_officer', 
        name: 'Procurement Officer',
        avatar: 'P'
      },
      { 
        id: 3, 
        email: 'vet@360animal.com', 
        password: 'vet123', 
        role: 'veterinary', 
        name: 'Dr. Veterinary',
        avatar: 'V'
      }
    ];

    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
        avatar: foundUser.avatar
      };
      
      setUser(userData);
      localStorage.setItem('animal_procurement_user', JSON.stringify(userData));
      localStorage.setItem('animal_procurement_token', 'fake-jwt-token-' + Date.now());
      
      // Navigate to dashboard
      navigate('/dashboard');
      
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('animal_procurement_user');
    localStorage.removeItem('animal_procurement_token');
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};