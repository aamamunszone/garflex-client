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

      const userName = user.displayName;
      const userEmail = user.email;
      const imageURL = user.photoURL;

      // Create User in the Database
      const userInfo = {
        name: userName,
        email: userEmail,
        photoURL: imageURL,
        role: 'Buyer',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      const response = await axiosSecure.post('/users', userInfo);
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
    <>
      <button
        type="submit"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="btn w-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center gap-2"
      >
        <FcGoogle size={22} />
        {isSubmitting ? (
          <span className="font-medium">Signing in with Google...</span>
        ) : (
          <span className="font-medium">Sign in with Google</span>
        )}
      </button>
    </>
  );
};

export default GoogleAuthButton;
