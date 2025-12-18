import React from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  MdLocalShipping,
  MdHistory,
  MdArrowBack,
  MdCheckCircle,
  MdLayers,
  MdInfoOutline,
} from 'react-icons/md';
import { FiPackage, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';

const TrackOrder = () => {
  const { orderId } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: order, isLoading } = useQuery({
    queryKey: ['track-order', orderId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/buyer/track-order/${orderId}`);
      return res.data?.data;
    },
  });

  if (isLoading) return <Loader />;

  const history = order?.trackingHistory || [];
  const latestStatus = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="min-h-screen bg-base-200/30 pb-20">
      <Container>
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 mb-8"
        >
          <Link
            to="/dashboard/my-orders"
            className="btn btn-ghost btn-sm gap-2 pl-0 hover:bg-transparent text-primary font-bold mb-4"
          >
            <MdArrowBack /> Back to My Orders
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20">
                <MdLocalShipping size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-base-content uppercase italic">
                  Track Order
                </h1>
                <p className="text-sm opacity-60 font-bold">
                  Order ID:{' '}
                  <span className="text-primary font-mono">
                    #GF-{order?._id.slice(-12).toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* Status Highlight Card */}
            <div className="bg-base-100 px-8 py-4 rounded-4xl border border-base-300 shadow-sm flex items-center gap-4 w-full lg:w-auto">
              <div className="text-right">
                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                  Current Status
                </p>
                <p className="text-xl font-black text-primary italic uppercase">
                  {latestStatus?.status || order?.orderStatus}
                </p>
              </div>
              <div className="divider divider-horizontal mx-0"></div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <MdCheckCircle size={28} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Order Summary Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <MdLayers className="text-primary" /> Order Information
              </h3>

              <div className="space-y-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black opacity-40 uppercase">
                    Product Title
                  </span>
                  <span className="font-bold text-base-content">
                    {order?.productTitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black opacity-40 uppercase">
                      Quantity
                    </span>
                    <span className="font-bold text-primary">
                      {order?.orderQuantity} PCS
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black opacity-40 uppercase">
                      Price
                    </span>
                    <span className="font-bold">{order?.orderPrice} BDT</span>
                  </div>
                </div>

                <div className="divider my-0 opacity-50"></div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black opacity-40 uppercase flex items-center gap-1">
                    <FiCalendar /> Order Date
                  </span>
                  <span className="font-bold text-sm">
                    {new Date(order?.orderDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black opacity-40 uppercase flex items-center gap-1">
                    <FiMapPin /> Delivery Address
                  </span>
                  <span className="text-sm font-medium opacity-80 leading-relaxed">
                    {order?.deliveryAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Support/Info Card */}
            <div className="bg-primary/5 p-6 rounded-4xl border border-primary/10 flex items-start gap-3">
              <MdInfoOutline className="text-primary shrink-0" size={20} />
              <p className="text-xs font-medium opacity-70 leading-relaxed">
                Production status is updated by our manager in real-time. Please
                contact support if you notice any discrepancies.
              </p>
            </div>
          </div>

          {/* RIGHT: Visual Timeline */}
          <div className="lg:col-span-8">
            <div className="bg-base-100 p-8 md:p-12 rounded-[3rem] border border-base-300 shadow-xl min-h-[500px]">
              <h3 className="text-2xl font-black mb-12 flex items-center gap-3 italic">
                <MdHistory className="text-primary" /> Tracking History
              </h3>

              <div className="relative border-l-2 border-dashed border-base-300 ml-5 md:ml-8 space-y-12">
                {history.length > 0 ? (
                  [...history].reverse().map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative ml-10"
                    >
                      {/* Step Marker */}
                      <div
                        className={`absolute -left-13 top-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                          idx === 0
                            ? 'bg-primary text-white ring-4 ring-primary/20 z-10'
                            : 'bg-base-300 text-base-content/40'
                        }`}
                      >
                        {idx === 0 ? (
                          <FiPackage size={22} />
                        ) : (
                          <FiClock size={18} />
                        )}
                      </div>

                      {/* Step Content */}
                      <div
                        className={`p-6 md:p-8 rounded-[2.5rem] border transition-all ${
                          idx === 0
                            ? 'bg-primary/5 border-primary/20 shadow-md'
                            : 'bg-base-200/50 border-transparent opacity-70'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                          <h4
                            className={`text-lg font-black italic uppercase tracking-tight ${
                              idx === 0 ? 'text-primary' : ''
                            }`}
                          >
                            {step.status}
                          </h4>
                          <span className="text-[10px] font-black opacity-50 bg-base-100 px-3 py-1 rounded-full border border-base-300">
                            {new Date(step.updatedAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-bold opacity-75">
                          <FiMapPin className="text-primary" />
                          <span>{step.location}</span>
                        </div>

                        {step.note && (
                          <div className="mt-4 bg-base-100 p-4 rounded-2xl border border-dashed border-base-300">
                            <p className="text-sm italic opacity-60">
                              "{step.note}"
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20 italic text-center">
                    <FiPackage size={64} className="mb-4" />
                    <p className="text-xl font-bold">No tracking updates yet</p>
                    <p className="text-sm">
                      Wait for manager approval to start production.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TrackOrder;
