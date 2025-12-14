import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import { MdInventory, MdTrendingUp, MdSpeed } from 'react-icons/md';
import Container from '../../common/Container/Container';

const HeroBanner = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const features = [
    {
      icon: MdInventory,
      title: 'Real-time Tracking',
      description: 'Monitor every production stage',
    },
    {
      icon: MdTrendingUp,
      title: 'Performance Analytics',
      description: 'Data-driven insights',
    },
    {
      icon: MdSpeed,
      title: 'Fast & Efficient',
      description: 'Streamlined workflows',
    },
  ];

  return (
    <Container className="relative overflow-hidden bg-base-100 rounded-xl px-5 md:px-10 lg:px-20 min-h-[calc(100vh-136px)]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Hero Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-center py-10">
        {/* Left Side - Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              #1 Production Tracker System
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-base-content leading-tight">
              Streamline Your{' '}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Garment Production
              </span>{' '}
              Workflow
            </h1>
            <p className="text-lg md:text-xl text-base-content/70 leading-relaxed max-w-xl">
              Track orders, manage production stages, monitor inventory, and
              ensure timely delivery - all in one powerful platform.
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div variants={itemVariants} className="space-y-2">
            {[
              'Real-time order tracking',
              'Production stage management',
              'Inventory monitoring',
              'Timely delivery alerts',
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <HiCheckCircle className="text-2xl text-primary shrink-0" />
                <span className="text-base-content/80 font-medium">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/all-products"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>View Products</span>
              <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              to="/about-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-base-100 border-2 border-primary/30 hover:border-primary text-base-content font-semibold rounded-xl hover:bg-primary/5 transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-base-300"
          >
            {[
              { value: '500+', label: 'Products' },
              { value: '1000+', label: 'Orders' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-sm text-base-content/60 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Image/Illustration */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Main Image Container */}
          <div className="relative">
            {/* Decorative linear Border */}
            <div className="absolute -inset-4 bg-linear-to-r from-primary via-secondary to-accent rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

            {/* Image/Illustration Placeholder */}
            <div className="relative bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm rounded-3xl border border-primary/20 overflow-hidden shadow-2xl">
              {/* Replace this with your actual image */}
              <div className="aspect-square flex items-center justify-center p-12">
                <div className="relative w-full h-full">
                  {/* Center Icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-48 h-48 bg-linear-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl">
                      <span className="text-8xl font-black text-white">G</span>
                    </div>
                  </motion.div>

                  {/* Floating Cards */}
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const positions = [
                      { top: '10%', left: '5%' },
                      { top: '50%', right: '5%' },
                      { bottom: '10%', left: '10%' },
                    ];

                    return (
                      <motion.div
                        key={index}
                        animate={{
                          y: [0, -15, 0],
                          rotate: [-2, 2, -2],
                        }}
                        transition={{
                          duration: 3 + index,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.5,
                        }}
                        style={positions[index]}
                        className="absolute hidden md:inline-flex"
                      >
                        <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-lg backdrop-blur-sm">
                          <Icon className="text-3xl text-primary mb-2" />
                          <h4 className="text-sm font-bold text-base-content">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-base-content/60">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 bg-[linear-linear(to_right,#00000008_1px,transparent_1px),linear-linear(to_bottom,#00000008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-8 -right-8 w-24 h-24 bg-linear-to-br from-accent to-secondary rounded-2xl shadow-xl opacity-80"
          ></motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute -bottom-8 -left-8 w-32 h-32 bg-linear-to-br from-primary to-accent rounded-full shadow-xl opacity-60"
          ></motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-medium text-base-content/60">
            Scroll to explore
          </span>
          <div className="w-6 h-10 border-2 border-base-content/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1.5 h-1.5 bg-primary rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default HeroBanner;
