import React from 'react';
import Container from '../../common/Container/Container';
import { Link } from 'react-router';
import Logo from '../../../assets/images/logo.png';
import NavItem from './NavItem/NavItem';
import ThemeToggleButton from '../../ui/ThemeToggleButton/ThemeToggleButton';

const Header = () => {
  const navItems = [
    { path: '/', label: 'Home', public: true },
    { path: '/all-products', label: 'Al Products', public: true },
    { path: '/about-us', label: 'About Us', public: true },
    { path: '/contact', label: 'Contact', public: true },
    { path: '/dashboard', label: 'Dashboard', private: true },
  ];

  const filteredNavItems = navItems.filter(
    (item) => item.public || item.private //todo: add the user here when they arrive
  );

  return (
    <>
      <Container>
        <nav className="navbar p-0">
          {/* Left Side - (Logo) */}
          <div className="navbar-start">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 p-1.5 rounded-full overflow-hidden">
                <img src={Logo} alt="GarFlex Logo" />
              </div>
              <h1>GarFlex</h1>
            </Link>
          </div>

          {/* Middle Side - (Desktop Nav) */}
          <div className="navbar-center">
            <ul className="menu menu-horizontal gap-4">
              {filteredNavItems.map(({ path, label }) => (
                <NavItem key={path} to={path}>
                  <div>{label}</div>
                </NavItem>
              ))}
            </ul>
          </div>

          {/* Right Side - (CTA Buttons) */}
          <div className="navbar-end gap-3">
            <ThemeToggleButton />
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/register">Get Started</Link>
          </div>
        </nav>
      </Container>
    </>
  );
};

export default Header;
