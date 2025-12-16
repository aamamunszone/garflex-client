import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loader from '../components/common/Loader/Loader';
import NotFound from '../pages/Errors/NotFound/NotFound';

const ManagerRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loader />;
  }

  if (role !== 'Manager') {
    return <NotFound />;
  }

  return children;
};

export default ManagerRoute;
