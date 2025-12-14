import React from 'react';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FaQuoteRight, FaStar, FaStarHalfAlt } from 'react-icons/fa';

// Import Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Container from '../../common/Container/Container';

const CustomerFeedback = () => {
  // Animation Variants (Consistent with HowItWorks)
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
    },
  };

  const feedbacks = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Buyer, FashionHub',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review:
        'This platform revolutionized how we track our bulk orders. The real-time updates on the cutting and sewing stages are a game changer for our planning.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Manager, Textiles Co.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      rating: 4.5,
      review:
        'Excellent interface and very responsive. The ability to approve orders and track shipments seamlessly has saved us countless hours of manual work.',
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Owner, KidsWear',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review:
        "I love the 'Track Order' timeline feature. It gives me peace of mind knowing exactly where my products are in the production line. Highly recommended!",
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Procurement Head',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review:
        'The system is robust and secure. Managing payments and invoices has never been this easy. The dashboard analytics are also very detailed.',
    },
  ];

  // Star Rating Helper
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-orange-400 text-sm" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-orange-400 text-sm" />
        );
      } else {
        stars.push(<FaStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <>
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
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-base-content mt-4">
              Trusted by{' '}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Top Brands
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
            Hear from our satisfied partners about how we help them streamline
            their garment production workflow.
          </motion.p>
        </div>

        {/* Swiper Carousel */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative px-4"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={false}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12" // Padding bottom for pagination bullets
          >
            {feedbacks.map((item) => (
              <SwiperSlide key={item.id} className="h-full py-4">
                <div className="group h-full relative bg-base-100 p-8 rounded-2xl border border-base-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  {/* Decorative Quote Icon Background */}
                  <FaQuoteRight className="absolute top-6 right-8 text-8xl text-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />

                  {/* linear Glow on Hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Header: User Info */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full p-1 bg-linear-to-tr from-primary to-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full rounded-full object-cover border-2 border-base-100"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-base-100 rounded-full p-1">
                        <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-base-content/70 italic leading-relaxed mb-6 relative z-10">
                    "{item.review}"
                  </p>

                  {/* Footer: Rating */}
                  <div className="flex items-center gap-2 border-t border-base-200 pt-4 relative z-10">
                    <span className="font-bold text-base-content">
                      {item.rating}.0
                    </span>
                    <div className="flex gap-1">{renderStars(item.rating)}</div>
                  </div>

                  {/* Bottom animated border */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-primary to-secondary group-hover:w-full transition-all duration-700"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Decorative Blobs (Consistent with other sections) */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
      </Container>

      {/* Custom Styles for Swiper Pagination to match Theme */}
      <style jsx>{`
        .swiper-pagination-bullet {
          background-color: var(--fallback-bc, oklch(var(--bc) / 0.2));
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background-color: var(--fallback-p, oklch(var(--p) / 1));
          opacity: 1;
          width: 24px;
          border-radius: 8px;
          transition: width 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default CustomerFeedback;
