import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Truck,
  Settings,
  LogOut,
  UserCircle,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { GiCow } from 'react-icons/gi';
import { useAuth } from '../../../contexts/AuthContext';
import logo from "../../../../public/images/logo.png"
import { PATHROUTES } from '../../../routes/pathRoutes';
import api from '../../../services/api/api';
import { Endpoints } from '../../../services/api/EndPoint';
import { baseURLFile } from '../../../services/api/api';
import { getId } from '../../../utils/TokenDecode/TokenDecode';

const Sidebar = ({ toggleSidebar, onLogout, isMobile, onLogoutClick }) => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    profileImg: null,
    roleName: ''
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const userId = getId();
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
      }
    };

    fetchUserProfile();
  }, [user]);

  const toggleSubmenu = (path) => {
    setExpandedMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

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

  // Get role display name for sidebar
  const getRoleDisplayName = () => {
    if (userProfile.roleName) {
      return userProfile.roleName;
    }
    const roleId = user?.role || 2;
    switch (roleId) {
      case 1: return 'MasterAdmin';
      case 2: return 'SuperAdmin';
      case 3: return 'Admin';
      default: return 'User';
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`;
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Get profile image or fallback
  const getProfileImage = () => {
    if (userProfile.profileImg) {
      return getImageUrl(userProfile.profileImg);
    }
    return null;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [1, 2, 3] },
    // {
    //   path: '/procurement',
    //   label: 'Animal Procurement',
    //   icon: <GiCow size={20} />,
    //   roles: [1, 2, 3],
    //   hasSubmenu: true,
    //   subItems: [
    //     { path: PATHROUTES.agentRegistration, label: 'Agent Registration', roles: [1, 2] },
    //     { path: PATHROUTES.sellerRegistration, label: 'Seller Registration', roles: [1, 2] },
    //     { path: PATHROUTES.animalRegistration, label: 'Animal Registration', roles: [1, 2, 3] },
    //     { path: PATHROUTES.healthCheckupList, label: 'Health Check', roles: [1, 2, 3] },
    //     // { path: '/procurement/health-check', label: 'Health Check', roles: [3]},
    //     { path: '/procurement/price-approval', label: 'Price & Approval', roles: [1, 2] },
    //     { path: '/procurement/payment', label: 'Payment', roles: [1] },
    //     { path: '/procurement/animal-transfer', label: 'Animal Transfer', roles: [1, 2] },
    //   ]
    // },
    // { path: PATHROUTES.sellersList, label: 'Sellers', icon: <Users size={20} />, roles: [1, 2, 3] },
    // { path: PATHROUTES.agentsList, label: 'Commission Agents', icon: <Users size={20} />, roles: [1, 2, 3] },
    // { path: PATHROUTES.animalsList, label: 'Animals', icon: <GiCow size={20} />, roles: [1, 2, 3] },
    // { path: '/transporters', label: 'Transporters', icon: <Truck size={20} />, roles: [1, 2, 3] },
    // { path: '/suppliers', label: 'Suppliers', icon: <UserCircle size={20} />, roles: [1, 2, 3] },
    // { path: '/beneficiaries', label: 'Beneficiaries', icon: <Users size={20} />, roles: [1, 2, 3] },
    // { path: '/team', label: 'Team Members', icon: <Users size={20} />, roles: [1, 2, 3] },
    // { path: '/reports', label: 'Reports', icon: <FileText size={20} />, roles: [1, 2, 3] },
    
    { path: PATHROUTES.animalProcurement, label: 'Animal Registration', icon: <GiCow size={20} />, roles: [1, 2, 3] },
    { path: PATHROUTES.animalProcuredList, label: 'Animal List', icon: <FileText size={20} />, roles: [1, 2, 3] },


    { path: PATHROUTES.userList, label: 'Manage Users', icon: <Users size={20} />, roles: [1, 2, 3] },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} />, roles: [1, 2, 3] },
  ];

  const userRoleId = user?.role || 2;

  const handleNavClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <div className="w-full sm:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen transition-colors duration-300">
      {/* Logo Section - Fixed at top */}
      <div className="p-3 sm:p-2 mt-1 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center w-full sm:justify-start lg:justify-start px-4">
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-12 sm:h-12 md:h-14 lg:h-14 object-contain transition-all duration-300"
          />
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden absolute right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Section - Scrollable if too many items */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 sm:px-4 scrollbar-hide">
        <div className="space-y-1">
          {navItems
            .filter(item => item.roles.includes(userRoleId))
            .map((item) => (
              <div key={item.path}>
                {item.hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.path)}
                      className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-colors ${
                        expandedMenus[item.path]
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {expandedMenus[item.path] ?
                        <ChevronDown size={16} className="flex-shrink-0" /> :
                        <ChevronRight size={16} className="flex-shrink-0" />
                      }
                    </button>

                    {expandedMenus[item.path] &&
                      item.subItems
                        .filter(sub => sub.roles.includes(userRoleId))
                        .map((sub) => (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `block mt-1 ml-6 sm:ml-10 pl-3 sm:pl-4 py-2 text-sm rounded-lg truncate transition-colors ${
                                isActive
                                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500 dark:border-primary-400'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium truncate transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500 dark:border-primary-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                )}
              </div>
            ))}
        </div>
      </nav>

      {/* User Profile & Logout Section - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base">
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

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
              {getDisplayName()}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {getRoleDisplayName()}
            </p>
          </div>

          <button
            onClick={onLogoutClick}
            className="p-1 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex-shrink-0 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   Truck,
//   Settings,
//   LogOut,
//   UserCircle,
//   ChevronDown,
//   ChevronRight,
//   X
// } from 'lucide-react';
// import { GiCow } from 'react-icons/gi';
// import { useAuth } from '../../../contexts/AuthContext';
// import logo from "../../../../public/images/logo.png"
// import { PATHROUTES } from '../../../routes/pathRoutes';

// const Sidebar = ({ toggleSidebar, onLogout, isMobile }) => {
//   const { user } = useAuth();
//   const [expandedMenus, setExpandedMenus] = useState({});

//   const toggleSubmenu = (path) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [path]: !prev[path]
//     }));
//   };

//   const navItems = [
//     { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [1, 2, 3] },
//     // {
//     //   path: '/procurement',
//     //   label: 'Animal Procurement',
//     //   icon: <GiCow size={20} />,
//     //   roles: [1, 2, 3],
//     //   hasSubmenu: true,
//     //   subItems: [
//     //     { path: PATHROUTES.agentRegistration, label: 'Agent Registration', roles: [1, 2] },
//     //     { path: PATHROUTES.sellerRegistration, label: 'Seller Registration', roles: [1, 2] },
//     //     { path: PATHROUTES.animalRegistration, label: 'Animal Registration', roles: [1, 2, 3] },
//     //     { path: PATHROUTES.healthCheckupList, label: 'Health Check', roles: [1, 2, 3] },
//     //     // { path: '/procurement/health-check', label: 'Health Check', roles: [3]},
//     //     { path: '/procurement/price-approval', label: 'Price & Approval', roles: [1, 2] },
//     //     { path: '/procurement/payment', label: 'Payment', roles: [1] },
//     //     { path: '/procurement/animal-transfer', label: 'Animal Transfer', roles: [1, 2] },
//     //   ]
//     // },
//     // { path: PATHROUTES.sellersList, label: 'Sellers', icon: <Users size={20} />, roles: [1, 2, 3] },
//     // { path: PATHROUTES.agentsList, label: 'Commission Agents', icon: <Users size={20} />, roles: [1, 2, 3] },
//     // { path: PATHROUTES.animalsList, label: 'Animals', icon: <GiCow size={20} />, roles: [1, 2, 3] },
//     // { path: '/transporters', label: 'Transporters', icon: <Truck size={20} />, roles: [1, 2, 3] },
//     // { path: '/suppliers', label: 'Suppliers', icon: <UserCircle size={20} />, roles: [1, 2, 3] },
//     // { path: '/beneficiaries', label: 'Beneficiaries', icon: <Users size={20} />, roles: [1, 2, 3] },
//     // { path: '/team', label: 'Team Members', icon: <Users size={20} />, roles: [1, 2, 3] },
//     // { path: '/reports', label: 'Reports', icon: <FileText size={20} />, roles: [1, 2, 3] },


//     {
//       path: '/procurement',
//       label: 'Procurement',
//       icon: <GiCow size={20} />,
//       roles: [1, 2, 3],
//       hasSubmenu: true,
//       subItems: [
//         { path: '/procurement/source-visit', label: 'Source Visit', roles: [1, 2, 3] },
//         { path: '/procurement/animal-registration', label: 'Register Animal', roles: [1, 2, 3] },
//       ]
//     },
    


//     { path: PATHROUTES.userList, label: 'Manage Users', icon: <Settings size={20} />, roles: [1, 2, 3] },
//     { path: '/settings', label: 'Settings', icon: <Settings size={20} />, roles: [1, 2, 3] },

//   ];

//   const userRoleId = user?.role || 2;

//   const getRoleDisplayName = (roleId) => {
//     switch (roleId) {
//       case 1: return 'Administrator';
//       case 2: return 'Procurement Officer';
//       case 3: return 'Veterinary Officer';
//       default: return 'User';
//     }
//   };

//   const handleNavClick = () => {
//     if (isMobile) {
//       toggleSidebar();
//     }
//   };

//   return (
//     <div className="w-full sm:w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
//       {/* Logo Section - Fixed at top */}
//       {/* ---------- Logo Section ---------- */}
//       <div className="p-3 sm:p-2 mt-1 border-b border-gray-200 flex items-center justify-between flex-shrink-0">

//         {/* Logo Only */}
//         <div className="flex items-center w-full sm:justify-start lg:justify-start px-4">
//           <img
//             src={logo}
//             alt="Logo"
//             className="w-auto h-12 sm:h-12 md:h-14 lg:h-14 object-contain transition-all duration-300"/>
//         </div>

//         {/* Mobile Close Button */}
//         <button
//           onClick={toggleSidebar}
//           className="lg:hidden absolute right-4 text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       {/* Navigation Section - Scrollable if too many items */}
//       <nav className="flex-1 overflow-y-auto py-2 px-2 sm:px-4 scrollbar-hide">
//         <div className="space-y-1">
//           {navItems
//             .filter(item => item.roles.includes(userRoleId))
//             .map((item) => (
//               <div key={item.path}>
//                 {item.hasSubmenu ? (
//                   <>
//                     <button
//                       onClick={() => toggleSubmenu(item.path)}
//                       className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium ${expandedMenus[item.path]
//                         ? 'bg-primary-50 text-primary-600'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                         }`}
//                     >
//                       <div className="flex items-center space-x-2 sm:space-x-3">
//                         <span className="flex-shrink-0">{item.icon}</span>
//                         <span className="truncate">{item.label}</span>
//                       </div>
//                       {expandedMenus[item.path] ?
//                         <ChevronDown size={16} className="flex-shrink-0" /> :
//                         <ChevronRight size={16} className="flex-shrink-0" />
//                       }
//                     </button>

//                     {expandedMenus[item.path] &&
//                       item.subItems
//                         .filter(sub => sub.roles.includes(userRoleId))
//                         .map((sub) => (
//                           <NavLink
//                             key={sub.path}
//                             to={sub.path}
//                             onClick={handleNavClick}
//                             className={({ isActive }) =>
//                               `block mt-1 ml-6 sm:ml-10 pl-3 sm:pl-4 py-2 text-sm rounded-lg truncate ${isActive
//                                 ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
//                                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                               }`
//                             }
//                           >
//                             {sub.label}
//                           </NavLink>
//                         ))}
//                   </>
//                 ) : (
//                   <NavLink
//                     to={item.path}
//                     onClick={handleNavClick}
//                     className={({ isActive }) =>
//                       `flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium truncate ${isActive
//                         ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                       }`
//                     }
//                   >
//                     <span className="flex-shrink-0">{item.icon}</span>
//                     <span className="truncate">{item.label}</span>
//                   </NavLink>
//                 )}
//               </div>
//             ))}
//         </div>
//       </nav>

//       {/* User Profile & Logout Section - Fixed at bottom */}
//       <div className="p-4 border-t border-gray-200 flex-shrink-0">
//         <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-gray-50">
//           <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base">
//             {user?.avatar || 'U'}
//           </div>

//           <div className="flex-1 min-w-0">
//             <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
//               {user?.email || 'user@example.com'}
//             </h3>
//             <p className="text-xs sm:text-sm text-gray-500 truncate">
//               {getRoleDisplayName(userRoleId)}
//             </p>
//           </div>

//           <button
//             onClick={onLogout}
//             className="p-1 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
//             title="Logout"
//           >
//             <LogOut size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;