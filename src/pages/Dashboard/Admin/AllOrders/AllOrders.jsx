import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdOutlineReceiptLong,
  MdSearch,
  MdRemoveRedEye,
  MdFilterList,
  MdCheckCircleOutline,
  MdHighlightOff,
  MdHistory,
  MdPendingActions,
  MdAttachMoney,
} from 'react-icons/md';
import { FiPackage, FiUser, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';

const AllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch All Orders
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/admin/all-orders');
        return res.data?.data || [];
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch orders'
        );
      }
    },
  });

  // Stats Calculation
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === 'Pending'
    ).length;
    const deliveredOrders = orders.filter(
      (o) => o.orderStatus === 'Delivered'
    ).length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.orderPrice || 0),
      0
    );

    return [
      {
        label: 'Total Orders',
        val: totalOrders,
        icon: FiPackage,
        color: 'secondary',
      },
      {
        label: 'Pending Orders',
        val: pendingOrders,
        icon: MdPendingActions,
        color: 'warning',
      },
      {
        label: 'Completed',
        val: deliveredOrders,
        icon: MdCheckCircleOutline,
        color: 'success',
      },
      {
        label: 'Total Revenue',
        val: `৳${totalRevenue.toLocaleString()}`,
        icon: MdAttachMoney,
        color: 'primary',
      },
    ];
  }, [orders]);

  // Update Order Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, orderStatus }) => {
      const res = await axiosSecure.patch(`/admin/orders/${id}/status`, {
        orderStatus,
      });
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-all-orders']);
      toast.success('Order status updated successfully!');
    },
    onError: (err) => toast.error(err.message || 'Update failed'),
  });

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());

      const currentStatus = order.orderStatus;
      const matchesStatus =
        statusFilter === 'All' || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusUpdate = (id, newStatus) => {
    updateStatusMutation.mutate({ id, orderStatus: newStatus });

    // For auto close mini modal
    if (document.activeElement) {
      document.activeElement.blur();
    }
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
                <MdOutlineReceiptLong className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Order Management
                </h1>
                <p className="opacity-60 font-medium text-sm md:text-base">
                  Track and manage customer orders across the platform
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

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className={`p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform ${
                  item.color === 'warning'
                    ? 'bg-warning/10'
                    : item.color === 'success'
                    ? 'bg-success/10'
                    : item.color === 'primary'
                    ? 'bg-primary/10'
                    : 'bg-blue-500/10'
                }`}
              >
                <item.icon
                  className={`text-2xl ${
                    item.color === 'warning'
                      ? 'text-warning'
                      : item.color === 'success'
                      ? 'text-success'
                      : item.color === 'primary'
                      ? 'text-primary'
                      : 'text-blue-500'
                  }`}
                />
              </div>
              <div className="text-2xl font-black">{item.val}</div>
              <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-base-100 rounded-3xl p-5 mb-8 shadow-sm border border-base-300 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative lg:w-1/2">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
            <input
              type="text"
              placeholder="Search by Order ID or User Email..."
              className="input input-bordered w-full pl-12 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 lg:w-1/3">
            <div className="relative w-full">
              <MdFilterList className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40 z-10" />
              <select
                className="select select-bordered w-full pl-12 rounded-xl bg-base-200 border-none cursor-pointer appearance-none focus:ring-2 ring-primary/20"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table Card */}
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">
          <div className="overflow-x-auto text-nowrap">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70">
                <tr className="text-sm uppercase tracking-wider">
                  <th className="py-5 px-6">Order Info</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Total Product</th>
                  <th>Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order) => {
                    const currentStatus = order.orderStatus;
                    return (
                      <motion.tr
                        key={order._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-base-200/30 transition-colors"
                      >
                        {/* Order ID & Date */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-base-200 rounded-lg">
                              <FiPackage className="text-xl text-primary" />
                            </div>
                            <div>
                              <div className="font-bold text-sm">
                                #GF-{order._id.slice(-16).toUpperCase()}
                              </div>
                              <div className="text-xs opacity-50 flex items-center gap-1 uppercase">
                                <FiClock />{' '}
                                {new Date(order.orderDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="font-bold text-sm">
                            {order.productTitle}
                          </div>
                          <div className="text-xs opacity-50 max-w-[200px]">
                            {order?.productCategory}
                          </div>
                        </td>

                        {/* User Info */}
                        <td>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                              {order.userName || 'Guest User'}
                            </span>
                            <span className="text-xs opacity-50 flex items-center gap-1">
                              <FiUser className="text-xs" /> {order.userEmail}
                            </span>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td>
                          <div className="badge badge-ghost font-bold">
                            {order.orderQuantity}{' '}
                            {order.orderQuantity > 1 ? 'Items' : 'Item'}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="font-bold text-primary">
                          ৳ {order.orderPrice?.toLocaleString()}
                        </td>

                        {/* Status Badge */}
                        <td className="text-center">
                          <span
                            className={`
                            badge border-none py-3 px-4 rounded-lg font-bold text-xs
                            ${
                              currentStatus === 'Pending'
                                ? 'bg-warning/10 text-warning'
                                : ''
                            }
                            ${
                              currentStatus === 'Approved'
                                ? 'bg-success/10 text-success'
                                : ''
                            }
                            ${
                              currentStatus === 'Rejected'
                                ? 'bg-error/10 text-error'
                                : ''
                            }
                            ${
                              currentStatus === 'Shipped'
                                ? 'bg-info/10 text-info'
                                : ''
                            }
                            ${
                              currentStatus === 'Delivered'
                                ? 'bg-green-500/10 text-green-600'
                                : ''
                            }
                          `}
                          >
                            {currentStatus}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="text-center">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/order-details/${order._id}`)
                            }
                            className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                            title="View Details"
                          >
                            <MdRemoveRedEye className="text-xl" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="p-20 text-center">
                <MdOutlineReceiptLong className="text-6xl opacity-10 mx-auto mb-4" />
                <h3 className="text-xl font-bold opacity-30">
                  No Orders Found
                </h3>
                <p className="text-sm opacity-20">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AllOrders;
