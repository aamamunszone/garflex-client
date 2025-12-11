import React from 'react';
import DotLoader from '../../common/Loader/DotLoader/DotLoader';

const WithDotLoaderButton = ({ children }) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <DotLoader />
      <span>{children}</span>
    </div>
  );
};

export default WithDotLoaderButton;
