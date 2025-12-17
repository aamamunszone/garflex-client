import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdPeople,
  MdBlock,
  MdCheckCircle,
  MdSearch,
  MdAdminPanelSettings,
  MdDeleteOutline,
} from 'react-icons/md';
import { HiUserGroup } from 'react-icons/hi';
import { FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import { FaUserShield, FaUserEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';
import Loader from '../../../../components/common/Loader/Loader';
import Container from '../../../../components/common/Container/Container';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  // Modal States
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  // Fetch Users (GET)
  const {
    data: usersData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['manage-users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/manage-users');
      return res.data?.data || [];
    },
  });

  // Update Role/Status (PATCH)
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosSecure.patch(`/admin/users/role/${id}`, payload);
      return res.data?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['manage-users']);
      toast.success(data.message || 'User updated successfully!');
      closeModals();
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || 'Update failed!';
      toast.error(errMsg);
    },
  });

  // Delete User (DELETE)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/admin/users/${id}`);
      return res.data?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['manage-users']);
      Swal.fire(
        'Deleted!',
        data.message || 'User has been removed.',
        'success'
      );
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Delete failed!');
    },
  });

  // Logic: Filter Users
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(usersData)) return [];
    return usersData.filter((user) => {
      const userName = user?.name || '';
      const userEmail = user?.email || '';
      const userRole = user?.role || '';
      const userStatus = user?.status || '';

      const matchesSearch =
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === 'All' ||
        userRole.toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === 'All' ||
        userStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersData, searchQuery, roleFilter, statusFilter]);

  // Logic: Calculate Stats
  const stats = useMemo(() => {
    const defaultStats = {
      total: 0,
      admin: 0,
      manager: 0,
      buyer: 0,
      pending: 0,
      suspended: 0,
    };
    if (!Array.isArray(usersData)) return defaultStats;

    return usersData.reduce((acc, u) => {
      acc.total++;
      if (u.role === 'Admin') acc.admin++;
      if (u.role === 'Manager') acc.manager++;
      if (u.role === 'Buyer') acc.buyer++;
      if (u.status === 'Pending') acc.pending++;
      if (u.status === 'Suspended') acc.suspended++;
      return acc;
    }, defaultStats);
  }, [usersData]);

  // Handlers
  const closeModals = () => {
    setShowUpdateModal(false);
    setShowSuspendModal(false);
    setSelectedUser(null);
    setSuspendReason('');
  };

  const handleDelete = (user) => {
    if (user.email === currentUser?.email) {
      return toast.error(
        'Security Alert: You cannot delete your own admin account!'
      );
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `All data for ${user.name} will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete!',
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(user._id);
    });
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-10 text-center text-error">
        Failed to load users. Please refresh.
      </div>
    );

  return (
    <div className="pb-10 min-h-screen bg-base-200/30">
      <title>GarFlex | Administration - Manage Users</title>

      <Container>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary text-primary-content rounded-2xl shadow-lg shadow-primary/20">
                <MdAdminPanelSettings className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  User Management
                </h1>
                <p className="opacity-60 font-medium">
                  Control permissions and monitor user activities
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="btn btn-outline btn-primary rounded-xl"
            >
              Refresh Data
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[
            {
              label: 'Total Users',
              val: stats.total,
              color: 'primary',
              icon: HiUserGroup,
            },
            {
              label: 'Admins',
              val: stats.admin,
              color: 'error',
              icon: FaUserShield,
            },
            {
              label: 'Managers',
              val: stats.manager,
              color: 'secondary',
              icon: MdPeople,
            },
            {
              label: 'Buyers',
              val: stats.buyer,
              color: 'info',
              icon: MdPeople,
            },
            {
              label: 'Pending',
              val: stats.pending,
              color: 'warning',
              icon: FiUserCheck,
            },
            {
              label: 'Suspended',
              val: stats.suspended,
              color: 'secondary',
              icon: MdBlock,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className={`p-3 rounded-xl bg-${item.color}/10 w-fit mb-3 group-hover:scale-110 transition-transform`}
              >
                <item.icon className={`text-2xl text-${item.color}`} />
              </div>
              <div className="text-2xl font-black">{item.val}</div>
              <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters Wrapper */}
        <div className="bg-base-100 rounded-3xl border border-base-300 p-5 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-1/3">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input input-bordered w-full rounded-xl pl-12 bg-base-200/50 border-none focus:ring-2 ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3 w-full lg:w-1/3">
              <select
                className="select select-bordered bg-base-200 flex-1 cursor-pointer rounded-xl"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Buyer">Buyer</option>
              </select>
              <select
                className="select select-bordered bg-base-200 flex-1 cursor-pointer rounded-xl"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70">
                <tr>
                  <th className="py-5 px-6 w-1/3">User Profile</th>
                  <th>System Role</th>
                  <th>Current Status</th>
                  <th>Registration</th>
                  <th className="text-center">Administration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-base-200/30 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-2xl ring-2 ring-primary/10 ring-offset-2 ring-offset-base-100">
                              <img
                                src={
                                  user.photoURL ||
                                  user.image ||
                                  'https://i.ibb.co/mJR7z1C/avatar.png'
                                }
                                alt="User"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-base flex items-center gap-2">
                              {user.name}
                              {user.email === currentUser?.email && (
                                <span className="badge badge-primary rounded-full badge-xs py-2 px-2">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-xs opacity-50 font-medium">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm font-bold py-3 px-3 rounded-lg ${
                            user.role === 'Admin'
                              ? 'badge-info'
                              : user.role === 'Manager'
                              ? 'badge-secondary'
                              : 'badge-error'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div
                          className={`flex items-center gap-2 text-xs font-black uppercase tracking-tighter ${
                            user.status === 'Approved'
                              ? 'text-success'
                              : user.status === 'Suspended'
                              ? 'text-error'
                              : 'text-warning'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full animate-pulse bg-current" />
                          {user.status}
                        </div>
                      </td>
                      <td className="text-xs font-semibold opacity-60">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : 'N/A'}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUpdateModal(true);
                            }}
                            className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                            title="Edit Role"
                          >
                            <FaUserEdit className="text-lg" />
                          </button>

                          {/* Approve/Suspend Logic */}
                          {user.status === 'Approved' ? (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowSuspendModal(true);
                              }}
                              className="btn btn-square btn-ghost btn-sm text-warning hover:bg-warning/10"
                              title="Suspend User"
                            >
                              <MdBlock className="text-xl" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  id: user._id,
                                  payload: { status: 'Approved' },
                                })
                              }
                              className="btn btn-square btn-ghost btn-sm text-success hover:bg-success/10"
                              title="Approve User"
                            >
                              <MdCheckCircle className="text-xl" />
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(user)}
                            className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                            title="Delete User"
                          >
                            <MdDeleteOutline className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center">
                <FiUserX className="text-6xl opacity-10 mb-4" />
                <h3 className="text-xl font-bold opacity-30">
                  No match found for your filters
                </h3>
              </div>
            )}
          </div>
        </div>

        {/* Modal 1: Update Role */}
        <AnimatePresence>
          {showUpdateModal && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModals}
                className="absolute inset-0 bg-base-content/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-base-100 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm relative border border-base-300"
              >
                <h3 className="text-2xl font-black mb-2">Assign Role</h3>
                <p className="mb-6 opacity-60 text-sm">
                  Update permissions for <b>{selectedUser?.name}</b>
                </p>
                <div className="grid gap-3">
                  {['Buyer', 'Manager', 'Admin'].map((role) => (
                    <button
                      key={role}
                      disabled={
                        updateMutation.isPending || selectedUser?.role === role
                      }
                      onClick={() =>
                        updateMutation.mutate({
                          id: selectedUser._id,
                          payload: { role },
                        })
                      }
                      className={`btn btn-lg justify-start gap-4 normal-case rounded-2xl ${
                        selectedUser?.role === role
                          ? 'btn-primary'
                          : 'btn-ghost bg-base-200'
                      }`}
                    >
                      <FiShield /> {role}
                    </button>
                  ))}
                </div>
                <button
                  onClick={closeModals}
                  className="btn btn-ghost w-full mt-4"
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal 2: Suspend User */}
        <AnimatePresence>
          {showSuspendModal && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModals}
                className="absolute inset-0 bg-error/10 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-base-100 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative border border-error/20"
              >
                <div className="w-14 h-14 bg-error/10 text-error rounded-2xl flex items-center justify-center text-3xl mb-4">
                  <MdBlock />
                </div>
                <h3 className="text-2xl font-black mb-1">Suspend Account</h3>
                <p className="mb-6 opacity-60 text-sm">
                  Provide a reason for suspending <b>{selectedUser?.name}</b>
                </p>
                <textarea
                  className="textarea textarea-bordered w-full h-32 bg-base-200 border-none focus:ring-2 ring-error/20 resize-none p-4 rounded-2xl"
                  placeholder="e.g., Suspicious activity detected..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={closeModals}
                    className="btn btn-ghost rounded-xl"
                  >
                    Discard
                  </button>
                  <button
                    disabled={!suspendReason || updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedUser._id,
                        payload: { status: 'Suspended', suspendReason },
                      })
                    }
                    className="btn btn-error text-white rounded-xl shadow-lg shadow-error/30"
                  >
                    Confirm Suspend
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default ManageUsers;
