import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdSearch,
  MdDeleteOutline,
  MdEdit,
  MdClose,
  MdOutlineInventory2,
  MdFilterList,
} from 'react-icons/md';
import { FiPackage, FiLayers, FiDatabase } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';

const ManageProducts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch Products
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['manager-my-products'],
    queryFn: async () => {
      const res = await axiosSecure.get('/manager/my-products');
      return res.data?.data || [];
    },
  });

  // Extract unique categories for the filter dropdown
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(products.map((p) => p.category))];
    return ['All', ...uniqueCats];
  }, [products]);

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/manager/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['manager-my-products']);
      toast.success('Product deleted successfully');
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(
        `/manager/products/${selectedProduct._id}`,
        updatedData
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['manager-my-products']);
      setShowUpdateModal(false);
      toast.success('Product updated successfully!');
    },
  });

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Handlers
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl',
      },
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedData = {
      name: form.name.value,
      category: form.category.value,
      price: parseFloat(form.price.value),
      availableQuantity: parseInt(form.availableQuantity.value),
      paymentOptions: form.paymentOptions.value.split(',').map((s) => s.trim()),
      longDescription: form.longDescription.value,
      demoVideo: form.demoVideo.value,
    };
    updateMutation.mutate(updatedData);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="pb-10 min-h-screen bg-base-200/30">
      <Container>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary text-primary-content rounded-2xl shadow-lg">
                <MdOutlineInventory2 className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Manage Products
                </h1>
                <p className="opacity-60 font-medium text-sm md:text-base">
                  Total {filteredProducts.length} products found
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="btn btn-outline btn-primary rounded-xl"
            >
              Refresh List
            </button>
          </div>
        </motion.div>

        {/* Filters Section - AllOrders Style */}
        <div className="bg-base-100 rounded-3xl p-5 mb-8 shadow-sm border border-base-300 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
            <input
              type="text"
              placeholder="Search by product name..."
              className="input input-bordered w-full pl-12 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative min-w-[200px]">
            <MdFilterList className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
            <select
              className="select select-bordered w-full pl-12 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70">
                <tr className="text-sm uppercase tracking-wider">
                  <th className="py-5 px-6">Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Payment</th>
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
                        <div className="flex items-center gap-3 text-nowrap">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12 bg-base-200">
                              <img
                                src={product.images?.[0] || product.image}
                                alt=""
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-sm truncate max-w-[150px]">
                          {product.name}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost font-medium uppercase text-xs px-3 rounded-sm tracking-wider italic">
                          <FiLayers className="mr-1" /> {product.category}
                        </span>
                      </td>
                      <td className="font-bold text-primary">
                        ৳ {product.price?.toLocaleString()}
                      </td>
                      <td>
                        <div
                          className={`flex items-center gap-1 font-bold ${
                            product.availableQuantity > 50
                              ? 'text-success'
                              : 'text-error'
                          }`}
                        >
                          <FiDatabase className="text-xs" />{' '}
                          {product.availableQuantity || 0}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {Array.isArray(product.paymentOptions) ? (
                            product.paymentOptions.slice(0, 2).map((opt, i) => (
                              <span
                                key={i}
                                className="badge badge-outline badge-sm text-xs uppercase font-bold opacity-70"
                              >
                                {opt}
                              </span>
                            ))
                          ) : (
                            <span className="badge badge-outline badge-sm text-xs font-bold">
                              {product.paymentOptions}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                            title="Edit Details"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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
                <FiPackage className="text-6xl opacity-10 mx-auto mb-4" />
                <h3 className="text-xl font-bold opacity-30">
                  No Products Found
                </h3>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* --- Update Product Modal --- */}
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

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Category
                    </label>
                    <input
                      name="category"
                      defaultValue={selectedProduct.category}
                      className="input input-bordered rounded-xl bg-base-200/50 border-none"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Price (৳)
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={selectedProduct.price}
                      className="input input-bordered rounded-xl bg-base-200/50 border-none"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Stock Quantity
                    </label>
                    <input
                      name="availableQuantity"
                      type="number"
                      defaultValue={selectedProduct.availableQuantity || 0}
                      className="input input-bordered rounded-xl bg-base-200/50 border-none"
                      required
                    />
                  </div>
                </div>

                <div className="md:flex justify-between gap-5 space-y-5">
                  <div className="form-control flex flex-col gap-2 flex-1">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Payment Options (comma-separated)
                    </label>
                    <textarea
                      name="paymentOptions"
                      defaultValue={
                        Array.isArray(selectedProduct.paymentOptions)
                          ? selectedProduct.paymentOptions.join(', ')
                          : selectedProduct.paymentOptions
                      }
                      className="textarea textarea-bordered rounded-xl bg-base-200/50 border-none h-24 resize-none"
                      required
                    />
                  </div>

                  <div className="form-control flex flex-col gap-2 flex-1">
                    <label className="label text-xs font-bold uppercase opacity-50">
                      Description
                    </label>
                    <textarea
                      name="longDescription"
                      defaultValue={selectedProduct.longDescription}
                      className="textarea textarea-bordered rounded-xl bg-base-200/50 border-none h-24 resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label text-xs font-bold uppercase opacity-50">
                    Demo Video
                  </label>
                  <input
                    name="demoVideo"
                    defaultValue={selectedProduct.demoVideo}
                    className="input input-bordered"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="btn btn-ghost rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-2xl">
                    Save Changes
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

export default ManageProducts;
