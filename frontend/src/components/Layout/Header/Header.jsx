import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, User, LogOut, Settings, HelpCircle, X } from 'lucide-react';
import { FiMoon, FiSun} from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext'; // Optional: if you want to add theme toggle in header
import api, { baseURLFile } from '../../../services/api/api';
import { Endpoints } from '../../../services/api/EndPoint';
import { PATHROUTES } from '../../../routes/pathRoutes';
import { getId } from '../../../utils/TokenDecode/TokenDecode';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout: contextLogout } = useAuth();
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
  const { darkMode, updateTheme } = useTheme(); // Optional: for theme toggle

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
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      contextLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  // Optional: Theme toggle function
  const toggleTheme = () => {
    updateTheme(darkMode ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Menu Toggle & Search */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            {/* Menu Toggle */}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                sidebarOpen ? 'lg:hidden' : 'lg:hidden'
              }`}
            >
              {sidebarOpen ? 
                <X size={20} className="text-gray-700 dark:text-gray-300" /> : 
                <Menu size={20} className="text-gray-700 dark:text-gray-300" />
              }
            </button>

            {/* Search Bar - Desktop */}
            <div className={`hidden md:block relative flex-1 max-w-md`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="search"
                placeholder="Search animals, farmers, reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
              />
            </div>
          </div>

          {/* Right Section: Notifications & User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Optional: Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FiSun size={20} className="text-yellow-500 dark:text-yellow-400" />
              ) : (
                <FiMoon size={20} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search size={20} className="text-gray-700 dark:text-gray-300" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            {/* Divider - Hide on very small screens */}
            <div className="h-6 sm:h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={loggingOut}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-[150px]">
                    {loading ? 'Loading...' : getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {loading ? '' : getRoleDisplay()}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base overflow-hidden">
                  {getProfileImage() ? (
                    <img 
                      src={getProfileImage()} 
                      alt={getDisplayName()}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = getInitials();
                      }}
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
              </button>

              {/* User Menu Dropdown - Uncomment if needed */}
              {/* <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <Link to={PATHROUTES.profile} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <Link to={PATHROUTES.settings} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
                <Link to={PATHROUTES.help} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HelpCircle size={16} className="mr-2" />
                  Help
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} className="mr-2" />
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Toggleable */}
        {showMobileSearch && (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="search"
                placeholder="Search animals, farmers, reports..."
                className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-sm bg-gray-50/50 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                autoFocus
              />
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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