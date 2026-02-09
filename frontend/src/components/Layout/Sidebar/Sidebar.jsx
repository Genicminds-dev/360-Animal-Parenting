import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Truck,
  Settings,
  LogOut,
  UserCircle,
  Calendar,
  Shield,
  FileCheck
} from 'lucide-react';
import { GiCow } from 'react-icons/gi';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    {
      path: '/procurement',
      label: 'Animal Procurement',
      icon: <GiCow size={20} />,
      subItems: [
        { path: '/procurement/Agent-registration', label: 'Agent Registration' },
        { path: '/procurement/seller-registration', label: 'Seller Registration' },
        { path: '/procurement/animal-registration', label: 'Animal Registration' },
        { path: '/procurement/health-check', label: 'Health Check' },
        { path: '/procurement/price-approval', label: 'Price & Approval' },
        { path: '/procurement/payment', label: 'Payment' },
        { path: '/procurement/animal-transfer', label: 'Animal Transfer' },
      ]
    },

    { path: '/management/sellers', label: 'Sellers', icon: <Users size={20} /> },
    
    { path: '/commission-agents', label: 'Commission Agents', icon: <Users size={20} /> },
    { path: '/animals', label: 'Animals', icon: <GiCow size={20} /> },
    { path: '/transporters', label: 'Transporters', icon: <Truck size={20} /> },
    { path: '/suppliers', label: 'Suppliers', icon: <UserCircle size={20} /> },
    { path: '/agents', label: 'Commission Agents', icon: <Shield size={20} /> },
    { path: '/beneficiaries', label: 'Beneficiaries', icon: <Users size={20} /> },
    { path: '/team', label: 'Team Members', icon: <Users size={20} /> },
    { path: '/reports', label: 'Reports', icon: <FileText size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const userRoleNames = {
    admin: 'Administrator',
    procurement_officer: 'Procurement Officer',
    veterinary: 'Veterinary Officer'
  };

  return (
    <div className="w-70 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <GiCow className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">360 Animal</h1>
            <p className="text-sm text-gray-500">Parenting System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : 'text-gray-600'}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>

              {/* Sub items */}
              {item.subItems && item.subItems.map((subItem) => (
                <NavLink
                  key={subItem.path}
                  to={subItem.path}
                  className={({ isActive }) =>
                    `mt-1 ml-10 pl-4 sidebar-item ${isActive ? 'active' : 'text-gray-600'}`
                  }
                >
                  <span className="text-sm">{subItem.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">{userRoleNames[user?.role] || 'User'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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