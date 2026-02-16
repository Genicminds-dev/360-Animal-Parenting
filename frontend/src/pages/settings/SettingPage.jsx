// src/components/settings/SettingsPage.jsx
import React, { useState } from 'react';
import MyProfile from './MyProfile';
import PasswordSettings from './PasswordSettings';
import SystemSettings from './SystemSettings';

const SettingsPage = ({ userRole = 'user', onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'My Profile', roles: ['user', 'admin'] },
    { id: 'password', label: 'Password', roles: ['user', 'admin'] },
    { id: 'system', label: 'System Settings', roles: ['user', 'admin'] },
  ];

  // Filter tabs based on user role
  const visibleTabs = tabs.filter(tab => tab.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      {/* Header with Dark Mode Toggle */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6 transition-colors duration-300">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
        {activeTab === 'profile' && (
          <MyProfile 
            userRole={userRole} 
            onLogout={onLogout}
          />
        )}
        {activeTab === 'password' && (
          <PasswordSettings 
            onLogout={onLogout}
          />
        )}
        {activeTab === 'system' && (
          <SystemSettings userRole={userRole} />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;