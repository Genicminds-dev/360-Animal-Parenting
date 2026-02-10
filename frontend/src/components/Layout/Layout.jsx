import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';

const Layout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Fixed and non-scrollable */}
      <div 
        className={`
          fixed lg:fixed z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          w-full sm:w-64 h-screen
        `}
      >
        <Sidebar 
          toggleSidebar={toggleSidebar} 
          onLogout={onLogout}
          isMobile={isMobile}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content Area - Scrollable */}
      <div className={`
        flex-1 flex flex-col min-w-0 h-screen
        lg:pl-64 transition-all duration-300
        ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}
      `}>
        {/* Header - Fixed at top */}
        <div className="sticky top-0 z-30 flex-shrink-0">
          <Header 
            toggleSidebar={toggleSidebar} 
            sidebarOpen={sidebarOpen}
          />
        </div>
        
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-full lg:max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
          
          {/* Optional Footer */}
          <footer className="mt-auto py-4 px-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} 360 Animal Parenting System. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;