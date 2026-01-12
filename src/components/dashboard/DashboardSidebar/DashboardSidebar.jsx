import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { HiX } from 'react-icons/hi';
import {
  MdPeople,
  MdInventory,
  MdShoppingCart,
  MdAddCircle,
  MdManageAccounts,
  MdPending,
  MdCheckCircle,
  MdPerson,
  MdLogout,
  MdHome,
} from 'react-icons/md';
import { FiPackage } from 'react-icons/fi';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import toast from 'react-hot-toast';
import { firebaseErrorMessage } from '../../../utils/firebaseErrors';

const DashboardSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, signOutUser } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Successfully logged out! 👋');
      navigate('/');
    } catch (error) {
      const errorMessage = firebaseErrorMessage(error.code);
      toast.error(errorMessage);
    }
  };

  const handleNavClick = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setIsSidebarOpen(false);
    }
  };

  // Role-based menu items
  const adminMenuItems = [
    { path: '/dashboard', label: 'Dashboard Home', icon: MdHome },
    { path: '/dashboard/manage-users', label: 'Manage Users', icon: MdPeople },
    {
      path: '/dashboard/all-products',
      label: 'All Products',
      icon: MdInventory,
    },
    {
      path: '/dashboard/all-orders',
      label: 'All Orders',
      icon: MdShoppingCart,
    },
    { path: '/dashboard/admin-profile', label: 'My Profile', icon: MdPerson },
  ];

  const managerMenuItems = [
    { path: '/dashboard', label: 'Dashboard Home', icon: MdHome },
    { path: '/dashboard/add-product', label: 'Add Product', icon: MdAddCircle },
    {
      path: '/dashboard/manage-products',
      label: 'Manage Products',
      icon: MdManageAccounts,
    },
    {
      path: '/dashboard/pending-orders',
      label: 'Pending Orders',
      icon: MdPending,
    },
    {
      path: '/dashboard/approved-orders',
      label: 'Approved Orders',
      icon: MdCheckCircle,
    },
    { path: '/dashboard/manager-profile', label: 'My Profile', icon: MdPerson },
  ];

  const buyerMenuItems = [
    { path: '/dashboard', label: 'Dashboard Home', icon: MdHome },
    { path: '/dashboard/my-orders', label: 'My Orders', icon: FiPackage },

    { path: '/dashboard/buyer-profile', label: 'My Profile', icon: MdPerson },
  ];

  const getMenuItems = () => {
    switch (role) {
      case 'Admin':
        return adminMenuItems;
      case 'Manager':
        return managerMenuItems;
      case 'Buyer':
        return buyerMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -300,
          // Desktop: Hide sidebar fully if closed, otherwise show it.
          display: isSidebarOpen ? 'flex' : 'none',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-base-100 border-r border-base-300 shadow-xl z-50 flex-col shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-8 shadow-sm border-b border-base-300">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              {/* Logo */}
              <div className="relative w-full h-full bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg">
                <span className="text-2xl font-black bg-linear-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                  G
                </span>
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-linear-to-br from-accent to-secondary rounded-full shadow-lg animate-pulse"></span>
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <h2 className="text-xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                GarFlex
              </h2>
              <span className="text-[9px] font-semibold text-base-content/50 tracking-wider uppercase">
                Dashboard
              </span>
            </div>
          </Link>

          {/* Close Button - Mobile & Desktop Toggle */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-xl text-base-content hover:text-error transition-colors duration-300 hover:bg-error/10 rounded-lg cursor-pointer"
            aria-label="Close Sidebar"
          >
            <HiX />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-4 border-b border-base-300 bg-linear-to-br from-primary/5 to-secondary/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 ring-2 ring-primary/10 shadow-md">
                <img
                  referrerPolicy="no-referrer"
                  src={
                    user?.photoURL ||
                    'https://via.placeholder.com/150/808080/FFFFFF?text=U'
                  }
                  className="w-full h-full object-cover"
                  alt={user?.displayName}
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-base-100 shadow-md"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base-content truncate text-sm">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs font-medium text-primary">
                {role || 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Home Link */}
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-base-content/70 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 group"
          >
            <MdHome className="text-xl shrink-0" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="h-px bg-linear-to-r from-transparent via-base-300 to-transparent my-2"></div>

          {/* Role-based Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Use 'end' prop for exact path matching on Dashboard Home
            const isExactMatch = item.path === '/dashboard';
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={isExactMatch}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-linear-to-r from-primary/20 to-secondary/20 text-primary font-semibold border-l-4 border-primary shadow-inner'
                      : 'text-base-content/70 hover:text-primary hover:bg-primary/10'
                  }`
                }
              >
                <Icon className="text-xl shrink-0" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-base-300 space-y-2 shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-error border border-error/30 hover:border-error hover:bg-error/10 rounded-lg transition-all duration-300 group"
          >
            <MdLogout className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
