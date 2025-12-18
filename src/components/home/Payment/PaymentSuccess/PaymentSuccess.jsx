import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { MdCheckCircle, MdReceiptLong } from 'react-icons/md';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../common/Loader/Loader';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const axiosPrivate = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    if (sessionId) {
      axiosPrivate
        .patch(`/payment-success?session_id=${sessionId}`)
        .then((res) => {
          setTxnId(res.data.transactionId);
          setLoading(false);
        });
    }
  }, [sessionId, axiosPrivate]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card bg-base-100 border border-base-300 shadow-2xl p-10 text-center max-w-md"
      >
        <MdCheckCircle className="text-8xl text-green-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Payment Verified
        </h2>
        <p className="text-base-content/60 my-4 font-medium">
          Your booking is confirmed. Tracking ID will be generated soon.
        </p>
        <div className="bg-slate-100 p-4 rounded-2xl mb-6">
          <p className="text-[10px] font-bold uppercase text-slate-400">
            Transaction ID
          </p>
          <p className="font-mono text-primary font-bold">{txnId}</p>
        </div>
        <Link
          to="/dashboard/my-orders"
          className="btn btn-primary rounded-xl font-bold gap-2"
        >
          <MdReceiptLong className="text-xl" /> View My Orders
        </Link>
      </motion.div>
    </div>
  );
};
export default PaymentSuccess;
