import axios from 'axios';

const axiosPublic = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || 'https://garflex-server.vercel.app',
});

const useAxios = () => {
  return axiosPublic;
};

export default useAxios;
