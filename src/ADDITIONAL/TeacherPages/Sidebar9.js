import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import { LayoutDashboard, Book, FileText, GraduationCap, LibraryBig, LogOut, Menu } from "lucide-react";
import Logo from './assets/Logo.png';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: "/Grade9/Dashboard9" },
    { icon: Book, label: 'Notes', route: "/Grade9/Notes9" },
    { icon: FileText, label: 'Homework', route: "/Grade9/Homework9" },
    { icon: GraduationCap, label: 'Marks', route: "/Grade9/Marks9" },
    { icon: LibraryBig, label: 'Other', route: "/other" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing user session)
    console.log('Logout clicked');
    
    // Redirect to the welcome page
    navigate('/'); // Adjust the route according to your app structure
  };

  const sidebarContent = (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen w-60 flex-col justify-between bg-white shadow-lg"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-2 flex items-center justify-center"
        >
          <img
            src={Logo}
            alt="Bee Academy Logo"
            width={100}
            height={100}
          />
        </motion.div>

        <nav className="mt-14 space-y-8 px-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <button
                className={`w-full flex items-center justify-start px-4 py-2 text-left text-lg font-semibold rounded-lg transition-colors duration-200 ${
                  location.pathname === item.route
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-black hover:text-white'
                }`}
                onClick={() => handleNavigation(item.route)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            </motion.div>
          ))}
        </nav>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4"
      >
        <button
          className="w-full flex items-center justify-start px-4 py-2 mb-8 text-lg font-semibold text-gray-600 hover:bg-black hover:text-white rounded-lg transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative">
      {/* Hamburger menu for small screens */}
      <button
        className="fixed top-6 left-2 z-50 lg:hidden p-2 rounded-md bg-white shadow-md"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {/* Sidebar for large screens */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Responsive sidebar for small screens */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              {sidebarContent}
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
