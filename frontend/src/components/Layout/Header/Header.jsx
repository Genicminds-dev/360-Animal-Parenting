import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, User, LogOut, Settings, HelpCircle, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api, { baseURLFile } from '../../../services/api/api';
import { Endpoints } from '../../../services/api/EndPoint';
import { PATHROUTES } from '../../../routes/pathRoutes';
import { getId } from '../../../utils/TokenDecode/TokenDecode';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout: contextLogout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    profileImg: null,
    roleName: ''
  });
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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

  // Fetch user profile data when component mounts or user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userId = getId(); // Get user ID from token
        
        if (!userId) return;
        
        const response = await api.get(Endpoints.GET_USER_BY_ID(userId));
        const data = response.data.data;
        
        setUserProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          profileImg: data.profileImg || null,
          roleName: data.Role?.name || ''
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${baseURLFile}${imagePath}`;
  };

  // Get user's display name
  const getDisplayName = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return user?.email || 'User';
  };

  // Get user's role display
  const getRoleDisplay = () => {
    return userProfile.roleName || 'User';
  };

  // Get profile image or fallback
  const getProfileImage = () => {
    if (userProfile.profileImg) {
      return getImageUrl(userProfile.profileImg);
    }
    return null;
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`;
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Handle logout with API call
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      
      // Call logout API
      await api.post(Endpoints.LOGOUT);
      
      // Clear local storage and context
      contextLogout();
      
      // Close user menu
      setShowUserMenu(false);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      contextLogout();
      setShowUserMenu(false);
    } finally {
      setLoggingOut(false);
    }
  };

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
                className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={loggingOut}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-[150px]">
                    {loading ? 'Loading...' : getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {loading ? '' : getRoleDisplay()}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base overflow-hidden">
                  {getProfileImage() ? (
                    <img 
                      src={getProfileImage()} 
                      alt={getDisplayName()}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to={PATHROUTES.settings}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loggingOut ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut size={16} />
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                </>
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
    </header>
  );
};

export default Header;