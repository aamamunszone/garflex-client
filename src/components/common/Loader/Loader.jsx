import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-16 md:w-17 lg:w-18 h-16 md:h-17 lg:h-18">
        <div className="absolute w-full h-full rounded-full border-3 md:border-4 lg:border-5 border-primary"></div>
        <div className="absolute w-full h-full rounded-full border-t-3 md:border-t-4 lg:border-t-5 border-secondary animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
