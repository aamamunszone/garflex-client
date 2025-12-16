import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Home from '../pages/Home/Home';
import Register from '../pages/Auth/Register/Register';
import Login from '../pages/Auth/Login/Login';
import ErrorLayout from '../layouts/ErrorLayout/ErrorLayout';
import Unauthorized from '../pages/Errors/Unauthorized/Unauthorized';
import NotFound from '../pages/Errors/NotFound/NotFound';
import ServerCrash from '../pages/Errors/ServerCrash/ServerCrash';
import AllProducts from '../pages/Products/AllProducts/AllProducts';
import PrivateRoute from './PrivateRoute';
import ProductDetails from '../pages/Products/ProductDetails/ProductDetails';
import BookingProduct from '../pages/Products/BookingProduct/BookingProduct';

export const router = createBrowserRouter([
  // MainLayout Routes
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: 'auth/register', Component: Register },
      { path: 'auth/login', Component: Login },
      { path: 'all-products', Component: AllProducts },
      {
        path: 'product-details/:id',
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
      },
      {
        path: 'booking/:id',
        element: (
          <PrivateRoute>
            <BookingProduct />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Error Routes
  {
    path: 'error',
    Component: ErrorLayout,
    children: [
      { path: 'unauthorized', Component: Unauthorized },
      { path: 'not-found', Component: NotFound },
      { path: 'server-crash', Component: ServerCrash },
    ],
  },
]);
