import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import useAxios from '../../../hooks/useAxios';
import Loader from '../../../components/common/Loader/Loader';
import Container from '../../../components/common/Container/Container';
import ProductCard from '../../../components/products/ProductCard/ProductCard';

const AllProducts = () => {
  const axiosPublic = useAxios();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = useMemo(() => {
    const uniqueCategories = [
      'All',
      ...new Set(products.map((product) => product.category)),
    ];
    return uniqueCategories.length > 1
      ? uniqueCategories
      : ['All', 'Shirt', 'Pant', 'Jacket', 'Accessories'];
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosPublic.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load products!');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axiosPublic]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query) ||
          product.longDescription.toLowerCase().includes(query)
      );
    }

    if (sortOption === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortOption]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortOption('default');
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1],
      },
    },
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <title>GarFlex | All Products</title>

      <div className="min-h-screen transition-colors duration-500 space-y-6">
        {/* Filters Section */}
        <Container className="relative z-20">
          <motion.div
            className="bg-base-100 text-base-content rounded-xl p-6 md:p-8 transition-colors duration-500 border border-base-300"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-6 border-b pb-3 border-base-300">
              Refine Your Search
            </h2>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-6 py-3 pl-14 rounded-xl bg-base-200 border-2 border-transparent focus:border-indigo-600 focus:outline-none transition-all duration-300 text-neutral placeholder-gray-500 font-medium"
                />
                <svg
                  className="w-6 h-6 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category and Sort Filters */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-4">
                {/* Category Filter Section */}
                <div className="flex-1 w-full">
                  <h3 className="text-neutral font-semibold mb-3">
                    Filter by Category:
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md cursor-pointer ${selectedCategory === category
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-4 ring-indigo-300/50 dark:ring-purple-700/50'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-600'
                          }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Sort by Price Section */}
                <div className="w-full lg:w-auto lg:min-w-[200px]">
                  <h3 className="text-neutral font-semibold mb-3">
                    Sort by Price:
                  </h3>
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className={`w-full appearance-none px-5 py-2.5 pr-10 rounded-full text-sm font-semibold transition-all duration-300 shadow-md cursor-pointer focus:outline-none focus:ring-4 ${sortOption === 'default'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-600 focus:ring-indigo-300/50'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-4 ring-indigo-300/50 dark:ring-purple-700/50'
                        }`}
                    >
                      <option value="default" className="bg-base-100 text-base-content">Default</option>
                      <option value="price-low" className="bg-base-100 text-base-content">Low to High</option>
                      <option value="price-high" className="bg-base-100 text-base-content">High to Low</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className={`h-4 w-4 ${sortOption === 'default' ? 'text-gray-500' : 'text-white'}`} fill="none" viewBox="0 0 20 20" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Count & Reset */}
              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg">
                    {filteredProducts.length}
                  </span>{' '}
                  result{filteredProducts.length !== 1 ? 's' : ''} found
                  {filteredProducts.length > itemsPerPage && (
                    <span className="ml-2 text-xs">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </p>
                {(selectedCategory !== 'All' || searchQuery !== '' || sortOption !== 'default') && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </Container>

        {/* Products Grid */}
        <Container className="py-10 bg-base-100 px-4 rounded-xl overflow-hidden">
          {currentProducts.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={`${selectedCategory}-${searchQuery}-${sortOption}-${currentPage}`}
              >
                {currentProducts.map((product) => (
                  <motion.div key={product.name} variants={cardVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <motion.div
                  className="flex justify-center items-center gap-2 mt-12 flex-wrap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${currentPage === 1
                      ? 'bg-base-200 text-base-content/40 cursor-not-allowed'
                      : 'bg-base-200 text-base-content hover:bg-primary hover:text-primary-content shadow-sm hover:shadow-md'
                      }`}
                  >
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {generatePageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === 'number' && handlePageChange(page)
                      }
                      disabled={page === '...'}
                      className={`flex items-center justify-center min-w-10 h-10 px-3 rounded-xl font-medium transition-all duration-300 ${page === currentPage
                        ? 'bg-primary text-primary-content shadow-lg scale-110'
                        : page === '...'
                          ? 'bg-transparent text-base-content/50 cursor-default'
                          : 'bg-base-200 text-base-content hover:bg-primary/10 hover:text-primary shadow-sm'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${currentPage === totalPages
                      ? 'bg-base-200 text-base-content/40 cursor-not-allowed'
                      : 'bg-base-200 text-base-content hover:bg-primary hover:text-primary-content shadow-sm hover:shadow-md'
                      }`}
                  >
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              className="text-center py-20 bg-base-100 text-base-content rounded-2xl shadow-inner dark:shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl md:text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-2">
                Oops! No Matching Products
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                We couldn't find any products matching your current category or
                search criteria. Please broaden your selection.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                Show All Products
              </button>
            </motion.div>
          )}
        </Container>
      </div>
    </>
  );
};

export default AllProducts;