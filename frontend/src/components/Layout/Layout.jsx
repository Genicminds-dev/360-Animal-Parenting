import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';

// Logout Modal Component
const LogoutModal = ({ isOpen, onClose, onConfirm, loggingOut }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            disabled={loggingOut}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
  mainRef.current?.scrollTo({
    top: 0,
    behavior: "instant"
  });
}, [location.pathname]);

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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
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
          onLogoutClick={handleLogoutClick}
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
        <main
          ref={mainRef}
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900"
        > 
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

      {/* Logout Confirmation Modal - Rendered at main layout level */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        loggingOut={loggingOut}
      />
    </div>
  );
};

export default Layout;


// import React, { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar/Sidebar';
// import Header from './Header/Header';

// const Layout = ({ onLogout }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Detect screen size for responsive behavior
//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 1024); // lg breakpoint
//     };

//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);

//     return () => {
//       window.removeEventListener('resize', checkIfMobile);
//     };
//   }, []);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const closeSidebar = () => {
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex overflow-hidden">
//       {/* Sidebar - Fixed and non-scrollable */}
//       <div 
//         className={`
//           fixed lg:fixed z-40
//           transform transition-transform duration-300 ease-in-out
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//           lg:translate-x-0
//           w-full sm:w-64 h-screen
//         `}
//       >
//         <Sidebar 
//           toggleSidebar={toggleSidebar} 
//           onLogout={onLogout}
//           isMobile={isMobile}
//         />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && isMobile && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//           onClick={closeSidebar}
//         />
//       )}

//       {/* Main Content Area - Scrollable */}
//       <div className={`
//         flex-1 flex flex-col min-w-0 h-screen
//         lg:pl-64 transition-all duration-300
//         ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}
//       `}>
//         {/* Header - Fixed at top */}
//         <div className="sticky top-0 z-30 flex-shrink-0">
//           <Header 
//             toggleSidebar={toggleSidebar} 
//             sidebarOpen={sidebarOpen}
//           />
//         </div>
        
//         {/* Main Content - Scrollable */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
//           <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//             <div className="max-w-full lg:max-w-7xl mx-auto">
//               <Outlet />
//             </div>
//           </div>
          
//           {/* Optional Footer */}
//           <footer className="mt-auto py-4 px-6 border-t border-gray-200">
//             <div className="text-center text-sm text-gray-500">
//               <p>© {new Date().getFullYear()} 360 Animal Parenting System. All rights reserved.</p>
//             </div>
//           </footer>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;