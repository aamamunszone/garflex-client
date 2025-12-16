import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import { firebaseErrorMessage } from '../../../utils/firebaseErrors';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import { motion } from 'motion/react';
import GoogleAuthButton from '../../../components/ui/GoogleAuthButton/GoogleAuthButton';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLoginSubmit = async (data) => {
    setIsSubmitting(true);
    const userEmail = data.email;
    const userPassword = data.password;

    try {
      const userCredential = await signInUser(userEmail, userPassword);
      const user = userCredential.user;

      const token = await user?.accessToken;

      const userInfo = {
        email: user.email,
      };

      const response = await axiosSecure.patch('/users/login', userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(
          `Congratulations ${user?.displayName || 'User'}. 🎉 Login successful!`
        );

        navigate(location.state?.from?.pathname || '/', { replace: true });
      }
    } catch (error) {
      const errorMessage = firebaseErrorMessage(error.code);
      console.error(error.message);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl grid lg:grid-cols-2 bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 h-[600px] md:h-[800px]"
      >
        {/* Left Side - Content Area */}
        <div className="hidden lg:flex flex-col justify-center items-center p-10 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '700ms' }}
          ></div>

          <div className="relative z-10 space-y-6 text-center max-w-sm">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-2xl shadow-xl"
            >
              <MdLogin className="text-4xl text-primary-content" />
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h2 className="text-4xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Welcome Back!
              </h2>
              <p className="text-base-content/70 text-base leading-relaxed">
                Sign in to continue managing your garment production and track
                your orders efficiently.
              </p>
            </motion.div>

            {/* Decorative Lines */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-12 h-1 bg-linear-to-r from-primary to-secondary rounded-full"></div>
              <div className="w-8 h-1 bg-linear-to-r from-secondary to-accent rounded-full"></div>
              <div className="w-4 h-1 bg-accent rounded-full"></div>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              <div className="p-4 bg-base-100/60 backdrop-blur-sm rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-sm text-base-content/60">Support</p>
              </div>
              <div className="p-4 bg-base-100/60 backdrop-blur-sm rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                <p className="text-2xl font-bold text-secondary">100%</p>
                <p className="text-sm text-base-content/60">Secure</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form Area */}
        <div className="flex flex-col justify-center p-8 lg:p-10 overflow-y-auto">
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Form Heading */}
            <div className="space-y-1 text-center lg:text-left">
              <h1 className="text-2xl font-black text-base-content">
                Login to Account
              </h1>
              <p className="text-sm text-base-content/60">
                Enter your credentials to continue
              </p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit(handleLoginSubmit)}
              className="space-y-4"
            >
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-base-content block">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Email address is required.',
                    },
                  })}
                  placeholder="Enter your email"
                  className="input input-bordered w-full focus:border-primary focus:outline-none transition-all duration-300"
                />
                {errors.email && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <span>⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-base-content block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: {
                        value: true,
                        message: 'Password is required.',
                      },
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters.',
                      },
                    })}
                    placeholder="Enter your password"
                    className="input input-bordered w-full pr-12 focus:border-primary focus:outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors duration-300 z-10"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-lg" />
                    ) : (
                      <FaEye className="text-lg" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <span>⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-2 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="skeleton skeleton-text">Logging In...</span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-base-300"></div>
              <span className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                OR
              </span>
              <div className="flex-1 h-px bg-base-300"></div>
            </div>

            {/* Google Login */}
            <GoogleAuthButton />

            {/* Register Link */}
            <p className="text-center text-sm text-base-content/70 pt-2">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                state={location.state}
                className="font-semibold text-primary hover:text-secondary transition-colors duration-300 hover:underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
