import React from 'react';
import { motion } from 'motion/react';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiTailwindcss, SiFirebase } from 'react-icons/si';
import { MdApi, MdSecurity } from 'react-icons/md';
import Container from '../../common/Container/Container';

const IntegrationPartners = () => {
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

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'backOut' },
    },
  };

  const technologies = [
    {
      name: 'MongoDB',
      icon: SiMongodb,
      color: 'text-[#47A248]',
      category: 'Database',
    },
    {
      name: 'Express.js',
      icon: SiExpress,
      color: 'text-base-content',
      category: 'Backend',
    },
    {
      name: 'React',
      icon: SiReact,
      color: 'text-[#61DAFB]',
      category: 'Frontend',
    },
    {
      name: 'Node.js',
      icon: SiNodedotjs,
      color: 'text-[#339933]',
      category: 'Runtime',
    },
    {
      name: 'Tailwind CSS',
      icon: SiTailwindcss,
      color: 'text-[#06B6D4]',
      category: 'Styling',
    },
    {
      name: 'Firebase',
      icon: SiFirebase,
      color: 'text-[#FFCA28]',
      category: 'Auth',
    },
    {
      name: 'REST API',
      icon: MdApi,
      color: 'text-primary',
      category: 'Integration',
    },
    {
      name: 'JWT Auth',
      icon: MdSecurity,
      color: 'text-secondary',
      category: 'Security',
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
          variants={textVariant}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
            Technology
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-base-content mt-4">
            Built With{' '}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Modern Stack
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
          Powered by industry-leading technologies for scalability, security, and performance
        </motion.p>
      </div>

      {/* Technology Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
      >
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            variants={logoVariants}
            className="group relative"
          >
            <div className="relative h-full bg-base-100 border border-base-200 rounded-2xl p-6 hover:border-primary/30 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden">
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative flex flex-col items-center justify-center space-y-3">
                <tech.icon className={`text-5xl ${tech.color} group-hover:scale-110 transition-transform duration-300`} />
                
                {/* Name */}
                <div className="text-center">
                  <p className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">
                    {tech.name}
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    {tech.category}
                  </p>
                </div>
              </div>

              {/* Bottom Indicator */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-primary to-secondary group-hover:w-full transition-all duration-500" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-base-content/60 text-sm">
          Seamless integration with your existing tools and workflows
        </p>
      </motion.div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10" />
    </Container>
  );
};

export default IntegrationPartners;
