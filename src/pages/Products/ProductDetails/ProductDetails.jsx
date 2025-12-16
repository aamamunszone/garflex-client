import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { HiShoppingCart, HiArrowLeft, HiPlay } from 'react-icons/hi';
import { MdInventory, MdCategory, MdPayment } from 'react-icons/md';
import { FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import Loader from '../../../components/common/Loader/Loader';
import Container from '../../../components/common/Container/Container';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load product details!');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, axiosSecure]);

  // Handle order button click
  const handleOrderClick = () => {
    if (!user) {
      toast.error('Please login to place an order!');
      navigate('/auth/login', { state: { from: `/product-details/${id}` } });
      return;
    }

    // Check user role - Only buyers can order
    if (user?.role === 'admin' || user?.role === 'manager') {
      toast.error('Admin and Manager cannot place orders!');
      return;
    }

    // Redirect to booking page
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Product Not Found
          </h2>
          <Link
            to="/all-products"
            className="text-primary hover:underline font-medium"
          >
            Back to All Products
          </Link>
        </div>
      </Container>
    );
  }

  const {
    name,
    shortDescription,
    longDescription,
    category,
    price,
    availableQuantity,
    minimumOrderQuantity,
    images,
    demoVideo,
    paymentOptions,
  } = product;

  // Extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(demoVideo);

  return (
    <>
      <title>GarFlex | {name}</title>

      <div className="min-h-screen py-8">
        <Container>
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/all-products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-base-100 border border-base-300 rounded-lg hover:bg-base-200 transition-all duration-300 group"
            >
              <HiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium text-base-content">
                Back to Products
              </span>
            </Link>
          </motion.div>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - Images & Video */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image/Video Display */}
              <div className="relative bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-lg aspect-square">
                {showVideo && videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={name}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img
                    src={images[selectedImage]}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Play Video Button */}
                {demoVideo && videoId && !showVideo && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <HiPlay className="text-4xl text-primary ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setShowVideo(false);
                    }}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index && !showVideo
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-base-300 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

                {/* Video Thumbnail */}
                {demoVideo && videoId && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 relative ${
                      showVideo
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-base-300 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <HiPlay className="text-white text-2xl" />
                    </div>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Right Side - Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <MdCategory className="text-primary text-lg" />
                <span className="px-3 py-1 bg-linear-to-r from-primary/10 to-secondary/10 text-primary font-semibold text-sm rounded-full border border-primary/20">
                  {category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-black text-base-content leading-tight">
                {name}
              </h1>

              {/* Short Description */}
              <p className="text-lg text-base-content/80 leading-relaxed">
                {shortDescription}
              </p>

              {/* Price Section */}
              <div className="bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    ৳ {price}
                  </span>
                  <span className="text-base-content/60 font-medium">
                    /piece
                  </span>
                </div>
                <p className="text-sm text-base-content/60">
                  Competitive pricing with bulk discounts available
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Available Quantity */}
                <div className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-success">
                    <MdInventory className="text-xl" />
                    <span className="text-sm font-medium text-base-content/60">
                      In Stock
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-base-content">
                    {availableQuantity}
                  </p>
                  <p className="text-xs text-base-content/50">
                    Units Available
                  </p>
                </div>

                {/* Minimum Order */}
                <div className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-secondary">
                    <FiPackage className="text-xl" />
                    <span className="text-sm font-medium text-base-content/60">
                      Min Order
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-base-content">
                    {minimumOrderQuantity}
                  </p>
                  <p className="text-xs text-base-content/50">Pieces</p>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-base-content/70">
                  <MdPayment className="text-xl text-primary" />
                  <span className="font-semibold">Payment Options:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {paymentOptions.map((option, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-base-100 border border-base-300 rounded-lg text-sm font-medium text-base-content"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>

              {/* Order Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrderClick}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <HiShoppingCart className="text-2xl group-hover:animate-bounce" />
                <span>Place Order Now</span>
              </motion.button>

              {/* User Role Notice */}
              {user && (user.role === 'admin' || user.role === 'manager') && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                  <p className="text-sm text-warning font-medium">
                    ⚠️ Admin and Manager accounts cannot place orders.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Long Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-base-100 border border-base-300 rounded-2xl p-8 shadow-md"
          >
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-linear-to-b from-primary to-secondary rounded-full"></span>
              Product Description
            </h2>
            <p className="text-base text-base-content/80 leading-relaxed whitespace-pre-line">
              {longDescription}
            </p>
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default ProductDetails;
