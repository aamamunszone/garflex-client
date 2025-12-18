import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdOutlinePendingActions,
  MdCheckCircleOutline,
  MdHighlightOff,
  MdOutlineRemoveRedEye,
  MdClose,
  MdSearch,
} from 'react-icons/md';
import { FiShoppingBag, FiUser, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';

const PendingOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Pending Orders
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['manager-pending-orders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/manager/pending-orders');
      return res.data?.data || [];
    },
  });

  // Status Update Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, orderStatus }) => {
      const res = await axiosSecure.patch(`/manager/orders/${id}/status`, {
        orderStatus,
      });
      return res.data?.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['manager-pending-orders']);
      toast.success(`Order ${variables.orderStatus} successfully!`);
    },
    onError: (err) => toast.error(err.message || 'Action failed'),
  });

  const handleAction = (id, orderStatus) => {
    const isApprove = orderStatus === 'Approved';
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${orderStatus.toLowerCase()} this order?`,
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#10b981' : '#ef4444',
      confirmButtonText: `Yes, ${orderStatus}!`,
      customClass: { popup: 'rounded-3xl' },
    }).then((result) => {
      if (result.isConfirmed) statusMutation.mutate({ id, orderStatus });
    });
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
              <div className="p-4 bg-warning text-warning-content rounded-2xl shadow-lg">
                <MdOutlinePendingActions className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Pending Orders
                </h1>
                <p className="opacity-60 font-medium text-sm md:text-base">
                  Total {filteredOrders.length} orders awaiting review
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="btn btn-outline btn-primary rounded-xl"
            >
              Refresh Orders
            </button>
          </div>
        </motion.div>

        {/* Search/Filters Section */}
        <div className="bg-base-100 rounded-3xl p-5 mb-8 shadow-sm border border-base-300">
                  <div className="relative w-full lg:max-w-md">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
                    <input
                      type="text"
                      placeholder="Search by Order ID or User Name..."
                      className="input input-bordered w-full pl-12 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
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
                  <th>User Info</th>
                  <th>Product</th>
                  <th>Price & Qty</th>
                  <th>Date</th>
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
                      exit={{ opacity: 0 }}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td className="font-mono text-base font-bold text-primary px-6">
                        #GF-{order._id.slice(-16).toUpperCase()}
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold flex items-center gap-1 text-sm">
                            <FiUser size={12} /> {order.userName}
                          </span>
                          <span className="text-xs opacity-60">
                            {order.userEmail}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-sm truncate max-w-[150px]">
                          {order.productTitle}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-primary">
                            ৳ {order.orderPrice?.toLocaleString()}
                          </span>
                          <span className="text-xs text-base-content font-bold">
                            {order.orderQuantity} PCS
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="text-xs font-medium flex items-center gap-1">
                          <FiCalendar />{' '}
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                            title="View Details"
                          >
                            <MdOutlineRemoveRedEye className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleAction(order._id, 'Approved')}
                            className="btn btn-square btn-ghost btn-sm text-success hover:bg-success/10"
                            title="Approve"
                          >
                            <MdCheckCircleOutline className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleAction(order._id, 'Rejected')}
                            className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                            title="Reject"
                          >
                            <MdHighlightOff className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="p-20 text-center">
                <FiShoppingBag className="text-6xl opacity-10 mx-auto mb-4" />
                <h3 className="text-xl font-bold opacity-30">
                  No Pending Orders Found
                </h3>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-base-content/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-base-100 p-8 rounded-3xl shadow-2xl w-full max-w-lg relative border border-base-300 z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="opacity-60 font-bold uppercase text-xs">
                    Product
                  </span>
                  <span className="font-bold">
                    {selectedOrder.productTitle}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="opacity-60 font-bold uppercase text-xs">
                    Customer
                  </span>
                  <span className="font-bold">{selectedOrder.userName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="opacity-60 font-bold uppercase text-xs">
                    Quantity
                  </span>
                  <span className="font-bold">
                    {selectedOrder.orderQuantity} Units
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="opacity-60 font-bold uppercase text-xs">
                    Total Amount
                  </span>
                  <span className="font-black text-primary text-lg">
                    ৳{selectedOrder.orderPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-base-200 rounded-2xl">
                  <p className="text-xs font-bold uppercase opacity-50 mb-1">
                    Shipping Address
                  </p>
                  <p className="text-sm font-medium">
                    {selectedOrder.deliveryAddress || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => {
                    handleAction(selectedOrder._id, 'Rejected');
                    setSelectedOrder(null);
                  }}
                  className="btn btn-outline btn-error rounded-xl"
                >
                  Reject Order
                </button>
                <button
                  onClick={() => {
                    handleAction(selectedOrder._id, 'Approved');
                    setSelectedOrder(null);
                  }}
                  className="btn btn-primary rounded-xl"
                >
                  Approve Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingOrders;
