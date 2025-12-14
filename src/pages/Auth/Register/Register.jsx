import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
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
    // console.log(data);
    setIsSubmitting(true);
    const userName = data.name;
    const userEmail = data.email;
    const userPassword = data.password;
    const userImage = data.image[0];
    const userRole = data.role;

    try {
      const userCredential = await createUser(userEmail, userPassword);
      const user = userCredential.user;
      // console.log(user);

      // Prepare form data for ImgBB
      const formData = new FormData();
      formData.append('image', userImage);

      // Upload Image to ImgBB using Axios
      const ImgBB_API_URL = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_APIKEY
      }`;
      const res = await axios.post(ImgBB_API_URL, formData);
      // console.log('After image upload:', res);

      // Get URL from ImgBB
      const imageURL = res.data.data.display_url;

      // Update Firebase User Profile with UserName and Image URL
      await updateUserProfile({
        displayName: userName,
        photoURL: imageURL,
      });

      // Create User in the Database
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
      // console.log('After user saved in database:', response);
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
      // console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Content Area */}
      <div>Register Form Content</div>

      {/* Form Area */}
      <div>
        {/* Form Heading */}
        <div>Register Form Heading</div>

        {/* Input Field with Submit Button for Email/Password Registration */}
        <form onSubmit={handleSubmit(handleRegisterSubmit)}>
          {/* Name */}
          <div>
            <label className="label pb-1 font-medium">Full Name</label>
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
              className="input w-full"
            />
            {/* Error message */}
            {errors.name && (
              <p className="text-sm text-error py-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="label pb-1 font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              {...register('image', {
                required: {
                  value: true,
                  message: 'Image file is required.',
                },
                validate: {
                  // Ensure only 1 file
                  singleFile: (files) =>
                    files?.length === 1 || 'Please upload only 1 image file.',

                  // Max size (2MB)
                  maxSize: (files) =>
                    files?.[0]?.size <= 2 * 1024 * 1024 ||
                    'Image must be less than 2MB.',

                  // Only image type
                  validType: (files) =>
                    ['image/jpeg', 'image/png', 'image/webp'].includes(
                      files?.[0]?.type
                    ) || 'Only JPG, PNG or WEBP images are allowed.',
                },
              })}
              className="file-input w-full"
            />
            <label className="label pt-2 text-xs">Max size 2MB</label>
            {/* Error message */}
            {errors.image && (
              <p className="text-sm text-error py-1.5">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="label pb-1 font-medium">Select Role</label>
            <select
              defaultValue=""
              className="select w-full"
              {...register('role', {
                required: {
                  value: true,
                  message: 'Select a role is required.',
                },
              })}
            >
              <option value="" disabled>
                Select Your Role
              </option>
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
            </select>
            {/* Error message */}
            {errors.role && (
              <p className="text-sm text-error py-1.5">{errors.role.message}</p>
            )}
          </div>

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
            {/* Error message */}
            {errors.email && (
              <p className="text-sm text-error py-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label pb-1 font-medium">Password</label>
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
                    // hasNumber: (value) =>
                    //   /\d/.test(value) || 'Must include at least one number.',
                    hasSpecial: (value) =>
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                      'Must include at least one special character.',
                  },
                })}
                placeholder="Enter password"
                className="input w-full pr-10"
              />
              {/* Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer z-50"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Error message */}
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
            {isSubmitting ? (
              <WithDotLoaderButton>Creating Account</WithDotLoaderButton>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Auth Button */}
        <GoogleAuthButton />

        {/* Already have an account ? */}
        <p className="text-center text-sm mt-6">
          Already have an account ?{' '}
          <Link
            to="/auth/login"
            state={location.state}
            className="hover:underline underline-offset-4 text-blue-500 hover:text-blue-600 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
