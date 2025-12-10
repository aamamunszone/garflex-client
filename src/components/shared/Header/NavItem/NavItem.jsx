import React from 'react';
import { NavLink } from 'react-router';

const NavItem = ({ children, to, className = '' }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => `${isActive ? '' : ''} ${className}`}
      >
        {children}
      </NavLink>
    </li>
  );
};

export default NavItem;
