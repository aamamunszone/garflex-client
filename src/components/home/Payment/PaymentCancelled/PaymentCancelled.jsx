import React from 'react';
import { Link } from 'react-router';
import { MdErrorOutline, MdArrowBack } from 'react-icons/md';

const PaymentCancelled = () => (
  <div className="min-h-[70vh] flex items-center justify-center p-6">
    <div className="text-center bg-base-100 border border-error/20 p-12 rounded-3xl shadow-lg">
      <MdErrorOutline className="text-8xl text-error mx-auto mb-4" />
      <h2 className="text-3xl font-black uppercase">Payment Cancelled</h2>
      <p className="text-base-content/60 my-4 max-w-sm">
        Transaction was not completed. You can try again from your orders
        dashboard.
      </p>
      <Link
        to="/dashboard/my-orders"
        className="btn btn-outline btn-error rounded-xl font-bold"
      >
        <MdArrowBack /> Go Back to Orders
      </Link>
    </div>
  </div>
);
export default PaymentCancelled;
