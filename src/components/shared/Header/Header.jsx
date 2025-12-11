import React, { useState } from 'react';
import Container from '../../common/Container/Container';
import { Link } from 'react-router';
import Logo from '../../../assets/images/logo.png';
import NavItem from './NavItem/NavItem';
import ThemeToggleButton from '../../ui/ThemeToggleButton/ThemeToggleButton';
import useAuth from '../../../hooks/useAuth';
import Loader from '../../common/Loader/Loader';
import toast from 'react-hot-toast';
import { firebaseErrorMessage } from '../../../utils/firebaseErrors';
import { AnimatePresence, motion } from 'motion/react';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdLogout } from 'react-icons/md';

const Header = () => {
  const { user, signOutUser, loading } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (loading) {
    return <Loader />;
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setIsDrawerOpen(false);
      toast.success('Successfully logged out! 👋');
    } catch (error) {
      const errorMessage = firebaseErrorMessage(error.code);
      // console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Navigation items based on authentication
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
  ];

  const navItems = user ? privateNavItems : publicNavItems;

  return (
    <>
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Side - Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 p-1.5 rounded-full overflow-hidden bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
                  GF
                </div>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                GarFlex
              </h1>
            </Link>
          </div>

          {/* Middle Side - Desktop Navigation */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map(({ path, label }) => (
                <NavItem key={path} to={path}>
                  {label}
                </NavItem>
              ))}
            </ul>
          </div>

          {/* Right Side - CTA Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggleButton />

            {user ? (
              <div className="hidden lg:flex items-center gap-3">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        referrerPolicy="no-referrer"
                        src={
                          user?.photoURL || 'https://via.placeholder.com/150'
                        }
                        alt={user?.displayName || 'User'}
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300"
                  >
                    <li className="menu-title">
                      <span className="text-sm font-semibold">
                        {user?.displayName || 'User'}
                      </span>
                    </li>
                    <li>
                      <Link to="/dashboard/profile" className="justify-between">
                        Profile
                        <span className="badge badge-primary badge-sm">
                          New
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <button onClick={handleSignOut} className="text-error">
                        <MdLogout className="text-lg" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  to="/auth/login"
                  className="btn btn-ghost btn-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="btn btn-primary btn-sm text-white"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleDrawer}
              className="lg:hidden btn btn-ghost btn-circle text-2xl"
              aria-label="Toggle Menu"
            >
              {isDrawerOpen ? <HiX /> : <HiMenu />}
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeDrawer}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-base-100 shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-base-300">
                <Link
                  to="/"
                  onClick={closeDrawer}
                  className="flex items-center gap-2"
                >
                  <div className="w-10 h-10 p-1.5 rounded-full overflow-hidden bg-primary/10">
                    <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      GF
                    </div>
                  </div>
                  <h1 className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    GarFlex
                  </h1>
                </Link>
                <button
                  onClick={closeDrawer}
                  className="btn btn-ghost btn-circle text-2xl"
                  aria-label="Close Menu"
                >
                  <HiX />
                </button>
              </div>

              {/* User Profile Section (Mobile) */}
              {user && (
                <div className="p-6 bg-base-200 border-b border-base-300">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-200">
                        <img
                          referrerPolicy="no-referrer"
                          src={
                            user?.photoURL || 'https://via.placeholder.com/150'
                          }
                          alt={user?.displayName || 'User'}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user?.displayName || 'User'}
                      </h3>
                      <p className="text-sm text-base-content/60">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="p-6">
                <ul className="menu menu-lg gap-2">
                  {navItems.map(({ path, label }) => (
                    <NavItem
                      key={path}
                      to={path}
                      onClick={closeDrawer}
                      className="w-full"
                    >
                      {label}
                    </NavItem>
                  ))}
                </ul>
              </div>

              {/* Auth Buttons (Mobile) */}
              <div className="p-6 border-t border-base-300">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/dashboard/profile"
                      onClick={closeDrawer}
                      className="btn btn-ghost w-full justify-start"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="btn btn-error btn-outline w-full"
                    >
                      <MdLogout className="text-xl" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/auth/login"
                      onClick={closeDrawer}
                      className="btn btn-ghost w-full"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={closeDrawer}
                      className="btn btn-primary w-full text-white"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer Info */}
              <div className="p-6 text-center text-sm text-base-content/60">
                <p>© 2025 GarFlex. All rights reserved.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
