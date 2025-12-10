import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Home from '../pages/Home/Home';
import Register from '../pages/Auth/Register/Register';
import Login from '../pages/Auth/Login/Login';

export const router = createBrowserRouter([
  // MainLayout Routes
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: 'auth/register', Component: Register },
      { path: 'auth/login', Component: Login },
    ],
  },
]);
