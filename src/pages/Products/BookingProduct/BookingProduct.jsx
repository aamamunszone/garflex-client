import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { MdPayment, MdCheckCircle } from 'react-icons/md';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Loader from '../../../components/common/Loader/Loader';
import Container from '../../../components/common/Container/Container';

const BookingProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      productTitle: '',
      price: 0,
      firstName: '',
      lastName: '',
      orderQuantity: 0,
      orderPrice: 0,
      contactNumber: '',
      deliveryAddress: '',
      additionalNotes: '',
    },
  });

  const orderQuantity = watch('orderQuantity');

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/products/${id}`);
        const productData = response.data;
        setProduct(productData);

        // Set read-only fields
        setValue('productTitle', productData.name);
        setValue('price', productData.price);
        setValue('orderQuantity', productData.minimumOrderQuantity);

        // Set default payment method
        if (
          productData.paymentOptions &&
          productData.paymentOptions.length > 0
        ) {
          setSelectedPaymentMethod(productData.paymentOptions[0]);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load product details!');
        navigate('/all-products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, axiosSecure, navigate, setValue]);

  // Calculate order price automatically
  useEffect(() => {
    if (product && orderQuantity) {
      const totalPrice = product.price * orderQuantity;
      setValue('orderPrice', totalPrice);
    }
  }, [orderQuantity, product, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    // Validate payment method selection
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method!');
      return;
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: `${data.firstName} ${data.lastName}`,
        productId: product._id,
        productTitle: data.productTitle,
        productPrice: data.price,
        productCategory: product.category,
        orderQuantity: parseInt(data.orderQuantity),
        orderPrice: data.orderPrice,
        contactNumber: data.contactNumber,
        deliveryAddress: data.deliveryAddress,
        additionalNotes: data.additionalNotes,
        paymentMethod: selectedPaymentMethod,
        paymentStatus:
          selectedPaymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        orderStatus: 'Pending',
        orderDate: new Date().toISOString(),
      };

      // Check if PayFirst is selected
      if (selectedPaymentMethod === 'PayFirst') {
        // Redirect to payment page (Stripe) - DO NOT create order here
        toast.success('Redirecting to payment...');
        navigate(`/buyer/payment/${product._id}`, { state: { orderData } });
      } else {
        // Cash on Delivery - Save order directly with idempotency key
        const idempotencyKey = `cod-${user.uid}-${product._id}-${Date.now()}`;

        const response = await axiosSecure.post('/buyer/orders', orderData, {
          headers: {
            'idempotency-key': idempotencyKey,
          },
        });

        if (response.data.success) {
          toast.success('Order placed successfully! 🎉');
          navigate('/dashboard/my-orders');
        }
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <title>GarFlex | Book Order - {product.name}</title>

      <div className="min-h-screen py-8">
        <Container>
          <div className="md:max-w-3/4 mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-black text-base-content mb-2">
                Complete Your Order
              </h1>
              <p className="text-base-content/70">
                Fill in the details below to place your order
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Summary Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-base-100 rounded-2xl border border-base-300 p-6 shadow-lg sticky top-32 space-y-4">
                  <h3 className="text-xl font-bold text-base-content mb-4">
                    Order Summary
                  </h3>

                  {/* Product Image */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  {/* Product Info */}
                  <div className="space-y-3 pt-4 border-t border-base-300">
                    <div>
                      <p className="text-sm text-base-content/60">Product</p>
                      <p className="font-semibold text-base-content">
                        {product.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-base-content/60">Unit Price</p>
                      <p className="font-semibold text-base-content">
                        ৳ {product.price}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-base-content/60">Quantity</p>
                      <p className="font-semibold text-base-content">
                        {orderQuantity || product.minimumOrderQuantity} pieces
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-base-content/60">
                        Payment Method
                      </p>
                      <p className="font-semibold text-primary">
                        {selectedPaymentMethod || 'Not selected'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-base-300">
                      <p className="text-sm text-base-content/60">
                        Total Amount
                      </p>
                      <p className="text-2xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        ৳{' '}
                        {product.price *
                          (orderQuantity || product.minimumOrderQuantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <div className="bg-base-100 rounded-2xl border border-base-300 p-8 shadow-lg">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        readOnly
                        className="w-full px-4 py-3 bg-base-200 border border-base-300/60 rounded-lg text-base-content cursor-not-allowed"
                      />
                    </div>

                    {/* Product Title (Read-only) */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        {...register('productTitle')}
                        readOnly
                        className="w-full px-4 py-3 bg-base-200 border border-base-300/60 rounded-lg text-base-content cursor-not-allowed"
                      />
                    </div>

                    {/* Price (Read-only) */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        {...register('price')}
                        readOnly
                        className="w-full px-4 py-3 bg-base-200 border border-base-300/60 rounded-lg text-base-content cursor-not-allowed"
                      />
                    </div>

                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          {...register('firstName', {
                            required: 'First name is required',
                          })}
                          placeholder="Enter first name"
                          className="w-full px-4 py-3 bg-base-100 border border-base-300/60 rounded-lg text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        />
                        {errors.firstName && (
                          <p className="text-sm text-error mt-1.5">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          {...register('lastName', {
                            required: 'Last name is required',
                          })}
                          placeholder="Enter last name"
                          className="w-full px-4 py-3 bg-base-100 border border-base-300/60 rounded-lg text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        />
                        {errors.lastName && (
                          <p className="text-sm text-error mt-1.5">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Quantity */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Order Quantity
                      </label>
                      <input
                        type="number"
                        {...register('orderQuantity', {
                          required: 'Order quantity is required',
                          min: {
                            value: product.minimumOrderQuantity,
                            message: `Minimum order is ${product.minimumOrderQuantity} pieces`,
                          },
                          max: {
                            value: product.availableQuantity,
                            message: `Maximum available is ${product.availableQuantity} pieces`,
                          },
                        })}
                        placeholder="Enter quantity"
                        className="w-full px-4 py-3 bg-base-100 border border-base-300/60 rounded-lg text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      />
                      <p className="text-xs text-base-content/50 mt-1.5">
                        Min: {product.minimumOrderQuantity} | Max:{' '}
                        {product.availableQuantity}
                      </p>
                      {errors.orderQuantity && (
                        <p className="text-sm text-error mt-1.5">
                          {errors.orderQuantity.message}
                        </p>
                      )}
                    </div>

                    {/* Order Price (Read-only, Auto-calculated) */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Total Order Price
                      </label>
                      <input
                        type="number"
                        {...register('orderPrice')}
                        readOnly
                        className="w-full px-4 py-3 bg-base-200 border border-base-300/60 rounded-lg text-base-content font-bold cursor-not-allowed"
                      />
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-3">
                        <MdPayment className="inline-block mr-2 text-lg" />
                        Select Payment Method
                      </label>
                      <div className="space-y-3">
                        {product.paymentOptions.map((option) => (
                          <label
                            key={option}
                            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              selectedPaymentMethod === option
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-base-300 hover:border-primary/50 hover:bg-base-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={option}
                              checked={selectedPaymentMethod === option}
                              onChange={(e) =>
                                setSelectedPaymentMethod(e.target.value)
                              }
                              className="radio radio-primary"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-base-content">
                                {option}
                              </p>
                              <p className="text-xs text-base-content/60 mt-1">
                                {option === 'Cash on Delivery'
                                  ? 'Pay when you receive the product'
                                  : 'Secure online payment via Stripe'}
                              </p>
                            </div>
                            {selectedPaymentMethod === option && (
                              <MdCheckCircle className="text-2xl text-primary" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        {...register('contactNumber', {
                          required: 'Contact number is required',
                          pattern: {
                            value: /^[0-9]{11}$/,
                            message: 'Enter valid 11-digit phone number',
                          },
                        })}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-3 bg-base-100 border border-base-300/60 rounded-lg text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      />
                      {errors.contactNumber && (
                        <p className="text-sm text-error mt-1.5">
                          {errors.contactNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        {...register('deliveryAddress', {
                          required: 'Delivery address is required',
                        })}
                        placeholder="Enter full delivery address"
                        rows={3}
                        className="w-full px-4 py-3 bg-base-100 border border-base-300/60 rounded-lg text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                      ></textarea>
                      {errors.deliveryAddress && (
                        <p className="text-sm text-error mt-1.5">
                          {errors.deliveryAddress.message}
                        </p>
                      )}
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        {...register('additionalNotes')}
                        placeholder="Any special instructions or requirements"
                        rows={3}
                        className="w-full px-4 py-3 bg-base-100 border border-base-300/60 rounded-lg text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="loading loading-spinner loading-sm"></span>
                          Processing Order...
                        </span>
                      ) : (
                        'Confirm Order'
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default BookingProduct;
