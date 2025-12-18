import React from 'react';
import { motion } from 'motion/react';
import {
  MdPrecisionManufacturing,
  MdOutlineDesignServices,
  MdLocalShipping,
  MdSecurity,
  MdAnalytics,
  MdAutoMode,
} from 'react-icons/md';
import { HiArrowRight } from 'react-icons/hi';
import Container from '../../components/common/Container/Container';

const Services = () => {
  // Animation Variants based on your Hero style
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const services = [
    {
      title: 'Smart Manufacturing',
      icon: <MdPrecisionManufacturing />,
      desc: 'High-precision production lines ensuring zero defects and maximum scale.',
      span: 'md:col-span-2',
      bg: 'bg-primary/5',
      accent: 'bg-primary',
    },
    {
      title: '3D Design R&D',
      icon: <MdOutlineDesignServices />,
      desc: 'Visualize your collection with cutting-edge 3D prototyping.',
      span: 'md:col-span-1',
      bg: 'bg-secondary/5',
      accent: 'bg-secondary',
    },
    {
      title: 'Global Supply Chain',
      icon: <MdLocalShipping />,
      desc: 'DDP & CIF logistics to reach your warehouses worldwide.',
      span: 'md:col-span-1',
      bg: 'bg-accent/5',
      accent: 'bg-accent',
    },
    {
      title: 'Data Analytics',
      icon: <MdAnalytics />,
      desc: 'Monitor efficiency and output in real-time through our dashboard.',
      span: 'md:col-span-2',
      bg: 'bg-primary/5',
      accent: 'bg-primary',
    },
  ];

  return (
    <>
      <title>GarFlex | Services</title>

      <div className="relative overflow-hidden bg-base-200 py-5 md:py-10 lg:py-20 min-h-screen">
        {/* Background Decorative Elements (Matches your HeroBanner) */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-40 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-40 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] animate-pulse delay-700"></div>
        </div>

        <Container>
          {/* --- Header Section --- */}
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
              Our Ecosystem
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-base-content leading-tight mb-6">
              Everything you need to <br />
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Dominate Modern Fashion
              </span>
            </h1>
            <p className="text-lg text-base-content/60 max-w-2xl font-medium leading-relaxed">
              We've built a full-stack manufacturing system that handles the
              complexity so you can focus on creativity and growth.
            </p>
          </motion.div>

          {/* --- Bento Grid Style Services --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-20 lg:mb-32">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className={`${service.span} ${service.bg} border border-base-300 rounded-[2.5rem] p-10 flex flex-col justify-between group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5`}
              >
                <div className="space-y-6">
                  <div
                    className={`w-16 h-16 ${service.accent} text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-primary/20`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-black text-base-content">
                    {service.title}
                  </h3>
                  <p className="text-base-content/60 font-medium leading-relaxed italic">
                    "{service.desc}"
                  </p>
                </div>
                <div className="mt-10">
                  <button className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                    Explore <HiArrowRight />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- Unique Feature Section (Asymmetric) --- */}
          <div className="grid lg:grid-cols-2 gap-20 items-center py-8 md:py-14 lg:py-20 border-t border-base-300">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-16 h-1 bg-primary rounded-full"></div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight text-base-content uppercase italic">
                Production <br /> Without the <br />{' '}
                <span className="text-primary">Headache</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    t: 'Automated QC',
                    d: 'Machine-learning cameras scanning every stitch.',
                  },
                  {
                    t: 'Sustainable sourcing',
                    d: 'GOTS & Oeko-Tex certified raw materials.',
                  },
                  {
                    t: 'Instant scalability',
                    d: 'Move from 100 to 100,000 units in days.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <MdSecurity className="text-3xl text-primary shrink-0 transition-transform group-hover:rotate-12" />
                    <div>
                      <h4 className="font-black text-lg">{item.t}</h4>
                      <p className="text-sm text-base-content/60">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* This is a unique "floating card" visual area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative bg-linear-to-br from-primary via-secondary to-accent p-1 rounded-[3rem] shadow-2xl"
            >
              <div className="bg-base-100 rounded-[2.8rem] p-8 md:p-12 space-y-8">
                <div className="flex justify-between items-start">
                  <MdAutoMode className="text-6xl text-primary/20" />
                  <div className="text-right">
                    <div className="text-4xl font-black">99.8%</div>
                    <div className="text-[10px] font-bold opacity-40 uppercase">
                      Accuracy Rate
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 w-full bg-base-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '95%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-linear-to-r from-primary to-secondary"
                    ></motion.div>
                  </div>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-widest text-center">
                    Optimizing Production Flow...
                  </p>
                </div>
                <div className="pt-6 border-t border-base-200 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase">
                      Efficiency
                    </p>
                    <p className="text-lg font-bold text-success">+24.5%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase">
                      Response
                    </p>
                    <p className="text-lg font-bold text-info">Instant</p>
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
                Ready to redefine your production?
              </h2>
              <p className="max-w-lg mx-auto opacity-60 font-medium">
                Get a customized strategy session with our supply chain experts
                today.
              </p>
              <button className="btn btn-primary rounded-2xl px-10 btn-lg shadow-2xl hover:scale-105 transition-transform border-none">
                Start Your Project <HiArrowRight />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-[100px]"></div>
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default Services;
