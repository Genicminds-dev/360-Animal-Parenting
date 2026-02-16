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
    { id: 'system', label: 'System Settings', roles: ['user','admin'] },
  ];

  // Filter tabs based on user role
  const visibleTabs = tabs.filter(tab => tab.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tab Navigation - Horizontal Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area - Renders selected component */}
      <div className="bg-white rounded-xl shadow-sm p-6">
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