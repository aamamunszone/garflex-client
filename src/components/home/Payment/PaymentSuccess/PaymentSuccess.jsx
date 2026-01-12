import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MdCheckCircle, MdReceiptLong, MdError } from 'react-icons/md';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loader from '../../../common/Loader/Loader';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const axiosPrivate = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [txnId, setTxnId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      toast.error('Invalid payment session');
      return;
    }

    // Prevent multiple verification attempts
    if (loading === false) {
      return;
    }

    console.log('=== VERIFYING PAYMENT ===');
    console.log('Session ID:', sessionId);

    axiosPrivate
      .patch(`/payment-success?session_id=${sessionId}`)
      .then((res) => {
        console.log('Payment verification response:', res.data);

        if (res.data.success) {
          setTxnId(res.data.transactionId);
          setOrderId(res.data.orderId);
          toast.success(
            res.data.message || 'Payment verified successfully! 🎉'
          );
        } else {
          setError(res.data.message || 'Payment verification failed');
          toast.error(res.data.message || 'Payment verification failed');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('=== PAYMENT VERIFICATION ERROR ===');
        console.error('Error details:', err);
        console.error('Response data:', err.response?.data);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to verify payment';

        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      });
  }, [sessionId, axiosPrivate]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card bg-base-100 border border-error/20 shadow-2xl p-10 text-center max-w-md"
        >
          <MdError className="text-8xl text-error mx-auto mb-4" />
          <h2 className="text-3xl font-black uppercase tracking-tight text-error">
            Verification Failed
          </h2>
          <p className="text-base-content/60 my-4 font-medium">{error}</p>
          <div className="flex gap-3 mt-6">
            <Link
              to="/dashboard/my-orders"
              className="btn btn-outline btn-error rounded-xl font-bold flex-1"
            >
              View Orders
            </Link>
            <Link
              to="/all-products"
              className="btn btn-primary rounded-xl font-bold flex-1"
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card bg-base-100 border border-success/20 shadow-2xl p-10 text-center max-w-md"
      >
        <MdCheckCircle className="text-8xl text-success mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Payment Verified
        </h2>
        <p className="text-base-content/60 my-4 font-medium">
          Your order has been confirmed and will be processed soon.
        </p>
        <div className="bg-base-200 p-4 rounded-2xl mb-4">
          <p className="text-[10px] font-bold uppercase text-base-content/50">
            Transaction ID
          </p>
          <p className="font-mono text-primary font-bold text-sm break-all">
            {txnId}
          </p>
        </div>
        {orderId && (
          <div className="bg-base-200 p-4 rounded-2xl mb-6">
            <p className="text-[10px] font-bold uppercase text-base-content/50">
              Order ID
            </p>
            <p className="font-mono text-secondary font-bold text-sm break-all">
              {orderId}
            </p>
          </div>
        )}
        <Link
          to="/dashboard/my-orders"
          className="btn btn-primary rounded-xl font-bold gap-2 w-full"
        >
          <MdReceiptLong className="text-xl" /> View My Orders
        </Link>
      </motion.div>
    </div>
  );
};
export default PaymentSuccess;
