import React from 'react';
import { motion } from 'motion/react';
import {
  MdTrackChanges,
  MdVerifiedUser,
  MdAnalytics,
  MdTimeline,
  MdSpeed,
  MdInventory,
} from 'react-icons/md';
import Container from '../../common/Container/Container';

const KeyAdvantages = () => {
  // Animation Variants (Consistent with HowItWorks/Feedback)
  const textLeftVariant = {
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'backOut' },
    },
  };

  const advantages = [
    {
      title: 'Full Production Visibility',
      description:
        'Track every stage: cutting, sewing, finishing, and QC in real-time.',
      icon: MdTimeline,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Optimized Inventory',
      description:
        'Automated stock management ensures you never run out of raw materials or finished goods.',
      icon: MdInventory,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Data-Driven Decisions',
      description:
        'Access detailed analytics and reports to identify bottlenecks and improve efficiency.',
      icon: MdAnalytics,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Secure Role Management',
      description:
        'JWT protected private routes and clearly defined roles for Admin, Manager, and Buyer.',
      icon: MdVerifiedUser,
      color: 'from-emerald-500 to-green-500',
    },
    {
      title: 'Faster Order Cycles',
      description:
        'Streamlined approval and tracking process cuts down order fulfillment time significantly.',
      icon: MdSpeed,
      color: 'from-red-500 to-orange-600',
    },
    {
      title: 'Customized Tracking',
      description:
        'Managers can update tracking with location, notes, and specific production statuses.',
      icon: MdTrackChanges,
      color: 'from-indigo-500 to-sky-500',
    },
  ];

  return (
    <Container className="py-10 px-4 relative rounded-xl overflow-hidden bg-base-100">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={textLeftVariant}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
            Advantages
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-base-content mt-4">
            Why Choose Our{' '}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              System
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
          Maximize efficiency and minimize errors with a platform built for
          modern garment production challenges.
        </motion.p>
      </div>

      {/* Advantages Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {advantages.map((advantage, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="relative group perspective-1000" // Added perspective for 3D effect
          >
            <div
              className="relative h-full bg-base-100 border border-base-200 rounded-2xl p-6 shadow-lg transition-all duration-700 transform-style-preserve-3d 
                group-hover:rotate-y-10 group-hover:shadow-2xl" // 3D Tilt on Hover
            >
              {/* linear Border/Glow on Hover */}
              <div
                className={`absolute inset-0 -m-0.5 rounded-2xl bg-linear-to-br ${advantage.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              {/* Icon Container */}
              <div className="mb-4 inline-block">
                <div
                  className={`w-14 h-14 rounded-xl bg-linear-to-br ${advantage.color} p-0.5 shadow-lg`}
                >
                  <div className="w-full h-full bg-base-100 rounded-xl flex items-center justify-center">
                    <advantage.icon
                      className={`text-2xl bg-linear-to-br ${advantage.color} bg-clip-text text-transparent`}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                {advantage.title}
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed">
                {advantage.description}
              </p>

              {/* Animated Bottom Indicator */}
              <div
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r ${advantage.color} group-hover:w-full transition-all duration-500`}
              ></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative Blobs (Consistent with other sections) */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse delay-500"></div>
    </Container>
  );
};

export default KeyAdvantages;
