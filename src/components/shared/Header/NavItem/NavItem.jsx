import React from 'react';
import { NavLink } from 'react-router';

const NavItem = ({ children, to, className = '' }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `font-medium transition-all duration-300 ease-in-out px-4 py-2 rounded-lg ${
            isActive
              ? 'text-primary bg-primary/10 border-b-2 border-primary'
              : 'text-base-content hover:text-primary hover:bg-primary/5'
          } ${className}`
        }
      >
        {children}
      </NavLink>
    </li>
  );
};

export default NavItem;
