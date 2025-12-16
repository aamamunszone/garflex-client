import React from 'react';
import { Link } from 'react-router';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { MdNotifications, MdSearch } from 'react-icons/md';

import ThemeToggleButton from '../../ui/ThemeToggleButton/ThemeToggleButton';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';

const DashboardHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();
  const { role } = useRole();

  return (
    <header className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-sm border-b border-base-300 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left Side - Menu & Logo/Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button - always visible on small screens */}
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center text-2xl text-base-content hover:text-primary transition-colors duration-300 hover:bg-primary/10 rounded-lg lg:hidden"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>

          {/* Desktop Menu Button - only visible if sidebar is closed */}
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex w-10 h-10 items-center justify-center text-2xl text-base-content hover:text-primary transition-colors duration-300 hover:bg-primary/10 rounded-lg cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              <HiMenuAlt3 />
            </button>
          )}

          {/* Logo/Title - Desktop (Visible only when sidebar is closed on desktop or always on mobile) */}
          {(!isSidebarOpen || window.innerWidth < 1024) && (
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                GarFlex
              </span>
            </Link>
          )}

          {/* Dashboard Title - Desktop (Visible when sidebar is open) */}
          {isSidebarOpen && (
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-base-content">
                {role ? `${role} Dashboard` : 'Dashboard'}
              </h1>
              <p className="text-xs text-base-content/60">
                Welcome back, {user?.displayName || 'User'}
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button/Bar */}
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-base-200 hover:bg-base-300 rounded-lg transition-colors duration-300">
            <MdSearch className="text-lg text-base-content/70" />
            <span className="text-sm text-base-content/70">Search...</span>
          </button>

          {/* Notifications */}
          <button className="relative w-10 h-10 flex items-center justify-center text-xl text-base-content hover:text-primary transition-colors duration-300 hover:bg-primary/10 rounded-lg">
            <MdNotifications />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-base-100"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggleButton />

          {/* User Avatar & Role Badge */}
          <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-linear-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-full cursor-pointer">
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/40 ring-2 ring-primary/10">
                <img
                  referrerPolicy="no-referrer"
                  src={
                    user?.photoURL ||
                    'https://via.placeholder.com/150/808080/FFFFFF?text=U'
                  }
                  className="w-full h-full object-cover"
                  alt={user?.displayName || 'User'}
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-100"></span>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-base-content leading-none">
                {user?.displayName || 'Guest'}
              </p>
              <p className="text-[10px] font-medium text-primary leading-none mt-0.5">
                {role || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
