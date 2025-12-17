import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import DashboardHeader from '../../components/dashboard/DashboardHeader/DashboardHeader';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar/DashboardSidebar';
import DashboardFooter from '../../components/dashboard/DashboardFooter/DashboardFooter';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base-200 transition-colors duration-500">
      {/* Dashboard Sidebar */}
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Dashboard Header */}
        <DashboardHeader
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Dashboard Main Content */}
        <motion.main
          className="flex-1"
          // Animate the content on route change
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.main>

        {/* Dashboard Footer */}
        <DashboardFooter />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
