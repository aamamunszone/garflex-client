import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MdHome, MdArrowBack, MdRefresh, MdErrorOutline } from 'react-icons/md';

const NotFound = () => {
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
          <h1 className="text-[150px] md:text-[200px] font-black text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-warning/20 p-6 rounded-full animate-bounce">
              <MdErrorOutline className="text-7xl md:text-9xl text-warning" />
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
            Oops! Page Not Found
          </h2>
          <p className="text-base-content/60 max-w-md mx-auto font-medium">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
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
            className="btn btn-outline btn-primary rounded-2xl px-6 group"
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
            Refresh
          </button>

          {/* Go Home Button */}
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20"
          >
            <MdHome className="text-xl" />
            Back to Home
          </button>
        </motion.div>

        {/* Help Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-sm opacity-40"
        >
          If you think this is a server error, please{' '}
          <span className="underline cursor-pointer hover:text-primary">
            contact support
          </span>
          .
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
