import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { firebaseErrorMessage } from '../../../utils/firebaseErrors';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';

const GoogleAuthButton = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);

    try {
      const userCredential = await googleSignIn();
      const user = userCredential.user;
      // console.log(user);

      const token = user?.accessToken;

      // Create User in the Database
      const userInfo = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        role: 'Buyer',
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      const response = await axiosSecure.post('/users/google', userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('After user saved in database:', response);
      if (response.status === 201 && response.data.success) {
        // Registration success
        toast.success(
          `Congratulations ${
            user?.displayName || 'User'
          }! 🎉 Registration successful.`
        );
        navigate(location.state?.from?.pathname || '/', { replace: true });
      } else if (response.status === 200 && response.data.success) {
        // Login success
        toast.success(
          `Welcome back ${user?.displayName || 'User'}! 🎉 Login successful.`
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
    <>
      <button
        type="submit"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="btn w-full border rounded-md bg-base-100 text-base-content border-gray-300 flex items-center gap-2"
      >
        <FcGoogle size={22} />
        {isSubmitting ? (
          <span className="font-medium">
            <span className="skeleton skeleton-text">Loading...</span>
          </span>
        ) : (
          <span className="font-medium">Continue with Google</span>
        )}
      </button>
    </>
  );
};

export default GoogleAuthButton;
