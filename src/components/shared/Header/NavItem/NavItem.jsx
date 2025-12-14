import React from 'react';
import { NavLink } from 'react-router';

const NavItem = ({ children, to, className = '' }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
          isActive
            ? 'text-primary bg-primary/10'
            : 'text-base-content/70 hover:text-primary hover:bg-primary/5'
        } ${className}`
      }
    >
      {/* Text */}
      <span className="relative z-10">{children}</span>

      {/* Animated Underline */}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-300 group-hover:w-3/4" />
    </NavLink>
  );
};

export default NavItem;
