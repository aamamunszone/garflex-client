import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MdHome, MdArrowBack, MdRefresh, MdLockOutline } from 'react-icons/md';

const Unauthorized = () => {
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
          {/* Background 403 Text */}
          <h1 className="text-[150px] md:text-[200px] font-black text-slate-500/10 leading-none select-none">
            403
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-slate-500/10 p-6 rounded-full border-2 border-dashed border-slate-500/20">
              {/* Lock Icon with Shake Animation */}
              <motion.div
                animate={{ x: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <MdLockOutline className="text-7xl md:text-9xl text-slate-600" />
              </motion.div>
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
          <h2 className="text-3xl md:text-5xl font-black text-base-content uppercase tracking-tight">
            Access Denied
          </h2>
          <p className="text-base-content/60 max-w-md mx-auto font-medium">
            You don't have permission to view this page. Please contact your
            administrator if you believe this is a mistake.
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
            className="btn btn-outline border-slate-300 hover:bg-slate-100 text-slate-700 rounded-2xl px-6 group"
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
            className="btn bg-slate-800 hover:bg-slate-900 text-white border-none rounded-2xl px-8 shadow-lg shadow-slate-900/20"
          >
            <MdHome className="text-xl" />
            Go Home
          </button>
        </motion.div>

        {/* Status Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200"
        >
          <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Security Status: Restricted Area
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default Unauthorized;
