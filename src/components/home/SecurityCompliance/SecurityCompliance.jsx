import React from 'react';
import { motion } from 'motion/react';
import {
  MdVerifiedUser,
  MdSecurity,
  MdCloud,
  MdShield,
} from 'react-icons/md';
import { HiCheckCircle } from 'react-icons/hi';
import Container from '../../common/Container/Container';

const SecurityCompliance = () => {
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'backOut' },
    },
  };

  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      description:
        'All data transmitted between client and server is encrypted using industry-standard SSL/TLS protocols.',
      icon: MdSecurity,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Role-Based Access Control',
      description:
        'Granular permissions ensure users only access data relevant to their role (Admin, Manager, Buyer).',
      icon: MdVerifiedUser,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Cloud Infrastructure',
      description:
        'Hosted on reliable cloud platforms with automated backups and 99.9% uptime SLA.',
      icon: MdCloud,
      color: 'from-emerald-500 to-green-500',
    },
    {
      title: 'JWT Authentication',
      description:
        'Secure token-based authentication protects private routes and prevents unauthorized access.',
      icon: MdShield,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const complianceItems = [
    'GDPR Compliant Data Processing',
    'Regular Security Audits',
    'Data Privacy Protection',
    'SOC 2 Type II Standards',
    'ISO 27001 Alignment',
    'Industry Best Practices',
  ];

  return (
    <Container className="py-10 px-4 relative rounded-xl overflow-hidden bg-base-100">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={textVariant}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
            Trust & Security
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-base-content mt-4">
            Enterprise-Grade{' '}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Security
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
          Your data security and privacy are our top priorities
        </motion.p>
      </div>

      {/* Security Features Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        {securityFeatures.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="relative group"
          >
            <div className="relative h-full bg-base-100 border border-base-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Icon Container */}
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-base-200 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                <feature.icon
                  className="text-3xl text-primary"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom Accent Line */}
              <div
                className={`absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r ${feature.color} group-hover:w-full transition-all duration-500`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Compliance Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-base-200/50 rounded-2xl p-8 border border-base-300"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-base-content mb-2">
            Compliance & Standards
          </h3>
          <p className="text-base-content/60 text-sm">
            Meeting industry standards for data protection and security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complianceItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 bg-base-100 rounded-xl p-3 border border-base-300 hover:border-primary/30 transition-colors"
            >
              <HiCheckCircle className="text-2xl text-primary shrink-0" />
              <span className="text-sm font-medium text-base-content">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
    </Container>
  );
};

export default SecurityCompliance;
