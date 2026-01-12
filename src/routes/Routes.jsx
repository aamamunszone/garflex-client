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
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import DashboardHome from '../pages/Dashboard/Home/Home';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers/ManageUsers';
import AllProductsForReview from '../pages/Dashboard/Admin/AllProductsForReview/AllProductsForReview';
import AllOrders from '../pages/Dashboard/Admin/AllOrders/AllOrders';
import AdminProfile from '../pages/Dashboard/Admin/AdminProfile/AdminProfile';
import AddProduct from '../pages/Dashboard/Manager/AddProduct/AddProduct';
import ManageProducts from '../pages/Dashboard/Manager/ManageProducts/ManageProducts';
import PendingOrders from '../pages/Dashboard/Manager/PendingOrders/PendingOrders';
import ApprovedOrders from '../pages/Dashboard/Manager/ApprovedOrders/ApprovedOrders';
import ManagerProfile from '../pages/Dashboard/Manager/ManagerProfile/ManagerProfile';
import MyOrders from '../pages/Dashboard/Buyer/MyOrders/MyOrders';
import TrackOrder from '../pages/Dashboard/Buyer/TrackOrder/TrackOrder';
import BuyerProfile from '../pages/Dashboard/Buyer/BuyerProfile/BuyerProfile';
import AdminRoute from './AdminRoute';
import ManagerRoute from './ManagerRoute';
import BuyerRoute from './BuyerRoute';
import Services from '../pages/Services/Services';
import AboutUs from '../pages/AboutUs/AboutUs';
import Contact from '../pages/Contact/Contact';
import OrderDetails from '../pages/Dashboard/Admin/OrderDetails/OrderDetails';
import Payment from '../pages/Payment/Payment';
import PaymentSuccess from '../components/home/Payment/PaymentSuccess/PaymentSuccess';
import PaymentCancelled from '../components/home/Payment/PaymentCancelled/PaymentCancelled';
import PaymentHistory from '../components/home/Payment/PaymentHistory/PaymentHistory';

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
      { path: 'services', Component: Services },
      { path: 'about-us', Component: AboutUs },
      { path: 'contact', Component: Contact },
      {
        path: 'product-details/:id',
        Component: ProductDetails,
      },
      {
        path: 'booking/:id',
        element: (
          <PrivateRoute>
            <BookingProduct />
          </PrivateRoute>
        ),
      },
      {
        path: '/buyer/payment/:parcelId',
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
    ],
  },

  // DashboardLayout Routes
  {
    path: 'dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashboardHome />
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-users',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'all-products',
        element: (
          <AdminRoute>
            <AllProductsForReview />
          </AdminRoute>
        ),
      },
      {
        path: 'all-orders',
        element: (
          <AdminRoute>
            <AllOrders />
          </AdminRoute>
        ),
      },
      {
        path: 'order-details/:orderId',
        element: (
          <AdminRoute>
            <OrderDetails />
          </AdminRoute>
        ),
      },
      {
        path: 'admin-profile',
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
      {
        path: 'add-product',
        element: (
          <ManagerRoute>
            <AddProduct />
          </ManagerRoute>
        ),
      },
      {
        path: 'manage-products',
        element: (
          <ManagerRoute>
            <ManageProducts />
          </ManagerRoute>
        ),
      },
      {
        path: 'pending-orders',
        element: (
          <ManagerRoute>
            <PendingOrders />
          </ManagerRoute>
        ),
      },
      {
        path: 'approved-orders',
        element: (
          <ManagerRoute>
            <ApprovedOrders />
          </ManagerRoute>
        ),
      },
      {
        path: 'manager-profile',
        element: (
          <ManagerRoute>
            <ManagerProfile />
          </ManagerRoute>
        ),
      },
      {
        path: 'my-orders',
        element: (
          <BuyerRoute>
            <MyOrders />
          </BuyerRoute>
        ),
      },
      {
        path: 'track-order/:orderId',
        element: (
          <BuyerRoute>
            <TrackOrder />
          </BuyerRoute>
        ),
      },
      {
        path: 'buyer-profile',
        element: (
          <BuyerRoute>
            <BuyerProfile />
          </BuyerRoute>
        ),
      },

      {
        path: 'payment-success',
        element: (
          <BuyerRoute>
            <PaymentSuccess />
          </BuyerRoute>
        ),
      },
      {
        path: 'payment-cancelled',
        element: (
          <BuyerRoute>
            <PaymentCancelled />
          </BuyerRoute>
        ),
      },
      {
        path: 'payment-history',
        element: (
          <BuyerRoute>
            <PaymentHistory />
          </BuyerRoute>
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
  {
    path: '*',
    Component: NotFound,
  },
]);
