import React from 'react';
import { Link } from 'react-router';

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-base-300 bg-base-100/50 backdrop-blur-sm shrink-0">
      <div className="px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-base-content/60 text-center md:text-left">
            © {currentYear} GarFlex. All rights reserved.
          </p>

          {/* Footer Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/privacy"
              className="text-base-content/60 hover:text-primary transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <span className="text-base-content/30">•</span>
            <Link
              to="/terms"
              className="text-base-content/60 hover:text-primary transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <span className="text-base-content/30">•</span>
            <Link
              to="/help"
              className="text-base-content/60 hover:text-primary transition-colors duration-300"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
