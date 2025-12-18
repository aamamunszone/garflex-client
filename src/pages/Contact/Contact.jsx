import React from 'react';
import { motion } from 'motion/react';
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSupportAgent,
  MdChatBubble,
} from 'react-icons/md';
import { HiArrowRight } from 'react-icons/hi';
import Container from '../../components/common/Container/Container';

const Contact = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const contactMethods = [
    {
      title: 'Direct Support',
      icon: <MdPhone />,
      desc: 'Talk to our production experts directly for immediate assistance.',
      info: '+880 1234 567 890',
      span: 'md:col-span-1',
      bg: 'bg-primary/5',
      accent: 'bg-primary',
    },
    {
      title: 'Global Inquiries',
      icon: <MdEmail />,
      desc: 'Email us your tech packs or business proposals and get a quote within 24h.',
      info: 'hello@garflex.com',
      span: 'md:col-span-2',
      bg: 'bg-secondary/5',
      accent: 'bg-secondary',
    },
    {
      title: 'Visit Our Hub',
      icon: <MdLocationOn />,
      desc: 'Drop by our corporate office or schedule a visit to our production facility.',
      info: 'Sector 07, Uttara, Dhaka, Bangladesh',
      span: 'md:col-span-2',
      bg: 'bg-accent/5',
      accent: 'bg-accent',
    },
    {
      title: 'Live Chat',
      icon: <MdChatBubble />,
      desc: 'Available 24/7 for our registered global partners via dashboard.',
      info: 'Active on Dashboard',
      span: 'md:col-span-1',
      bg: 'bg-primary/5',
      accent: 'bg-primary',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-base-200 py-5 md:py-10 lg:py-20 min-h-screen">
      {/* Background Decorative Elements */}
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
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-base-content leading-tight mb-6">
            Let's build your <br />
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Next Collection Together
            </span>
          </h1>
          <p className="text-lg text-base-content/60 max-w-2xl font-medium leading-relaxed">
            Have a project in mind? Our team is ready to provide strategic
            manufacturing solutions tailored to your brand's growth.
          </p>
        </motion.div>

        {/* --- Bento Grid Style Contact Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-20 lg:mb-32">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className={`${method.span} ${method.bg} border border-base-300 rounded-[2.5rem] p-10 flex flex-col justify-between group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5`}
            >
              <div className="space-y-6">
                <div
                  className={`w-16 h-16 ${method.accent} text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-primary/20`}
                >
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-base-content mb-2">
                    {method.title}
                  </h3>
                  <p className="text-base-content/60 font-medium text-sm leading-relaxed mb-4">
                    {method.desc}
                  </p>
                  <p className="text-lg font-bold text-primary italic underline decoration-secondary decoration-2 underline-offset-4 tracking-tight">
                    {method.info}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Asymmetric Form Section --- */}
        <div className="grid lg:grid-cols-2 gap-20 items-stretch py-8 md:py-14 lg:py-20 border-t border-base-300">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-16 h-1 bg-primary rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-base-content uppercase italic">
              Send us a <br />{' '}
              <span className="text-primary">Direct Message</span>
            </h2>
            <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
              <div className="flex gap-4 items-center mb-6">
                <MdSupportAgent className="text-5xl text-primary" />
                <div>
                  <h4 className="font-black text-lg">Partner Success Team</h4>
                  <p className="text-xs font-bold opacity-50 uppercase">
                    Average response: 2 Hours
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed text-base-content/70 italic">
                "Our team is specifically trained to help startups and
                established brands scale their supply chains efficiently."
              </p>
            </div>
          </motion.div>

          {/* Contact Form Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative bg-linear-to-br from-primary via-secondary to-accent p-1 rounded-[3rem] shadow-2xl"
          >
            <form className="bg-base-100 rounded-[2.8rem] p-8 md:p-12 space-y-5 h-full">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 ml-2 tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-base-200 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 ml-2 tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@brand.com"
                    className="w-full bg-base-200 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-50 ml-2 tracking-widest">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  placeholder="Luxury Wear Ltd."
                  className="w-full bg-base-200 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-50 ml-2 tracking-widest">
                  Your Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your project requirements..."
                  className="w-full bg-base-200 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary rounded-2xl h-16 shadow-xl shadow-primary/20 border-none group"
              >
                <span className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                  Send Inquiry{' '}
                  <HiArrowRight className="text-lg group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
