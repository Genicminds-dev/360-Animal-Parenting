import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, User, LogOut, Settings, HelpCircle, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Convert numeric role ID to display name
  const getRoleDisplayName = (roleId) => {
    switch (roleId) {
      case 1: return 'Administrator';
      case 2: return 'Procurement Officer';
      case 3: return 'Veterinary Officer';
      default: return 'User';
    }
  };

  // Get user's numeric role ID
  const userRoleId = user?.role || 2;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Menu Toggle & Search */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            {/* Menu Toggle */}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg hover:bg-gray-100 ${
                sidebarOpen ? 'lg:hidden' : 'lg:hidden'
              }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {/* Logo for mobile */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">360</span>
              </div>
              <span className="font-bold text-gray-900 text-sm hidden xs:inline">Animal Parenting</span>
            </div>

            {/* Search Bar - Desktop */}
            <div className={`hidden md:block relative flex-1 max-w-md`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search animals, farmers, reports..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full text-sm"
              />
            </div>
          </div>

          {/* Right Section: Notifications & User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            {/* Divider - Hide on very small screens */}
            <div className="h-6 sm:h-8 w-px bg-gray-300 hidden sm:block"></div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-lg hover:bg-gray-100"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-[150px]">
                    {user?.email || 'user@example.com'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getRoleDisplayName(userRoleId)}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base">
                  {user?.avatar || 'U'}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                      {user?.email || 'user@example.com'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getRoleDisplayName(userRoleId)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      User ID: {user?.id || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="mr-3 flex-shrink-0" size={16} />
                      <span className="truncate">My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="mr-3 flex-shrink-0" size={16} />
                      <span className="truncate">Settings</span>
                    </Link>
                    <Link
                      to="/help"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HelpCircle className="mr-3 flex-shrink-0" size={16} />
                      <span className="truncate">Help & Support</span>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 flex-shrink-0" size={16} />
                      <span className="truncate">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Toggleable */}
        {showMobileSearch && (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search animals, farmers, reports..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full text-sm"
                autoFocus
              />
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Close user menu when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;