import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  MdHome,
  MdArrowBack,
  MdRefresh,
  MdReportGmailerrorred,
} from 'react-icons/md';

const ServerCrash = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Visual Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Background 500 Text */}
          <h1 className="text-[150px] md:text-[200px] font-black text-error/10 leading-none select-none">
            500
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-error/20 p-6 rounded-full animate-pulse">
              {/* Error Icon */}
              <MdReportGmailerrorred className="text-7xl md:text-9xl text-error" />
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-black text-base-content">
            Internal Server Error
          </h2>
          <p className="text-base-content/60 max-w-md mx-auto font-medium">
            Something went wrong on our end. We are fixing it as fast as we can.
            Please try refreshing the page.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-error rounded-2xl px-6 group"
          >
            <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="btn btn-ghost bg-base-200 hover:bg-base-300 rounded-2xl px-6 group"
          >
            <MdRefresh className="text-xl group-hover:rotate-180 transition-transform duration-500" />
            Refresh Page
          </button>

          {/* Go Home Button */}
          <button
            onClick={() => navigate('/')}
            className="btn btn-error rounded-2xl px-8 shadow-lg shadow-error/20"
          >
            <MdHome className="text-xl" />
            Go Home
          </button>
        </motion.div>

        {/* Simple Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-sm opacity-40 font-bold tracking-widest uppercase"
        >
          Error Code: 500_SYSTEM_ERROR
        </motion.p>
      </div>
    </div>
  );
};

export default ServerCrash;
