// src/components/settings/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSettings, FiShield, FiUsers, FiDatabase, 
  FiSave, FiRefreshCw, FiGlobe, FiMoon, FiSun,
  FiMonitor, FiCheckCircle
} from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext'; // Import the hook

const SystemSettings = ({ userRole }) => { // Remove darkMode prop
  const { darkMode, theme, updateTheme } = useTheme(); // Use theme context
  
  const [systemConfig, setSystemConfig] = useState({
    siteName: 'My Application',
    siteUrl: 'https://myapp.com',
    maintenanceMode: false,
    userRegistration: true,
    defaultUserRole: 'user',
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    twoFactorAuth: false,
    backupFrequency: 'daily',
    logLevel: 'info',
    emailNotifications: true,
    apiRateLimit: '1000',
    cacheDuration: '3600',
    theme: theme // Initialize with current theme from context
  });

  const [loading, setLoading] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(darkMode ? 'dark' : 'light');

  // Sync with context when component mounts or theme changes externally
  useEffect(() => {
    setSystemConfig(prev => ({ ...prev, theme }));
  }, [theme]);

  // Apply theme preview when selecting
  useEffect(() => {
    if (systemConfig.theme === 'light') {
      setPreviewTheme('light');
    } else if (systemConfig.theme === 'dark') {
      setPreviewTheme('dark');
    } else if (systemConfig.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setPreviewTheme(prefersDark ? 'dark' : 'light');
    }
  }, [systemConfig.theme]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Apply theme setting globally using context
    updateTheme(systemConfig.theme);
    
    // Here you would also save other settings to your backend
    // For now, we'll simulate an API call
    setTimeout(() => {
      toast.success('System settings saved successfully!');
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset system settings? This action cannot be undone.')) {
      // Reset to defaults
      setSystemConfig({
        siteName: 'My Application',
        siteUrl: 'https://myapp.com',
        maintenanceMode: false,
        userRegistration: true,
        defaultUserRole: 'user',
        sessionTimeout: '30',
        maxLoginAttempts: '5',
        twoFactorAuth: false,
        backupFrequency: 'daily',
        logLevel: 'info',
        emailNotifications: true,
        apiRateLimit: '1000',
        cacheDuration: '3600',
        theme: 'light'
      });
      updateTheme('light'); // Reset theme to light
      toast.success('System reset initiated');
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-2">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: darkMode ? '#374151' : '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#0284c7',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl">
            <FiSettings className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">System Settings</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your application preferences</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiGlobe className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">General Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={systemConfig.siteName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  name="siteUrl"
                  value={systemConfig.siteUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>
          </motion.section>

          {/* Security Settings */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiShield className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Security Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={systemConfig.sessionTimeout}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={systemConfig.maxLoginAttempts}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={systemConfig.maintenanceMode}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Enable Maintenance Mode
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="twoFactorAuth"
                  checked={systemConfig.twoFactorAuth}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Require Two-Factor Authentication
                </span>
              </label>
            </div>
          </motion.section>

          {/* User Management */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiUsers className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User Management</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default User Role
                </label>
                <select
                  name="defaultUserRole"
                  value={systemConfig.defaultUserRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="userRegistration"
                  checked={systemConfig.userRegistration}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Allow User Registration
                </span>
              </label>
            </div>
          </motion.section>

          {/* Backup & Maintenance */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiDatabase className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Backup & Maintenance</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Backup Frequency
                </label>
                <select
                  name="backupFrequency"
                  value={systemConfig.backupFrequency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Log Level
                </label>
                <select
                  name="logLevel"
                  value={systemConfig.logLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </motion.section>
          
          {/* Dark Mode Settings Section - Enhanced with gradient background */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <FiMoon className="text-primary-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Appearance & Theme</h3>
              </div>
              {/* Live Preview Badge */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Live Preview:</span>
                <div className={`w-4 h-4 rounded-full ${previewTheme === 'light' ? 'bg-yellow-400' : 'bg-indigo-900'}`} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 capitalize">{previewTheme} Mode</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Light Mode Option */}
              <label className={`
                relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300
                ${systemConfig.theme === 'light' 
                  ? 'border-primary-500 bg-white shadow-lg scale-105' 
                  : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-primary-300 dark:hover:border-primary-700'
                }
              `}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={systemConfig.theme === 'light'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full transition-colors ${
                    systemConfig.theme === 'light' 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    <FiSun size={28} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Light Mode</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bright and clean interface</p>
                  </div>
                  {systemConfig.theme === 'light' && (
                    <FiCheckCircle className="absolute top-2 right-2 text-primary-500" size={20} />
                  )}
                </div>
              </label>

              {/* Dark Mode Option */}
              <label className={`
                relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300
                ${systemConfig.theme === 'dark' 
                  ? 'border-primary-500 bg-gray-800 shadow-lg scale-105' 
                  : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-primary-300 dark:hover:border-primary-700'
                }
              `}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={systemConfig.theme === 'dark'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full transition-colors ${
                    systemConfig.theme === 'dark' 
                      ? 'bg-primary-900 text-primary-300' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    <FiMoon size={28} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Dark Mode</h4>
                    <p className="text-xs text-gray-400 mt-1">Easy on the eyes at night</p>
                  </div>
                  {systemConfig.theme === 'dark' && (
                    <FiCheckCircle className="absolute top-2 right-2 text-primary-500" size={20} />
                  )}
                </div>
              </label>

              {/* System Default Option */}
              <label className={`
                relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300
                ${systemConfig.theme === 'system' 
                  ? 'border-primary-500 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg scale-105' 
                  : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-primary-300 dark:hover:border-primary-700'
                }
              `}>
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={systemConfig.theme === 'system'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full transition-colors ${
                    systemConfig.theme === 'system' 
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    <FiMonitor size={28} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">System Default</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Follows your OS preference</p>
                  </div>
                  {systemConfig.theme === 'system' && (
                    <FiCheckCircle className="absolute top-2 right-2 text-primary-500" size={20} />
                  )}
                </div>
              </label>
            </div>

            {/* Theme Preview Card */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Preview:</p>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg ${previewTheme === 'light' ? 'bg-primary-500' : 'bg-primary-600'}`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-3 w-3/4 rounded ${previewTheme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`} />
                  <div className={`h-3 w-1/2 rounded ${previewTheme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`} />
                  <div className={`h-3 w-2/3 rounded ${previewTheme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`} />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  previewTheme === 'light' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-primary-900 text-primary-300'
                }`}>
                  {previewTheme === 'light' ? 'Light' : 'Dark'} Preview
                </div>
              </div>
            </div>
          </motion.section>

          {/* Action Buttons */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FiRefreshCw /> Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-gradient-to-tr from-primary-700 to-primary-500 text-white flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemSettings;