import React from 'react';
import { motion } from 'motion/react';
import { HiCheckCircle, HiArrowRight } from 'react-icons/hi';
import Container from '../../common/Container/Container';

const PricingAndPlans = () => {
  // Animation Variants (Consistent with previous sections)
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

  const planVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: 'backOut' },
    },
  };

  const plans = [
    {
      name: 'Starter',
      price: 49,
      duration: 'per month',
      isPopular: false,
      color: 'from-blue-400 to-cyan-400',
      features: [
        'Basic Order Tracking',
        '10 Active Orders Limit',
        'Email Support',
        'Standard Analytics Dashboard',
        '1 Manager Seat',
      ],
    },
    {
      name: 'Professional',
      price: 149,
      duration: 'per month',
      isPopular: true,
      color: 'from-primary to-secondary',
      features: [
        'Unlimited Order Tracking',
        'Real-Time QC Monitoring',
        'Priority Chat Support',
        'Advanced Performance Analytics',
        '5 Manager Seats + Buyer Access',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      duration: 'per year',
      isPopular: false,
      color: 'from-purple-400 to-pink-400',
      features: [
        'All Professional features',
        'Dedicated Account Manager',
        'Custom API Integrations',
        'On-Premise Deployment Options',
        'Unlimited Users & Roles',
      ],
    },
  ];

  return (
    <Container className="py-10 relative rounded-xl overflow-hidden bg-base-100">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={textLeftVariant}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-base-content mt-4">
            Simple Plans,{' '}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Powerful Growth
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
          Choose the perfect plan to streamline your garment production, whether
          you're a startup or a large enterprise.
        </motion.p>
      </div>

      {/* Pricing Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch px-4"
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            variants={planVariants}
            className={`relative h-full flex flex-col p-8 rounded-3xl border ${
              plan.isPopular
                ? 'border-primary/50 shadow-2xl shadow-primary/20'
                : 'border-base-200 shadow-xl'
            } transition-all duration-500 hover:shadow-primary/40`}
          >
            {/* Best Value Tag */}
            {plan.isPopular && (
              <div className="absolute top-0 right-0 mt-4 mr-8 transform translate-x-1/2 -translate-y-1/2">
                <span className="inline-block bg-linear-to-r from-primary to-secondary text-primary-content text-xs font-bold px-4 py-1.5 rounded-full shadow-lg rotate-20">
                  Best Value
                </span>
              </div>
            )}

            <div className="grow">
              {/* Plan Header */}
              <h3 className="text-3xl font-bold text-base-content mb-2">
                {plan.name}
              </h3>
              <p className="text-base-content/60 mb-8">{plan.duration}</p>

              {/* Price */}
              <div className="mb-8">
                {plan.price === 'Custom' ? (
                  <span className="text-5xl font-black bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Contact Us
                  </span>
                ) : (
                  <div className="text-6xl font-black text-base-content">
                    <span className="text-3xl align-top text-primary/70">
                      $
                    </span>
                    {plan.price}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <HiCheckCircle
                      className={`text-2xl ${
                        plan.isPopular ? 'text-primary' : 'text-base-content/40'
                      } shrink-0 mt-0.5`}
                    />
                    <span className="text-base-content/80 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <a
              href={plan.price === 'Custom' ? '#contact' : '#subscribe'}
              className={`mt-auto w-full group inline-flex items-center justify-center gap-2 px-8 py-4 ${
                plan.isPopular
                  ? `bg-linear-to-r ${plan.color} hover:from-primary/90 hover:to-secondary/90 text-primary-content shadow-lg hover:shadow-xl`
                  : 'bg-base-200 border border-base-300 hover:bg-base-300 text-base-content'
              } font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]`}
            >
              <span>
                {plan.price === 'Custom' ? 'Get a Quote' : 'Choose Plan'}
              </span>
              <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            {/* Animated linear Border (on Popular Plan) */}
            {plan.isPopular && (
              <div className="absolute inset-0 rounded-3xl border-4 border-transparent pointer-events-none opacity-50">
                <div
                  className={`absolute inset-0 rounded-3xl bg-linear-to-r ${plan.color} blur-xl opacity-50 animate-pulse`}
                ></div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative Blobs (Consistent with other sections) */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none delay-500"></div>
    </Container>
  );
};

export default PricingAndPlans;
