import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdOutlineListAlt,
  MdSearch,
  MdClose,
  MdDeleteOutline,
  MdInfoOutline,
  MdLocalShipping,
} from 'react-icons/md';
import { FiPackage, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';
import { useNavigate } from 'react-router';

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  // Fetch Buyer's Orders
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['buyer-my-orders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/buyer/my-orders');
      return res.data?.data || [];
    },
  });

  // Cancel Order Mutation
  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/buyer/orders/${id}`);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['buyer-my-orders']);
      toast.success('Order cancelled successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff7675',
      cancelButtonColor: '#00b894',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate(id);
      }
    });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productTitle?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <div className="p-4 bg-primary text-white rounded-2xl shadow-lg">
                <MdOutlineListAlt className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-base-content">
                  My Orders
                </h1>
                <p className="opacity-60 font-medium text-sm">
                  Track your purchases and order status
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="btn btn-outline btn-primary rounded-xl cursor-pointer"
            >
              Refresh Orders
            </button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="bg-base-100 rounded-3xl p-5 mb-8 shadow-sm border border-base-300">
          <div className="relative w-full lg:max-w-md">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
            <input
              type="text"
              placeholder="Search by Order ID or Product..."
              className="input input-bordered w-full pl-12 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70">
                <tr className="text-sm uppercase tracking-wider">
                  <th className="py-5 px-6">Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Payment</th>
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
                      <td className="font-bold text-sm">
                        {order.productTitle}
                      </td>
                      <td>
                        <span className="badge badge-sm badge-ghost font-bold px-3 rounded-sm">
                          {order.orderQuantity} PCS
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm font-bold px-3 rounded-sm ${
                            order.orderStatus === 'Pending'
                              ? 'badge-warning'
                              : order.orderStatus === 'Approved'
                              ? 'badge-info'
                              : 'badge-success'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5 font-bold text-xs opacity-70 italic">
                          <FiCreditCard /> {order.paymentStatus}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center gap-3">
                          {/* ১. Track Order Button (Navigate to new page) */}
                          <button
                            onClick={() =>
                              navigate(`/dashboard/track-order/${order._id}`)
                            }
                            className="btn btn-sm btn-outline btn-info gap-2 rounded-xl normal-case hover:shadow-lg transition-all"
                            title="Track in detail page"
                          >
                            <MdLocalShipping className="text-lg" />
                            <span>Track</span>
                          </button>

                          {/* ২. Details Button (Open Modal) */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-sm btn-outline btn-primary gap-2 rounded-xl normal-case hover:shadow-lg transition-all"
                            title="View quick details"
                          >
                            <MdInfoOutline className="text-lg" />
                            <span>Details</span>
                          </button>

                          {/* ৩. Cancel Button (Only if Pending) */}
                          {order.orderStatus === 'Pending' && (
                            <button
                              onClick={() => handleCancel(order._id)}
                              className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl transition-colors"
                              title="Cancel Order"
                            >
                              <MdDeleteOutline className="text-xl" />
                            </button>
                          )}
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

      {/* --- TRACKING & DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-base-content/40 backdrop-blur-sm">
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-base-100 p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-base-300"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black">Order Progress</h3>
                  <p className="text-xs opacity-50 font-bold uppercase">
                    #GF-{selectedOrder._id.slice(-16).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-circle btn-ghost btn-sm cursor-pointer"
                >
                  <MdClose size={24} />
                </button>
              </div>

              {/* Order Info Summary */}
              <div className="bg-base-200/50 p-4 rounded-2xl mb-8 border border-base-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase">
                      Product
                    </p>
                    <p className="text-sm font-bold truncate">
                      {selectedOrder.productTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase">
                      Current Status
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {selectedOrder.currentStatus || selectedOrder.orderStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="relative border-l-2 border-dashed border-primary ml-4 space-y-8 pb-4">
                {selectedOrder.trackingHistory?.length > 0 ? (
                  [...selectedOrder.trackingHistory]
                    .reverse()
                    .map((step, idx) => (
                      <div key={idx} className="relative ml-6">
                        <div className="absolute -left-10 top-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-base-100">
                          <FiPackage size={14} />
                        </div>
                        <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm">
                          <p className="font-black text-sm text-primary">
                            {step.status}
                          </p>
                          <p className="text-xs font-bold opacity-70 mt-1">
                            {step.location}
                          </p>
                          <p className="text-[10px] opacity-40 mt-2 font-mono">
                            {new Date(step.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center py-10 opacity-30 italic gap-2 text-center">
                    {selectedOrder.currentStatus === 'Rejected' ||
                    selectedOrder.orderStatus === 'Rejected' ? (
                      <p>Thank You, See you again soon.</p>
                    ) : (
                      <>
                        <MdInfoOutline size={40} />
                        <p>
                          Order is currently being processed by manager. <br />{' '}
                          Tracking info will appear soon.
                        </p>
                      </>
                    )}
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

export default MyOrders;
