import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { MdLogout, MdDashboard, MdPerson } from 'react-icons/md';
import Container from '../../common/Container/Container';
import NavItem from './NavItem/NavItem';
import ThemeToggleButton from '../../ui/ThemeToggleButton/ThemeToggleButton';
import useAuth from '../../../hooks/useAuth';
import Loader from '../../common/Loader/Loader';
import toast from 'react-hot-toast';
import { firebaseErrorMessage } from '../../../utils/firebaseErrors';
import useRole from '../../../hooks/useRole';

const Header = () => {
  const { user, signOutUser, loading } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { role, roleLoading } = useRole();
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading || roleLoading) {
    return <Loader />;
  }

  // Get profile route based on role
  const getProfileRoute = () => {
    if (role === 'Manager') return '/dashboard/manager-profile';
    if (role === 'Buyer') return '/dashboard/buyer-profile';
    return '/dashboard';
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Successfully logged out! 👋');
      setIsDrawerOpen(false);
    } catch (error) {
      const errorMessage = firebaseErrorMessage(error.code);
      toast.error(errorMessage);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/all-products', label: 'All Products' },
    { path: '/services', label: 'Services' },
    { path: '/about-us', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  const privateNavItems = [
    { path: '/', label: 'Home' },
    { path: '/all-products', label: 'All Products' },
    { path: '/services', label: 'Services' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/contact', label: 'Contact' },
  ];

  const navItems = user ? privateNavItems : publicNavItems;

  return (
    <div className="w-full">
      <Container className="bg-base-100/80 backdrop-blur-sm rounded-b-xl md:rounded-xl px-8 py-5 shadow-sm">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Transparent linear Logo Design */}
            <div className="relative w-12 h-12">
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-linear-to-br from-primary via-secondary to-accent rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>

              {/* Main Logo Container */}
              <div className="relative w-full h-full bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-primary/10 group-hover:border-primary/30 transition-all duration-500 shadow-lg">
                {/* G Letter with Modern Typography */}
                <div className="relative flex items-center justify-center">
                  <span className="text-3xl font-black bg-linear-to-br from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-sm">
                    G
                  </span>
                  {/* Flex Indicator Dot */}
                  <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-linear-to-br from-accent to-secondary rounded-full shadow-lg shadow-accent/50 animate-pulse"></span>
                </div>
              </div>

              {/* Corner Accent Lines */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/40 rounded-tl-lg"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-secondary/40 rounded-br-lg"></div>
            </div>

            {/* Brand Text */}
            <div className="flex flex-col -space-y-1">
              <h1 className="text-2xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight">
                GarFlex
              </h1>
              <span className="text-[10px] font-semibold text-base-content/50 tracking-[0.2em] uppercase pl-0.5">
                Garments Tracker
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-3">
            {navItems.map(({ path, label }) => (
              <NavItem key={path} to={path}>
                {label}
              </NavItem>
            ))}
          </ul>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggleButton />

            {user ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  {/* Profile Trigger Button */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 px-3 py-1.5 bg-base-100 border border-base-300 hover:border-primary/30 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                  >
                    {/* Avatar with Status */}
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary/50 transition-colors duration-300">
                        <img
                          referrerPolicy="no-referrer"
                          src={user?.photoURL}
                          className="w-full h-full object-cover"
                          alt={user?.displayName}
                        />
                      </div>
                      {/* Active Status Dot */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-100 shadow-sm"></span>
                    </div>

                    {/* User Details */}
                    <div className="flex flex-col items-start">
                      <p className="text-sm font-semibold text-base-content leading-tight">
                        {user?.displayName}
                      </p>
                      <p className="text-xs font-medium text-primary/80">{role}</p>
                    </div>

                    {/* Dropdown Arrow */}
                    <svg
                      className={`w-4 h-4 text-base-content/50 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 rounded-xl shadow-lg overflow-hidden z-50"
                      >
                        {/* User Info Header */}
                        <div className="px-4 py-3 bg-base-200/50 border-b border-base-300">
                          <p className="text-sm font-semibold text-base-content truncate">
                            {user?.displayName}
                          </p>
                          <p className="text-xs text-base-content/60 truncate">
                            {user?.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1.5">
                          <Link
                            to={getProfileRoute()}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/80 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                          >
                            <MdPerson className="text-lg" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/80 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                          >
                            <MdDashboard className="text-lg" />
                            <span>Dashboard</span>
                          </Link>
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-base-300 py-1.5">
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              handleSignOut();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error/80 hover:text-error hover:bg-error/5 transition-colors duration-200 cursor-pointer"
                          >
                            <MdLogout className="text-lg" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                {/* Login Button - Secondary Style */}
                <Link
                  to="/auth/login"
                  className="px-5 py-2.5 text-sm font-medium text-base-content/80 hover:text-primary bg-base-100 border border-base-300 hover:border-primary/40 rounded-lg transition-all duration-200 hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  Login
                </Link>
                {/* Register Button - Primary Style */}
                <Link
                  to="/auth/register"
                  className="px-5 py-2.5 text-sm font-semibold text-primary-content bg-primary hover:bg-primary/90 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2.5">
            {/* Mobile Avatar (Only show when logged in) */}
            {user && (
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 ring-2 ring-primary/10">
                  <img
                    referrerPolicy="no-referrer"
                    src={user?.photoURL}
                    className="w-full h-full object-cover"
                    alt={user?.displayName}
                  />
                </div>
                {/* Active Status Dot - Mobile */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-100 shadow-md shadow-success/50"></span>
              </div>
            )}

            <button
              onClick={toggleDrawer}
              className="w-11 h-11 flex items-center justify-center text-[26px] text-base-content hover:text-primary transition-colors duration-200 hover:bg-primary/10 rounded-xl"
              aria-label="Toggle Menu"
            >
              {isDrawerOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeDrawer}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 h-screen bg-base-100 shadow-2xl z-50 lg:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-base-300">
                <Link
                  to="/"
                  onClick={closeDrawer}
                  className="flex items-center gap-3"
                >
                  {/* Mobile Logo */}
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 bg-linear-to-br from-primary via-secondary to-accent rounded-xl opacity-10 blur-sm"></div>
                    <div className="relative w-full h-full bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-xl flex items-center justify-center border border-primary/10 shadow-md">
                      <span className="text-2xl font-black bg-linear-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                        G
                      </span>
                      <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-linear-to-br from-accent to-secondary rounded-full shadow-lg shadow-accent/50 animate-pulse"></span>
                    </div>
                  </div>
                  <h1 className="text-lg font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    GarFlex
                  </h1>
                </Link>
                <button
                  onClick={closeDrawer}
                  className="w-9 h-9 flex items-center justify-center text-xl text-base-content hover:text-error transition-colors duration-300 hover:bg-error/10 rounded-lg"
                >
                  <HiX />
                </button>
              </div>

              {/* User Info Section */}
              {user && (
                <div className="p-6 border-b border-base-300 bg-linear-to-br from-primary/5 to-secondary/5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 ring-2 ring-primary/10 shadow-md">
                        <img
                          referrerPolicy="no-referrer"
                          src={user?.photoURL}
                          className="w-full h-full object-cover"
                          alt={user?.displayName}
                        />
                      </div>
                      {/* Active Status - Mobile Drawer */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-base-100 shadow-md shadow-success/50 ring-2 ring-success/30"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base-content truncate">
                        {user?.displayName}
                      </p>
                      <p className="text-sm font-medium text-primary">{role}</p>
                      <p className="text-xs text-base-content/60 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-6">
                <ul className="space-y-2">
                  {navItems.map(({ path, label }) => (
                    <li key={path} onClick={closeDrawer}>
                      <NavItem to={path} className="w-full text-left block">
                        {label}
                      </NavItem>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-base-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-base-content/70">
                    Theme
                  </span>
                  <ThemeToggleButton />
                </div>

                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-medium text-error bg-error/5 border border-error/20 hover:border-error/40 hover:bg-error/10 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    <MdLogout className="text-lg" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="space-y-2.5">
                    {/* Login Button - Secondary */}
                    <Link
                      to="/auth/login"
                      onClick={closeDrawer}
                      className="w-full block text-center px-4 py-3 text-sm font-medium text-base-content/80 bg-base-100 border border-base-300 hover:border-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                    >
                      Login
                    </Link>
                    {/* Register Button - Primary */}
                    <Link
                      to="/auth/register"
                      onClick={closeDrawer}
                      className="w-full block text-center px-4 py-3 text-sm font-semibold text-primary-content bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 shadow-sm"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
