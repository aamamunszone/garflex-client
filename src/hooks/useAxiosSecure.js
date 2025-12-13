import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ===== Request Interceptor =====
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const token = await user?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // ===== Response Interceptor =====
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const statusCode = error?.response?.status;

        // Handle 401 Unauthorized
        if (statusCode === 401) {
          toast.error('Your session has expired. Please log in again.');
          try {
            await signOutUser();
          } catch (error) {
            console.error('Error during auto sign-out:', error);
          } finally {
            navigate('/auth/login', {
              state: { from: window.location.pathname },
              replace: true,
            });
          }
        }

        // Handle 403 Forbidden
        if (statusCode === 403) {
          toast.error('You do not have permission to access this resource.');
          console.error('Access Forbidden: Insufficient permissions.');
          navigate('/error/unauthorized', { replace: true });
        }

        // Handle 404 Not Found
        if (statusCode === 404) {
          toast.error('Requested resource not found.');
          console.error('Resource not found');
          navigate('/error/not-found', { replace: true });
        }

        // Handle 500 Internal Server Error
        if (statusCode === 500) {
          toast.error('Server crashed. Please try again later.');
          console.error('Server error occurred');
          navigate('/error/server-crash', { replace: true });
        }

        console.error('API Error:', {
          status: statusCode,
          message: error.response?.data?.message || error.message,
          endpoint: error.config?.url,
        });

        return Promise.reject(error);
      }
    );

    // Cleanup Interceptors
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, navigate, signOutUser]);

  return axiosSecure;
};

export default useAxiosSecure;
