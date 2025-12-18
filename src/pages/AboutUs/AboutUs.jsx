import React from 'react';
import { motion } from 'motion/react';
import {
  MdGroups,
  MdPublic,
  MdAutoGraph,
  MdWorkspacePremium,
  MdOutlineLightbulb,
} from 'react-icons/md';
import { HiArrowRight } from 'react-icons/hi';
import Container from '../../components/common/Container/Container';

const AboutUs = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const values = [
    {
      title: 'Our Heritage',
      icon: <MdGroups />,
      desc: "Starting as a small studio, we've evolved into a tech-driven production powerhouse over two decades.",
      span: 'md:col-span-1',
      bg: 'bg-primary/5',
      accent: 'bg-primary',
    },
    {
      title: 'Digital-First Vision',
      icon: <MdOutlineLightbulb />,
      desc: 'Our mission is to bridge the gap between creative design and industrial manufacturing through AI and automation.',
      span: 'md:col-span-2',
      bg: 'bg-secondary/5',
      accent: 'bg-secondary',
    },
    {
      title: 'Global Sustainability',
      icon: <MdPublic />,
      desc: 'Commitment to 100% ethical sourcing and reducing the carbon footprint of the fashion industry.',
      span: 'md:col-span-2',
      bg: 'bg-accent/5',
      accent: 'bg-accent',
    },
    {
      title: 'Quality Benchmarks',
      icon: <MdWorkspacePremium />,
      desc: 'Setting the gold standard for global export quality and precision.',
      span: 'md:col-span-1',
      bg: 'bg-primary/5',
      accent: 'bg-primary',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-base-200 py-5 md:py-10 lg:py-20 min-h-screen">
      {/* Background Decorative Elements (Matches Services Page) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-40 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>

      <Container>
        {/* --- Header Section (Matches Structure) --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mb-8 md:mb-14 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full text-xs font-bold text-primary uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Our Identity
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-base-content leading-tight mb-6">
            Architecting the <br />
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Future of Fashion
            </span>
          </h1>
          <p className="text-lg text-base-content/60 max-w-2xl font-medium leading-relaxed">
            We are more than just a manufacturer. We are a team of engineers,
            designers, and visionaries dedicated to perfecting the garment
            lifecycle.
          </p>
        </motion.div>

        {/* --- Bento Grid Style Values --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-20 lg:mb-32">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className={`${value.span} ${value.bg} border border-base-300 rounded-[2.5rem] p-10 flex flex-col justify-between group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5`}
            >
              <div className="space-y-6">
                <div
                  className={`w-16 h-16 ${value.accent} text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-primary/20`}
                >
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black text-base-content">
                  {value.title}
                </h3>
                <p className="text-base-content/60 font-medium leading-relaxed italic">
                  "{value.desc}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Asymmetric Story Section --- */}
        <div className="grid lg:grid-cols-2 gap-20 items-center py-8 md:py-14 lg:py-20 border-t border-base-300">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-16 h-1 bg-primary rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-base-content uppercase italic">
              Crafting <br /> Excellence Since <br />{' '}
              <span className="text-primary">2005</span>
            </h2>
            <div className="space-y-6 font-medium text-base-content/70">
              <p>
                Our journey began with a simple belief: manufacturing should be
                transparent. Today, we handle millions of units annually while
                maintaining the artisan touch in every stitch.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <h4 className="text-3xl font-black text-primary">500k+</h4>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-widest">
                    Monthly Output
                  </p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-secondary">25+</h4>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-widest">
                    Global Brands
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Visual Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative bg-linear-to-br from-primary via-secondary to-accent p-1 rounded-[3rem] shadow-2xl"
          >
            <div className="bg-base-100 rounded-[2.8rem] p-8 md:p-12 space-y-8 overflow-hidden relative">
              <MdAutoGraph className="absolute -right-10 -bottom-10 text-[15rem] text-primary/5 rotate-12" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-black italic underline decoration-primary">
                  Our Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-black uppercase opacity-60">
                    <span>Solar Powered Facility</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 w-full bg-base-200 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-primary"
                    />
                  </div>

                  <div className="flex justify-between text-xs font-black uppercase opacity-60">
                    <span>Zero Waste Commitment</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2 w-full bg-base-200 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                      className="h-full bg-secondary"
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <p className="text-sm font-medium leading-relaxed italic">
                    "We don't just follow trends; we set the infrastructure that
                    makes trends possible."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Final CTA Section --- */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          className="mt-8 md:mt-14 lg:mt-20 p-12 md:p-20 bg-base-content rounded-[4rem] text-base-100 text-center relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black italic">
              Be part of our story.
            </h2>
            <p className="max-w-lg mx-auto opacity-60 font-medium">
              Join forces with a manufacturing partner that cares about your
              brand's DNA.
            </p>
            <button className="btn btn-primary rounded-2xl px-10 btn-lg shadow-2xl hover:scale-105 transition-transform border-none">
              Get in Touch <HiArrowRight />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-[100px]"></div>
        </motion.div>
      </Container>
    </div>
  );
};

export default AboutUs;
