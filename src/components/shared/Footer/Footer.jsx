import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { HiArrowUp } from 'react-icons/hi';
import Container from '../../common/Container/Container';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Footer links data
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Products', path: '/all-products' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { label: 'Help Center', path: '/help' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'FAQs', path: '/faqs' },
    { label: 'Shipping Info', path: '/shipping' },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      url: 'https://facebook.com',
      label: 'Facebook',
      color: 'hover:text-[#1877F2]',
    },
    {
      icon: FaXTwitter,
      url: 'https://twitter.com',
      label: 'Twitter',
      color: 'hover:text-[#000000]',
    },
    {
      icon: FaLinkedinIn,
      url: 'https://linkedin.com',
      label: 'LinkedIn',
      color: 'hover:text-[#0A66C2]',
    },
    {
      icon: FaInstagram,
      url: 'https://instagram.com',
      label: 'Instagram',
      color: 'hover:text-[#E4405F]',
    },
    {
      icon: FaGithub,
      url: 'https://github.com',
      label: 'GitHub',
      color: 'hover:text-base-content',
    },
  ];

  return (
    <div className="relative bg-base-200 border-t border-base-300 mt-20">
      <Container className="py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group mb-6">
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

            {/* Description */}
            <p className="text-sm text-base-content/70 leading-relaxed mb-6">
              Streamline your garment factory operations with our comprehensive
              order and production tracking system. Manage orders, monitor
              production stages, and ensure timely delivery.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg bg-base-300/50 border border-base-300 text-base-content/60 ${social.color} transition-all duration-300 hover:border-current hover:bg-base-200`}
                >
                  <social.icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-linear-to-b from-primary to-secondary rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-linear-to-r from-primary to-secondary rounded-full group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-linear-to-b from-secondary to-accent rounded-full"></span>
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-base-content/70 hover:text-secondary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-linear-to-r from-secondary to-accent rounded-full group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-linear-to-b from-accent to-primary rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-base-content/70 group">
                <MdLocationOn className="text-xl text-primary mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:text-base-content transition-colors duration-300">
                  123 Garment Street, Rangpur, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-base-content/70 group">
                <MdEmail className="text-xl text-secondary group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="mailto:support@garflex.com"
                  className="group-hover:text-base-content transition-colors duration-300"
                >
                  support@garflex.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-base-content/70 group">
                <MdPhone className="text-xl text-accent group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="tel:+8801712345678"
                  className="group-hover:text-base-content transition-colors duration-300"
                >
                  +880 171 234 5678
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-base-content/60 mb-3">
                Subscribe to our newsletter
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-base-300/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                />
                <button className="px-4 py-2 text-sm font-medium text-primary-content bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-base-300 to-transparent mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm text-base-content/60 text-center md:text-left"
          >
            © {currentYear}{' '}
            <span className="font-semibold text-base-content">GarFlex</span>.
            All rights reserved. Developed with ❤️ by{' '}
            <a
              href="https://github.com/aamamunszone"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-secondary transition-colors duration-300"
            >
              Abdullah Al Mamun
            </a>
          </motion.p>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary text-primary-content shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <HiArrowUp className="text-lg group-hover:translate-y-0.5 transition-transform duration-300" />
          </motion.button>
        </div>
      </Container>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-linear-to-tl from-secondary/5 to-transparent rounded-full blur-3xl"></div>
    </div>
  );
};

export default Footer;
