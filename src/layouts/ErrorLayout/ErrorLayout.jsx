import React from 'react';
import { Outlet } from 'react-router';

const ErrorLayout = () => {
  return (
    <div>
      <h1>ErrorLayout</h1>
      <Outlet />
    </div>
  );
};

export default ErrorLayout;
