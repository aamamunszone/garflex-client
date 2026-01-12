import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { HiArrowRight } from 'react-icons/hi';
import Container from '../../common/Container/Container';

const CallToAction = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'backOut' },
    },
  };

  return (
    <Container className="py-10 px-4 relative rounded-xl overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl border border-primary/20 shadow-2xl overflow-hidden"
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-secondary/5 to-accent/5 animate-pulse" />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 py-16 md:py-20 text-center space-y-8">
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-base-100 border border-primary/30 rounded-full text-sm font-medium text-primary shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Start Your Journey Today
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-base-content leading-tight">
              Ready to Transform Your{' '}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Production Workflow?
              </span>
            </h2>
            <p className="text-base md:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of manufacturers already streamlining their garment
              production with GarFlex. Get started in minutes.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth/register"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Get Started Free</span>
              <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              to="/all-products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-base-100 border-2 border-primary/30 hover:border-primary text-base-content font-semibold rounded-xl hover:bg-primary/5 transition-all duration-300 shadow-md"
            >
              View Products
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-base-content/60"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Setup in minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      </motion.div>
    </Container>
  );
};

export default CallToAction;
