import React from 'react';
import { Outlet } from 'react-router';
import Header from '../../components/shared/Header/Header';
import Footer from '../../components/shared/Footer/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      {/* Header Section */}
      <header className="sticky top-6 my-6 z-50 bg-base-100/95 backdrop-blur-md border-b border-base-300 shadow-sm">
        <Header />
      </header>

      {/* Main Section */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
