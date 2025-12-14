import React from 'react';
import { motion } from 'motion/react';
import {
  FaClipboardList,
  FaCogs,
  FaClipboardCheck,
  FaShippingFast,
} from 'react-icons/fa';
import Container from '../../common/Container/Container';

const HowItWorks = () => {
  // Animation Variants for Text (Left/Right to Center)
  const textLeftVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const textRightVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
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

  const steps = [
    {
      id: '01',
      title: 'Place Order',
      desc: 'Buyer selects products, customizes quantity, and places the booking request.',
      icon: FaClipboardList,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: '02',
      title: 'Production',
      desc: 'Manager approves order. Cutting, sewing, and finishing processes begin.',
      icon: FaCogs,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: '03',
      title: 'Quality Check',
      desc: 'Strict QC inspections ensure every garment meets industry standards.',
      icon: FaClipboardCheck,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: '04',
      title: 'Delivery',
      desc: 'Packaged goods are handed over to logistics with real-time tracking.',
      icon: FaShippingFast,
      color: 'from-emerald-500 to-green-500',
    },
  ];

  return (
    <Container className="py-10 overflow-hidden rounded-xl bg-base-100">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={textLeftVariant}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
            Workflow
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-base-content mt-4">
            How It{' '}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Works
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
          Our streamlined process ensures transparency and efficiency from order
          placement to final delivery.
        </motion.p>
      </div>

      {/* Steps Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative px-4"
      >
        {/* Connector Line (Desktop Only) */}
        <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-linear-to-r from-base-300 via-primary/30 to-base-300 border-t-2 border-dashed border-base-300 -z-10"></div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group relative"
          >
            {/* Card Container */}
            <div className="relative h-full bg-base-100 border border-base-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
              {/* Shine Effect Overlay */}
              <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12 z-20 pointer-events-none"></div>

              {/* linear Background Glow on Hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              {/* Step Number Badge */}
              <div className="absolute top-4 right-4 text-4xl font-black text-base-content/5 group-hover:text-primary/10 transition-colors duration-300">
                {step.id}
              </div>

              {/* Icon Container */}
              <div className="relative mb-6 inline-block">
                <div
                  className={`w-20 h-20 rounded-2xl bg-linear-to-br ${step.color} p-0.5 shadow-lg group-hover:rotate-6 transition-transform duration-300`}
                >
                  <div className="w-full h-full bg-base-100 rounded-2xl flex items-center justify-center group-hover:bg-opacity-90 transition-all">
                    <step.icon
                      className={`text-3xl bg-linear-to-br ${step.color} bg-clip-text text-transparent`}
                    />
                  </div>
                </div>
                {/* Pulsing Ring */}
                <div
                  className={`absolute -inset-2 bg-linear-to-br ${step.color} rounded-2xl opacity-20 blur-lg group-hover:opacity-40 animate-pulse`}
                ></div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-base-content/60 text-sm leading-relaxed">
                {step.desc}
              </p>

              {/* Bottom Border Animation */}
              <div
                className={`absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r ${step.color} group-hover:w-full transition-all duration-500`}
              ></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative Background Elements (Consistent with Hero) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    </Container>
  );
};

export default HowItWorks;
