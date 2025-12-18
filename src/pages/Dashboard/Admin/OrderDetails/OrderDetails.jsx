import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdArrowBack,
  MdOutlineReceiptLong,
  MdLocalShipping,
  MdPerson,
  MdPayment,
  MdCheckCircle,
  MdUpdate,
} from 'react-icons/md';
import { FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 1. Fetch Order Details
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-order-details', orderId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/orders/${orderId}`);
      return res.data?.data;
    },
  });

  // 2. Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const res = await axiosSecure.patch(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-order-details', orderId]);
      queryClient.invalidateQueries(['admin-all-orders']);
      toast.success('Order status updated successfully!');
    },
    onError: (err) => toast.error(err.message || 'Update failed'),
  });

  if (isLoading) return <Loader />;
  if (error || !order)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-error">Order Not Found!</h2>
        <button onClick={() => navigate(-1)} className="btn btn-primary mt-4">
          Go Back
        </button>
      </div>
    );

  return (
    <div className="pb-16 bg-base-200/30 min-h-screen">
      <Container>
        {/* Header & Back Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-circle btn-ghost bg-base-100 shadow-sm"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                Order{' '}
                <span className="text-primary">
                  #GF-{order._id.slice(-16).toUpperCase()}
                </span>
              </h1>
              <p className="text-sm opacity-60 flex items-center gap-1">
                <FiClock /> Placed on{' '}
                {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Quick Action: Status Update */}
          <div className="flex items-center gap-2 bg-base-100 p-2 rounded-2xl shadow-sm border border-base-300">
            <span className="text-xs font-bold px-3 opacity-50 uppercase">
              Update Status:
            </span>
            <select
              className="select select-sm select-bordered rounded-xl font-bold"
              value={order.orderStatus}
              onChange={(e) => updateStatusMutation.mutate(e.target.value)}
              disabled={updateStatusMutation.isPending}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Product & Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
              <div className="bg-base-200/50 px-6 py-4 border-b border-base-300 flex items-center gap-2 font-bold">
                <MdOutlineReceiptLong className="text-xl text-primary" /> Order
                Summary
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold">{order.productTitle}</h3>
                    <p className="text-sm opacity-70">
                      Category: {order.productCategory}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="px-4 py-2 bg-base-200 rounded-xl text-sm font-bold">
                        Price: ৳{order.productPrice}
                      </div>
                      <div className="px-4 py-2 bg-base-200 rounded-xl text-sm font-bold">
                        Qty: {order.orderQuantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-50">Subtotal</p>
                    <p className="text-2xl font-black text-primary">
                      ৳{order.orderPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline / History */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="bg-base-200/50 px-6 py-4 border-b border-base-300 flex items-center gap-2 font-bold">
                <MdUpdate className="text-xl text-primary" /> Order Progress
              </div>
              <div className="p-6">
                <ul className="steps steps-vertical md:steps-horizontal w-full">
                  <li
                    className={`step ${
                      ['Pending', 'Approved', 'Shipped', 'Delivered'].includes(
                        order.orderStatus
                      )
                        ? 'step-primary'
                        : ''
                    }`}
                  >
                    Placed
                  </li>
                  <li
                    className={`step ${
                      ['Approved', 'Shipped', 'Delivered'].includes(
                        order.orderStatus
                      )
                        ? 'step-primary'
                        : ''
                    }`}
                  >
                    Approved
                  </li>
                  <li
                    className={`step ${
                      ['Shipped', 'Delivered'].includes(order.orderStatus)
                        ? 'step-primary'
                        : ''
                    }`}
                  >
                    Shipped
                  </li>
                  <li
                    className={`step ${
                      ['Delivered'].includes(order.orderStatus)
                        ? 'step-primary'
                        : ''
                    }`}
                  >
                    Delivered
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Shipping Info */}
          <div className="space-y-6">
            {/* Customer Card */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <MdPerson className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-lg">Customer Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiMail className="mt-1 opacity-50" />
                    <div>
                      <p className="text-xs opacity-50 uppercase font-bold tracking-wider">
                        Email Address
                      </p>
                      <p className="font-medium">{order.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiPhone className="mt-1 opacity-50" />
                    <div>
                      <p className="text-xs opacity-50 uppercase font-bold tracking-wider">
                        Phone
                      </p>
                      <p className="font-medium">
                        {order.customerPhone || 'Not Provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                    <MdLocalShipping className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-lg">Shipping Info</h3>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="mt-1 opacity-50" />
                  <div>
                    <p className="text-xs opacity-50 uppercase font-bold tracking-wider">
                      Delivery Address
                    </p>
                    <p className="font-medium leading-relaxed">
                      {order.shippingAddress ||
                        'Address details were not captured in this order document.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-success/10 text-success rounded-xl">
                    <MdPayment className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-lg">Payment</h3>
                </div>
                <div className="flex justify-between items-center bg-base-200 p-4 rounded-xl">
                  <span className="font-bold">Cash On Delivery</span>
                  <MdCheckCircle className="text-success text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderDetails;
