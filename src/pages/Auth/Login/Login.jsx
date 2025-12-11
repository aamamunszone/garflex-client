import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import { firebaseErrorMessage } from '../../../utils/firebaseErrors';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GoogleAuthButton from '../../../components/ui/GoogleAuthButton/GoogleAuthButton';

const Login = () => {
  const { signInUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLoginSubmit = async (data) => {
    console.log(data);

    setIsSubmitting(true);

    const userEmail = data.email;
    const userPassword = data.password;

    try {
      const userCredential = await signInUser(userEmail, userPassword);
      const user = userCredential.user;
      console.log(user);

      toast.success(
        `Congratulations ${user?.displayName || 'User'}! 🎉 Login successful.`
      );

      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (error) {
      const errorMessage = firebaseErrorMessage(error.code);
      console.error(error.message);
      // console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Content Area */}
      <div>Login Form Content</div>

      {/* Form Area */}
      <div>
        {/* Form Heading */}
        <div>Login Form Heading</div>

        {/* Input Field with Submit Button for Email/Password Registration */}
        <form onSubmit={handleSubmit(handleLoginSubmit)}>
          {/* Email */}
          <div>
            <label className="label pb-1 font-medium">Email</label>
            <input
              type="email"
              {...register('email', {
                required: {
                  value: true,
                  message: 'Email address is required.',
                },
              })}
              placeholder="Enter your email"
              className="input w-full"
            />
            {errors.email && (
              <p className="text-sm text-error py-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="label pb-1 font-medium">Password</label>
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
              placeholder="Enter password"
              className="input w-full pr-10"
            />

            {/* Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 -translate-y-1/2 text-gray-500 cursor-pointer z-50"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-sm text-error py-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary font-medium tracking-wide text-secondary w-full mt-2"
          >
            {isSubmitting ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <GoogleAuthButton />

        {/* Already have account */}
        <p className="text-center text-sm mt-6">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            state={location.state}
            className="hover:underline underline-offset-4 text-blue-500 hover:text-blue-600 font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
