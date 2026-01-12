import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react'; // eslint-disable-line no-unused-vars
import toast from 'react-hot-toast';
import ProductCard from '../../products/ProductCard/ProductCard';
import Loader from '../../common/Loader/Loader';
import Container from '../../common/Container/Container';
import useAxios from '../../../hooks/useAxios';

const OurProducts = () => {
  const axiosPublic = useAxios();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching recent products from:', axiosPublic.defaults.baseURL + '/products/recent');
        const response = await axiosPublic.get('/products/recent', {
          timeout: 10000, // 10 second timeout
        });
        console.log('Recent products fetched successfully:', response.data);
        setProducts(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent products:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          url: axiosPublic.defaults.baseURL + '/products/recent'
        });
        // Don't show toast if it's a cancellation or network error that's not the user's fault
        if (error.code !== 'ECONNABORTED' && error.code !== 'ERR_CANCELED') {
          toast.error('Failed to load recent products!');
        }
        setProducts([]);
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, [axiosPublic]);

  if (loading) {
    return <Loader />;
  }

  // Fallback if no products are found after loading
  if (!loading && Array.isArray(products) && products.length === 0) {
    return (
      <Container className="py-10 rounded-xl bg-base-100 text-center">
        <h3 className="text-2xl text-base-content/70">
          No recent products found.
        </h3>
        <button
          onClick={() => navigate('/all-products')}
          className="mt-6 px-6 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors"
        >
          Explore All
        </button>
      </Container>
    );
  }

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const buttonGradient =
    'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content';

  return (
    <Container className="py-10 px-4 rounded-xl bg-base-100 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={textVariant}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
            Products
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-base-content mt-4">
            Recent{' '}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Products
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
          Explore our newly added and trending garment items
        </motion.p>
      </div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {products.map((product) => (
          <motion.div key={product._id} variants={cardVariants}>
            {/* ProductCard component used here */}
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.button
          onClick={() => navigate('/all-products')}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`px-8 py-4 ${buttonGradient} font-bold text-lg rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer`}
          transition={{ duration: 0.3 }}
        >
          <span>View All Products</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </motion.button>
      </motion.div>
    </Container>
  );
};

export default OurProducts;
