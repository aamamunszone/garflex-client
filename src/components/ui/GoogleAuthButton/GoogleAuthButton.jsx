import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { firebaseErrorMessage } from '../../../utils/firebaseErrors';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import WithDotLoaderButton from '../WithDotLoaderButton/WithDotLoaderButton';

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

      // Create User in the Database
      const userInfo = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'buyer',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      const response = await axiosSecure.post('/users/google', userInfo);
      // console.log('After user saved in database:', response);
      if (response.data.success) {
        toast.success(
          `Congratulations ${user?.displayName || 'User'}. 🎉 Login successful!`
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
        className="btn w-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center gap-2"
      >
        <FcGoogle size={22} />
        {isSubmitting ? (
          <span className="font-medium">
            <WithDotLoaderButton>Continue with Google</WithDotLoaderButton>
          </span>
        ) : (
          <span className="font-medium">Continue with Google</span>
        )}
      </button>
    </>
  );
};

export default GoogleAuthButton;
