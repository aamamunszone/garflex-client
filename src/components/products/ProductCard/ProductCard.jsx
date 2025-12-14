import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { HiShoppingCart, HiEye } from 'react-icons/hi';
import { MdInventory } from 'react-icons/md';

const ProductCard = ({ product }) => {
  const {
    _id,
    name,
    shortDescription,
    category,
    price,
    availableQuantity,
    minimumOrderQuantity,
    images,
  } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
        {/* Diagonal Shine Effect Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
          <div
            className="absolute w-[200%] h-[200%] bg-linear-to-br from-transparent via-white/30 to-transparent rotate-45 -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1500 ease-out"
            style={{ transformOrigin: 'center' }}
          ></div>
        </div>

        {/* Image Section */}
        <div className="relative h-64 overflow-hidden bg-base-200">
          {/* Product Image */}
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* linear Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 bg-linear-to-r from-primary/90 to-secondary/90 backdrop-blur-sm text-primary-content text-xs font-bold rounded-full shadow-lg">
              {category}
            </span>
          </div>

          {/* Stock Badge */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-base-100/90 backdrop-blur-sm rounded-full shadow-lg border border-base-300/50">
              <MdInventory className="text-sm text-success" />
              <span className="text-xs font-semibold text-base-content">
                {availableQuantity}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons - Show on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <Link
              to={`/product-details/${_id}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-primary font-semibold rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <HiEye className="text-lg" />
              <span className="text-sm">View Details</span>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          {/* Product Name */}
          <Link to={`/product-details/${_id}`}>
            <h3 className="text-lg font-bold text-base-content line-clamp-1 hover:text-primary transition-colors duration-300">
              {name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-sm text-base-content/70 line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>

          {/* Divider */}
          <div className="h-px bg-linear-to-r from-transparent via-base-300 to-transparent"></div>

          {/* Price & MOQ Info */}
          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-xs text-base-content/50 font-medium">
                Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  ৳{price}
                </span>
                <span className="text-xs text-base-content/50">/piece</span>
              </div>
            </div>

            {/* MOQ */}
            <div className="flex flex-col items-end">
              <span className="text-xs text-base-content/50 font-medium">
                Min Order
              </span>
              <span className="text-sm font-bold text-secondary">
                {minimumOrderQuantity} pcs
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={`/product-details/${_id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group/btn"
          >
            <HiShoppingCart className="text-lg group-hover/btn:animate-bounce" />
            <span>Order Now</span>
          </Link>
        </div>

        {/* Decorative Corner linear */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>

      {/* Animated Border Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary via-secondary to-accent blur-sm opacity-30"></div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
