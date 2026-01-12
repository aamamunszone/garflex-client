import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MdPayment, MdSecurity, MdArrowBack } from 'react-icons/md';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loader from '../../components/common/Loader/Loader';
import Container from '../../components/common/Container/Container';
import toast from 'react-hot-toast';

const Payment = () => {
  const { parcelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const orderData = location.state?.orderData;

  // Redirect if no order data
  useEffect(() => {
    if (!orderData) {
      toast.error('No order data found. Please start from booking page.');
      setTimeout(() => {
        navigate('/all-products');
      }, 2000);
    }
  }, [orderData, navigate]);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product-payment', parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${parcelId}`);
      return res.data;
    },
    enabled: !!parcelId,
  });

  const handlePayment = async () => {
    if (!orderData) {
      toast.error('Order data is missing. Please try again.');
      return;
    }

    // Prevent double submission
    if (isRedirecting) {
      return;
    }

    setIsRedirecting(true);
    try {
      console.log('=== INITIATING PAYMENT ===');
      console.log('Order data:', orderData);

      const paymentInfo = {
        cost: orderData?.orderPrice,
        parcelId: parcelId || product._id,
        customerEmail: orderData?.userEmail,
        productName: orderData?.productTitle,
        orderMetadata: orderData,
      };

      console.log('Payment info:', paymentInfo);

      const res = await axiosSecure.post(
        '/create-checkout-session',
        paymentInfo
      );

      console.log('Payment response:', res.data);

      if (res.data?.success && res.data?.url) {
        // Redirect to Stripe Checkout
        toast.success('Redirecting to secure payment...');
        // Use location.replace to prevent back button issues
        window.location.replace(res.data.url);
      } else {
        throw new Error(res.data?.message || 'No checkout URL received');
      }
    } catch (error) {
      console.error('=== PAYMENT ERROR ===');
      console.error('Error details:', error);
      console.error('Response data:', error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to initiate payment. Please try again.';

      toast.error(errorMessage);
      setIsRedirecting(false);
    }
  };

  if (isLoading) return <Loader />;

  if (!orderData) {
    return (
      <Container className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading order data...</h2>
          <Loader />
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen py-12 bg-base-100 font-sans rounded-xl">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="flex justify-center mb-12">
          <ul className="steps steps-horizontal w-full lg:w-2/3">
            <li className="step step-primary font-bold">Booking</li>
            <li className="step step-primary font-bold">Payment</li>
            <li className="step font-bold">Success</li>
          </ul>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Side: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-base-200/50 p-8 rounded-3xl border border-base-300"
          >
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
              Order Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-base-300 pb-4">
                <span className="text-base-content/60 font-medium">
                  Product
                </span>
                <span className="font-bold text-right">
                  {orderData?.productTitle}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-base-300 pb-4">
                <span className="text-base-content/60 font-medium">
                  Quantity
                </span>
                <span className="font-bold">
                  {orderData?.orderQuantity} Pcs
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-base-300 pb-4">
                <span className="text-base-content/60 font-medium">
                  Unit Price
                </span>
                <span className="font-bold">৳ {orderData?.productPrice}</span>
              </div>
              <div className="flex justify-between items-center border-b border-base-300 pb-4">
                <span className="text-base-content/60 font-medium">
                  Delivery Address
                </span>
                <span className="font-bold text-xs max-w-[150px] text-right truncate">
                  {orderData?.deliveryAddress}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-xl font-black uppercase">Total Pay</span>
                <span className="text-3xl font-black text-primary">
                  ৳ {orderData?.orderPrice?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-10 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
              <MdSecurity className="text-primary text-2xl shrink-0" />
              <p className="text-xs text-base-content/70 leading-relaxed">
                Your payment is processed through <strong>Stripe</strong>.
                GarFlex does not store your card details, ensuring 100% secure
                transaction.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Action */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-base-100 border-2 border-primary/20 p-8 rounded-3xl shadow-2xl shadow-primary/5">
              <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">
                Ready to Ship?
              </h2>
              <p className="text-base-content/60 mb-8 font-medium">
                Click below to pay via Credit/Debit card or Mobile Wallet.
              </p>

              <button
                onClick={handlePayment}
                disabled={isRedirecting}
                className="w-full py-5 bg-primary hover:bg-primary-focus text-primary-content font-black text-xl rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isRedirecting ? (
                  <>
                    <span className="loading loading-spinner loading-md"></span>
                    <span>Redirecting...</span>
                  </>
                ) : (
                  <>
                    Pay with Stripe <MdPayment className="text-2xl" />
                  </>
                )}
              </button>

              <button
                onClick={() => navigate(-1)}
                disabled={isRedirecting}
                className="w-full mt-4 py-3 btn btn-ghost rounded-xl font-bold gap-2"
              >
                <MdArrowBack /> Go Back
              </button>

              <div className="flex justify-center gap-4 mt-8 opacity-40 grayscale">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
                  className="h-6"
                  alt="Visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  className="h-6"
                  alt="Mastercard"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  className="h-6"
                  alt="Stripe"
                />
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-info/10 border border-info/20 p-6 rounded-2xl">
              <h4 className="font-bold text-info mb-2 flex items-center gap-2">
                <MdSecurity /> Secure Payment
              </h4>
              <ul className="text-sm text-base-content/70 space-y-2">
                <li>✓ SSL encrypted connection</li>
                <li>✓ PCI DSS compliant</li>
                <li>✓ No card details stored</li>
                <li>✓ Instant payment confirmation</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </Container>
  );
};

export default Payment;
