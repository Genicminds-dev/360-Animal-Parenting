import React, { useState } from 'react';
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

const Sidebar = ({ toggleSidebar, onLogout, isMobile }) => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (path) => {
    setExpandedMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [1, 2, 3] },
    {
      path: '/procurement',
      label: 'Animal Procurement',
      icon: <GiCow size={20} />,
      roles: [1, 2, 3],
      hasSubmenu: true,
      subItems: [
        { path: '/procurement/agent-registration', label: 'Agent Registration', roles: [1, 2] },
        { path: '/procurement/seller-registration', label: 'Seller Registration', roles: [1, 2] },
        { path: '/procurement/animal-registration', label: 'Animal Registration', roles: [1, 2, 3] },
        { path: '/procurement/health-check', label: 'Health Check', roles: [1,2,3]},
        { path: '/procurement/price-approval', label: 'Price & Approval', roles: [1, 2] },
        { path: '/procurement/payment', label: 'Payment', roles: [1] },
        { path: '/procurement/animal-transfer', label: 'Animal Transfer', roles: [1, 2] },
      ]
    },
    { path: '/management/sellers', label: 'Sellers', icon: <Users size={20} />, roles: [1, 2] },
    { path: '/management/commission-agents', label: 'Commission Agents', icon: <Users size={20} />, roles: [1, 2] },
    { path: '/management/animals', label: 'Animals', icon: <GiCow size={20} />, roles: [1, 2, 3] },
    { path: '/transporters', label: 'Transporters', icon: <Truck size={20} />, roles: [1, 2] },
    { path: '/suppliers', label: 'Suppliers', icon: <UserCircle size={20} />, roles: [1, 2] },
    { path: '/beneficiaries', label: 'Beneficiaries', icon: <Users size={20} />, roles: [1] },
    { path: '/team', label: 'Team Members', icon: <Users size={20} />, roles: [1] },
    { path: '/reports', label: 'Reports', icon: <FileText size={20} />, roles: [1, 2] },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} />, roles: [1] },
  ];

  const userRoleId = user?.role || 2;

  const getRoleDisplayName = (roleId) => {
    switch (roleId) {
      case 1: return 'Administrator';
      case 2: return 'Procurement Officer';
      case 3: return 'Veterinary Officer';
      default: return 'User';
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <div className="w-full sm:w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo Section - Fixed at top */}
      <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <GiCow className="text-white text-lg sm:text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">360 Animal</h1>
            <p className="text-xs sm:text-sm text-gray-500 truncate">Parenting System</p>
          </div>
        </div>

        <button 
          onClick={toggleSidebar} 
          className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Section - Scrollable if too many items */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 sm:px-4">
        <div className="space-y-1">
          {navItems
            .filter(item => item.roles.includes(userRoleId))
            .map((item) => (
              <div key={item.path}>
                {item.hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.path)}
                      className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium ${
                        expandedMenus[item.path]
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                              `block mt-1 ml-6 sm:ml-10 pl-3 sm:pl-4 py-2 text-sm rounded-lg truncate ${
                                isActive
                                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                      `flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium truncate ${
                        isActive
                          ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base">
            {user?.avatar || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
              {user?.email || 'user@example.com'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {getRoleDisplayName(userRoleId)}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="p-1 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
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