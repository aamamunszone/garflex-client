import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdProductionQuantityLimits,
  MdSearch,
  MdEdit,
  MdDeleteOutline,
  MdHome,
  MdOutlineHomeWork,
  MdCloudUpload,
  MdClose,
  MdPayments,
  MdVideocam,
} from 'react-icons/md';
import { FiPackage, FiLayers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';
import axios from 'axios';

const AllProductsForReview = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [homeFilter, setHomeFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch Products
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-all-products'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/all-products');
      return res.data?.data || [];
    },
  });

  // Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosSecure.patch(`/admin/products/${id}`, payload);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-all-products']);
      toast.success('Product updated successfully!');
      setShowUpdateModal(false);
      setSelectedProduct(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || 'Update failed'),
  });

  // Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/admin/products/${id}`);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-all-products']);
      Swal.fire('Deleted!', 'Product has been removed.', 'success');
    },
  });

  // Logic: Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCat =
        categoryFilter === 'All' || p.category === categoryFilter;
      const matchesHome =
        homeFilter === 'All' ||
        (homeFilter === 'Home' ? p.showOnHomePage : !p.showOnHomePage);
      return matchesSearch && matchesCat && matchesHome;
    });
  }, [products, searchQuery, categoryFilter, homeFilter]);

  // Logic: Calculate Stats
  const stats = useMemo(() => {
    const defaultStats = {
      total: 0,
      onHome: 0,
      hidden: 0,
      totalValue: 0,
      categories: 0,
    };
    if (!Array.isArray(products)) return defaultStats;

    const uniqueCategories = new Set();

    const result = products.reduce((acc, p) => {
      acc.total++;
      if (p.showOnHomePage) acc.onHome++;
      else acc.hidden++;
      acc.totalValue += p.price || 0;
      if (p.category) uniqueCategories.add(p.category);
      return acc;
    }, defaultStats);

    result.categories = uniqueCategories.size;
    return result;
  }, [products]);

  // Handlers
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const ImgBB_API_KEY = import.meta.env.VITE_IMGBB_APIKEY;

      if (!ImgBB_API_KEY) {
        throw new Error('ImgBB API key is not configured');
      }

      const ImgBB_API_URL = `https://api.imgbb.com/1/upload?key=${ImgBB_API_KEY}`;

      const res = await axios.post(ImgBB_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        const newImageUrl = res.data.data.display_url;
        setSelectedProduct((prev) => ({
          ...prev,
          images: [newImageUrl, ...(prev.images?.slice(1) || [])],
        }));
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      if (error.response?.status === 400) {
        toast.error('Invalid API key or image format');
      } else {
        toast.error(error.message || 'Image upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.name.value.trim(),
      price: parseFloat(form.price.value),
      category: form.category.value.trim(),
      longDescription: form.longDescription.value.trim(),
      demoVideo: form.demoVideo.value.trim(),
      paymentOptions: form.paymentOptions.value
        .split(',')
        .map((opt) => opt.trim())
        .filter(Boolean),
      images: selectedProduct.images,
    };

    updateMutation.mutate({ id: selectedProduct._id, payload });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleToggleHome = (id, currentStatus) => {
    updateMutation.mutate({
      id,
      payload: { showOnHomePage: !currentStatus },
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="pb-10 min-h-screen bg-base-200/30">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-secondary text-secondary-content rounded-2xl shadow-lg">
                <MdProductionQuantityLimits className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Product Inventory
                </h1>
                <p className="opacity-60 font-medium">
                  Manage store products and home page visibility
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="btn btn-outline btn-primary rounded-xl"
            >
              Refresh Data
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: 'Total Products',
              val: stats.total,
              color: 'primary',
              icon: FiPackage,
            },
            {
              label: 'On Home Page',
              val: stats.onHome,
              color: 'secondary',
              icon: MdHome,
            },
            {
              label: 'Hidden/Draft',
              val: stats.hidden,
              color: 'info',
              icon: MdOutlineHomeWork,
            },
            {
              label: 'Categories',
              val: stats.categories,
              color: 'error',
              icon: FiLayers,
            },
            {
              label: 'Total Value',
              val: `৳${Math.round(stats.totalValue).toLocaleString()}`,
              color: 'success',
              icon: MdPayments,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className={`p-3 rounded-xl bg-${item.color}/10 w-fit mb-3 group-hover:scale-110 transition-transform`}
              >
                <item.icon className={`text-2xl text-${item.color}`} />
              </div>
              <div className="text-2xl font-black">{item.val}</div>
              <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-base-100 rounded-3xl p-5 mb-8 shadow-sm border border-base-300 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative lg:w-1/3">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered w-full pl-12 rounded-xl bg-base-200/50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 lg:w-1/3">
            <select
              className="select select-bordered rounded-xl bg-base-200 border-none cursor-pointer flex-1"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {Array.from(new Set(products.map((p) => p.category))).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered rounded-xl bg-base-200 border-none cursor-pointer flex-1"
              value={homeFilter}
              onChange={(e) => setHomeFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Home">On Home Page</option>
              <option value="Hidden">Hidden from Home</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-base-content/60">
          Showing <span className="font-bold">{filteredProducts.length}</span>{' '}
          of <span className="font-bold">{products.length}</span> products
        </div>

        {/* Table */}
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70">
                <tr className="text-sm uppercase tracking-wider">
                  <th className="py-5 px-6">Image</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Created By</th>
                  <th className="text-center">Show on Home</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-base-200"
                        />
                      </td>
                      <td>
                        <div className="font-bold text-base">
                          {product.name}
                        </div>
                        <div className="text-xs opacity-50 truncate max-w-[200px]">
                          {product.shortDescription}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="font-bold text-primary">
                        ৳{product.price}
                      </td>
                      <td className="text-sm font-medium opacity-70">
                        {product.createdBy}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            handleToggleHome(
                              product._id,
                              product.showOnHomePage
                            )
                          }
                          disabled={updateMutation.isPending}
                          className={`btn btn-circle btn-sm ${
                            product.showOnHomePage
                              ? 'btn-success text-white'
                              : 'btn-ghost bg-base-200'
                          }`}
                          title={
                            product.showOnHomePage
                              ? 'Remove from home'
                              : 'Show on home'
                          }
                        >
                          {product.showOnHomePage ? (
                            <MdHome className="text-lg" />
                          ) : (
                            <MdOutlineHomeWork className="text-lg opacity-30" />
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowUpdateModal(true);
                            }}
                            className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                            title="Edit Product"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deleteMutation.isPending}
                            className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                            title="Delete Product"
                          >
                            <MdDeleteOutline className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="p-20 text-center">
                <FiPackage className="text-6xl opacity-20 mx-auto mb-4" />
                <h3 className="text-xl font-bold opacity-40">
                  No Products Found
                </h3>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Update Modal */}
      <AnimatePresence>
        {showUpdateModal && selectedProduct && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpdateModal(false)}
              className="absolute inset-0 bg-base-content/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-base-100 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-3xl relative border border-base-300 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  <FiPackage className="text-primary" /> Update Product
                </h3>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Product Name
                    </label>
                    <input
                      name="name"
                      defaultValue={selectedProduct.name}
                      className="input input-bordered rounded-xl bg-base-200/50 border-none"
                      required
                    />
                  </div>
                  {/* Category */}
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Category
                    </label>
                    <div className="relative">
                      <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                      <input
                        name="category"
                        defaultValue={selectedProduct.category}
                        className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 border-none"
                        required
                      />
                    </div>
                  </div>
                  {/* Price */}
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Price (৳)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                        ৳
                      </span>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={selectedProduct.price}
                        className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 border-none"
                        required
                      />
                    </div>
                  </div>
                  {/* Demo Video */}
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Demo Video URL
                    </label>
                    <div className="relative">
                      <MdVideocam className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg" />
                      <input
                        name="demoVideo"
                        defaultValue={selectedProduct.demoVideo}
                        className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 border-none"
                        placeholder="YouTube/Vimeo link"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="form-control">
                  <label className="label text-xs font-bold uppercase opacity-50">
                    Payment Options (comma-separated)
                  </label>
                  <div className="relative">
                    <MdPayments className="absolute left-4 top-2.5 opacity-40 text-lg" />
                    <textarea
                      name="paymentOptions"
                      defaultValue={
                        Array.isArray(selectedProduct.paymentOptions)
                          ? selectedProduct.paymentOptions.join(', ')
                          : selectedProduct.paymentOptions
                      }
                      className="textarea textarea-bordered w-full pl-10 rounded-xl bg-base-200/50 border-none h-20 resize-none"
                      placeholder="e.g. Cash on Delivery, PayFirst"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label text-xs font-bold uppercase opacity-50">
                    Product Description
                  </label>
                  <textarea
                    name="longDescription"
                    defaultValue={selectedProduct.longDescription}
                    className="textarea textarea-bordered w-full rounded-xl bg-base-200/50 border-none h-24 resize-none"
                    required
                  />
                </div>

                {/* Image Upload Area */}
                <div className="form-control">
                  <label className="label text-xs font-bold uppercase opacity-50">
                    Product Image
                  </label>
                  <div className="flex flex-wrap gap-4 items-center p-4 bg-base-200/50 rounded-2xl border-2 border-dashed border-base-300">
                    {selectedProduct.images?.[0] && (
                      <img
                        src={selectedProduct.images[0]}
                        className="w-20 h-20 rounded-lg object-cover bg-base-100 ring-2 ring-base-300"
                        alt="Preview"
                      />
                    )}
                    <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-base-300/50 transition-colors p-4 rounded-xl min-h-[100px]">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="loading loading-spinner text-primary loading-lg"></span>
                          <span className="text-sm font-medium">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <>
                          <MdCloudUpload className="text-4xl text-primary mb-2" />
                          <span className="text-sm font-medium">
                            Click to upload new image
                          </span>
                          <span className="text-xs opacity-50 mt-1">
                            Max 5MB (JPG, PNG, WEBP)
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="btn btn-ghost rounded-2xl"
                    disabled={updateMutation.isPending || uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending || uploading}
                    className="btn btn-primary rounded-2xl shadow-lg shadow-primary/30"
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllProductsForReview;
