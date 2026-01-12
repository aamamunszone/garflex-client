import React from 'react';
import { motion } from 'motion/react';
import {
  MdSpeed,
  MdTrendingUp,
  MdCheckCircle,
  MdAccessTime,
} from 'react-icons/md';
import Container from '../../common/Container/Container';

const PerformanceMetrics = () => {
  // Animation Variants
  const textVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const textRightVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'backOut' },
    },
  };

  const metrics = [
    {
      value: '99.9%',
      label: 'Uptime Guarantee',
      description: 'Industry-leading reliability',
      icon: MdSpeed,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      value: '40%',
      label: 'Faster Processing',
      description: 'vs traditional systems',
      icon: MdTrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      value: '95%',
      label: 'Client Retention',
      description: 'Long-term partnerships',
      icon: MdCheckCircle,
      color: 'from-emerald-500 to-green-500',
    },
    {
      value: '<2hr',
      label: 'Average Response',
      description: 'Dedicated support team',
      icon: MdAccessTime,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <Container className="py-10 px-4 relative rounded-xl overflow-hidden bg-linear-to-br from-base-100 to-base-200/30">
      {/* Section Header */}
      <div className="text-center mb-12 space-y-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={textVariant}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
            Performance
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-base-content mt-4">
            Proven{' '}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Results
            </span>
          </h2>
        </motion.div>

        <motion.p
          variants={textRightVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-base-content/70 max-w-2xl mx-auto text-lg"
        >
          Numbers that speak to our commitment to excellence and reliability
        </motion.p>
      </div>

      {/* Metrics Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="relative group"
          >
            <div className="relative h-full bg-base-100 border border-base-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-base-200 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                <metric.icon
                  className="text-2xl text-primary"
                />
              </div>

              {/* Value */}
              <h3
                className={`text-4xl md:text-5xl font-black bg-linear-to-br ${metric.color} bg-clip-text text-transparent mb-2`}
              >
                {metric.value}
              </h3>

              {/* Label */}
              <p className="text-lg font-semibold text-base-content mb-1">
                {metric.label}
              </p>

              {/* Description */}
              <p className="text-sm text-base-content/60">
                {metric.description}
              </p>

              {/* Bottom Accent Line */}
              <div
                className={`absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r ${metric.color} group-hover:w-full transition-all duration-500`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative Blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
    </Container>
  );
};

export default PerformanceMetrics;
