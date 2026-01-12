import axios from 'axios';

// Check if we're in a production environment where localhost might be incorrectly set
const getCurrentBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const productionUrl = 'https://garflex-server.vercel.app';
  
  // If we detect localhost in production-like environment, use production URL instead
  if (envBaseUrl && (envBaseUrl.includes('localhost') || envBaseUrl.includes('127.0.0.1'))) {
    // Check if we're running on a deployed domain (not localhost)
    const currentOrigin = window.location.origin;
    if (!currentOrigin.includes('localhost') && !currentOrigin.includes('127.0.0.1')) {
      console.warn('Detected localhost API URL in deployed environment, switching to production URL');
      return productionUrl;
    }
  }
  
  return envBaseUrl || productionUrl;
};

const axiosPublic = axios.create({
  baseURL: getCurrentBaseUrl(),
  timeout: 10000, // 10 second timeout for public requests
});

const useAxios = () => {
  return axiosPublic;
};

export default useAxios;
