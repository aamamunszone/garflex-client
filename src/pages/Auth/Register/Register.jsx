import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { firebaseErrorMessage } from '../../../utils/firebaseErrors';
import GoogleAuthButton from '../../../components/ui/GoogleAuthButton/GoogleAuthButton';
import WithDotLoaderButton from '../../../components/ui/WithDotLoaderButton/WithDotLoaderButton';

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
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

  const handleRegisterSubmit = async (data) => {
    setIsSubmitting(true);
    const userName = data.name;
    const userEmail = data.email;
    const userPassword = data.password;
    const userImage = data.image[0];
    const userRole = data.role;

    try {
      const userCredential = await createUser(userEmail, userPassword);
      const user = userCredential.user;

      const formData = new FormData();
      formData.append('image', userImage);

      const ImgBB_API_URL = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_APIKEY
      }`;
      const res = await axios.post(ImgBB_API_URL, formData);

      const imageURL = res.data.data.display_url;

      await updateUserProfile({
        displayName: userName,
        photoURL: imageURL,
      });

      const userInfo = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        role: userRole,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      const response = await axiosSecure.post('/users/register', userInfo);

      if (response.data.success) {
        toast.success(
          `Congratulations ${
            user?.displayName || 'User'
          }. 🎉 Registration successful!`
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
        className="w-full max-w-6xl grid lg:grid-cols-2 bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 h-[800px]"
      >
        {/* Left Side - Form Area */}
        <div className="flex flex-col justify-center p-8 lg:p-10 order-2 lg:order-1 overflow-y-auto">
          <div className="w-full max-w-md mx-auto space-y-5">
            {/* Form Heading */}
            <div className="space-y-1 text-center lg:text-left">
              <h1 className="text-2xl font-black text-base-content">
                Create New Account
              </h1>
              <p className="text-sm text-base-content/60">
                Fill in the details to get started
              </p>
            </div>

            {/* Register Form */}
            <form
              onSubmit={handleSubmit(handleRegisterSubmit)}
              className="space-y-3.5"
            >
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-base-content block">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'Full name is required.',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Full name cannot exceed 30 characters.',
                    },
                  })}
                  placeholder="Enter your full name"
                  className="input input-bordered w-full focus:border-primary focus:outline-none transition-all duration-300"
                />
                {errors.name && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <span>⚠️</span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Image Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-base-content block">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('image', {
                    required: {
                      value: true,
                      message: 'Image file is required.',
                    },
                    validate: {
                      singleFile: (files) =>
                        files?.length === 1 ||
                        'Please upload only 1 image file.',
                      maxSize: (files) =>
                        files?.[0]?.size <= 2 * 1024 * 1024 ||
                        'Image must be less than 2MB.',
                      validType: (files) =>
                        ['image/jpeg', 'image/png', 'image/webp'].includes(
                          files?.[0]?.type
                        ) || 'Only JPG, PNG or WEBP images are allowed.',
                    },
                  })}
                  className="file-input file-input-bordered w-full focus:border-primary focus:outline-none transition-all duration-300"
                />
                {errors.image && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <span>⚠️</span>
                    {errors.image.message}
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-base-content block">
                  Select Role
                </label>
                <select
                  defaultValue=""
                  className="select select-bordered w-full focus:border-primary focus:outline-none transition-all duration-300"
                  {...register('role', {
                    required: {
                      value: true,
                      message: 'Select a role is required.',
                    },
                  })}
                >
                  <option value="" disabled>
                    Choose your role
                  </option>
                  <option value="buyer">Buyer</option>
                  <option value="manager">Manager</option>
                </select>
                {errors.role && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <span>⚠️</span>
                    {errors.role.message}
                  </p>
                )}
              </div>

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
                      validate: {
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) ||
                          'Must include at least one uppercase letter.',
                        hasLowercase: (value) =>
                          /[a-z]/.test(value) ||
                          'Must include at least one lowercase letter.',
                        hasSpecial: (value) =>
                          /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                          'Must include at least one special character.',
                      },
                    })}
                    placeholder="Create a strong password"
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
                  <WithDotLoaderButton>Creating Account</WithDotLoaderButton>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-base-300"></div>
              <span className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                Or Continue With
              </span>
              <div className="flex-1 h-px bg-base-300"></div>
            </div>

            {/* Google Auth */}
            <GoogleAuthButton />

            {/* Login Link */}
            <p className="text-center text-sm text-base-content/70 pt-1">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                state={location.state}
                className="font-semibold text-primary hover:text-secondary transition-colors duration-300 hover:underline underline-offset-4"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Content Area */}
        <div className="hidden lg:flex flex-col justify-center items-center p-10 bg-linear-to-br from-secondary/10 via-accent/10 to-primary/10 relative overflow-hidden order-1 lg:order-2">
          {/* Animated Background */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-10 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '700ms' }}
          ></div>

          <div className="relative z-10 space-y-6 text-center max-w-sm">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-secondary to-accent rounded-2xl shadow-xl"
            >
              <MdPersonAdd className="text-4xl text-primary-content" />
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h2 className="text-4xl font-black bg-linear-to-r from-secondary via-accent to-primary bg-clip-text text-transparent leading-tight">
                Join GarFlex Today!
              </h2>
              <p className="text-base-content/70 text-base leading-relaxed">
                Create your account and start managing garment production with
                our advanced tracking system.
              </p>
            </motion.div>

            {/* Decorative Lines */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-4 h-1 bg-secondary rounded-full"></div>
              <div className="w-8 h-1 bg-linear-to-r from-accent to-primary rounded-full"></div>
              <div className="w-12 h-1 bg-linear-to-r from-primary to-secondary rounded-full"></div>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              <div className="p-4 bg-base-100/60 backdrop-blur-sm rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                <p className="text-2xl font-bold text-secondary">Free</p>
                <p className="text-sm text-base-content/60">Forever</p>
              </div>
              <div className="p-4 bg-base-100/60 backdrop-blur-sm rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300">
                <p className="text-2xl font-bold text-accent">Easy</p>
                <p className="text-sm text-base-content/60">Setup</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
