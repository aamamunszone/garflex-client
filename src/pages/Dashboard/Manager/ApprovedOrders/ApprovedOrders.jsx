import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdCheckCircle,
  MdLocalShipping,
  MdClose,
  MdSearch,
  MdAddLocationAlt,
  MdHistory,
} from 'react-icons/md';
import { FiUser, FiCalendar, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';

const ApprovedOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Fetch Approved Orders
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['manager-approved-orders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/manager/approved-orders');
      return res.data?.data || [];
    },
  });

  // Tracking Mutation
  const trackingMutation = useMutation({
    mutationFn: async (trackingData) => {
      const res = await axiosSecure.patch(
        `/manager/orders/${trackingOrder._id}/tracking`,
        trackingData
      );
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['manager-approved-orders']);
      toast.success('Tracking information updated!');
      setTrackingOrder(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleTrackingSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const trackingData = {
      status: form.status.value,
      location: form.location.value,
      note: form.note.value,
    };
    trackingMutation.mutate(trackingData);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="p-4 bg-success text-success-content rounded-2xl shadow-lg">
                <MdCheckCircle className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Approved Orders
                </h1>
                <p className="opacity-60 font-medium text-sm md:text-base">
                  Manage shipment and track progress
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

        {/* Search Bar */}
        <div className="bg-base-100 rounded-3xl p-5 mb-8 shadow-sm border border-base-300 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              className="input input-bordered w-full pl-12 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-success/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70">
                <tr className="text-sm uppercase tracking-wider">
                  <th className="py-5 px-6">Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Approved Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td className="font-mono text-base font-bold text-primary px-6">
                        #GF-{order._id.slice(-16).toUpperCase()}
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-bold flex items-center gap-1 text-sm">
                            <FiUser size={12} /> {order.userName}
                          </span>
                          <span className="text-xs opacity-60">
                            {order.userEmail}
                          </span>
                        </div>
                      </td>
                      <td className="font-bold text-sm">
                        {order.productTitle}
                      </td>
                      <td>
                        <span className="badge badge-sm badge-ghost font-bold">
                          {order.orderQuantity} PCS
                        </span>
                      </td>
                      <td>
                        <div className="text-xs font-medium flex items-center gap-1">
                          <FiCalendar />{' '}
                          {order.approvedAt
                            ? new Date(order.approvedAt).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                            title="View History"
                          >
                            <MdHistory className="text-xl" />
                          </button>
                          <button
                            onClick={() => setTrackingOrder(order)}
                            className="btn btn-square btn-ghost btn-sm text-success hover:bg-success/10"
                            title="Add Tracking"
                          >
                            <MdAddLocationAlt className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </Container>

      {/* --- ADD TRACKING MODAL --- */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-base-content/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-base-100 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-base-300"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <MdLocalShipping /> Update Tracking
                </h3>
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  <MdClose size={20} />
                </button>
              </div>
              <form onSubmit={handleTrackingSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label font-bold text-xs uppercase opacity-60 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    className="select select-bordered rounded-xl w-full"
                    required
                  >
                    <option>Cutting Completed</option>
                    <option>Sewing Started</option>
                    <option>Finishing</option>
                    <option>QC Checked</option>
                    <option>Packed</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label font-bold text-xs uppercase opacity-60 mb-2">
                    Current Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    placeholder="e.g. Warehouse 1, Dhaka"
                    className="input input-bordered rounded-xl"
                    required
                  />
                </div>
                <div className="form-control flex flex-col gap-2">
                  <label className="label font-bold text-xs uppercase opacity-60">
                    Note
                  </label>
                  <textarea
                    name="note"
                    className="textarea textarea-bordered rounded-xl"
                    placeholder="Additional details..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={trackingMutation.isPending}
                  className="btn btn-success w-full rounded-xl text-white"
                >
                  {trackingMutation.isPending ? 'Updating...' : 'Update Status'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TRACKING HISTORY VIEW MODAL --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-base-content/40 backdrop-blur-sm">
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-base-100 p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto border border-base-300"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black">Tracking Timeline</h3>
                  <p className="text-xs opacity-50 font-bold uppercase tracking-widest">
                    Order #GF-{selectedOrder._id.slice(-16).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="relative border-l-2 border-dashed border-base-300 ml-4 space-y-8 pb-4">
                {selectedOrder.trackingHistory?.length > 0 ? (
                  [...selectedOrder.trackingHistory]
                    .reverse()
                    .map((step, idx) => (
                      <div key={idx} className="relative ml-6">
                        <div className="absolute -left-10 top-1 w-8 h-8 rounded-full bg-success flex items-center justify-center text-white ring-4 ring-base-100 shadow-md">
                          <FiPackage size={14} />
                        </div>
                        <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
                          <p className="font-black text-sm text-success">
                            {step.status}
                          </p>
                          <p className="text-xs font-bold opacity-70 mt-1 flex items-center gap-1">
                            <MdAddLocationAlt /> {step.location}
                          </p>
                          {step.note && (
                            <p className="text-xs opacity-60 mt-2 bg-base-100 p-2 rounded-lg italic">
                              "{step.note}"
                            </p>
                          )}
                          <p className="text-[10px] opacity-40 mt-3 font-mono">
                            {new Date(step.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-10 opacity-30 italic">
                    No tracking updates yet.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApprovedOrders;
