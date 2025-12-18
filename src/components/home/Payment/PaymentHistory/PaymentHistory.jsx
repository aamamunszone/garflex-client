import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';
import Loader from '../../../common/Loader/Loader';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['my-payments', user?.email],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-8">
      <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter">
        My Payment History
      </h2>
      <div className="overflow-x-auto rounded-3xl border border-base-300">
        <table className="table table-zebra w-full font-semibold">
          <thead className="bg-base-200 text-base-content uppercase">
            <tr>
              <th>#</th>
              <th>Txn ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, idx) => (
              <tr key={p._id}>
                <td>{idx + 1}</td>
                <td className="font-mono text-primary text-xs">
                  {p.transactionId}
                </td>
                <td className="text-lg">৳ {p.amount}</td>
                <td className="text-base-content/50">
                  {new Date(p.paidAt).toLocaleDateString()}
                </td>
                <td>
                  <span className="badge badge-success font-bold px-4 py-3">
                    PAID
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PaymentHistory;
