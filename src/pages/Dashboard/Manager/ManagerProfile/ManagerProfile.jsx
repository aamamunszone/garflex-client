import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards } from 'swiper/modules';
import {
  MdVerified,
  MdLogout,
  MdOutlineMail,
  MdPhone,
  MdLocationOn,
  MdCalendarToday,
  MdAdminPanelSettings,
} from 'react-icons/md';
import { FiEdit2, FiActivity, FiShield, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/effect-cards';

import Container from '../../../../components/common/Container/Container';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import EditProfileModal from '../../../../components/dashboard/EditProfileModal/EditProfileModal';

const MyProfile = () => {
  const { user, signOutUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch user data from database
  const { data: userData, refetch } = useQuery({
    queryKey: ['user-profile', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/users/me');
      return res.data?.data;
    },
  });

  const handleLogOut = async () => {
    try {
      await signOutUser();
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch (error) {
      toast.error('Logout failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 md:py-12 transition-colors duration-300">
      <Container>
        {/* --- Top Action Bar --- */}
        <div className="flex justify-between items-center mb-10 px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              Manager Portal
            </h1>
          </div>
          <button
            onClick={handleLogOut}
            className="group flex items-center gap-2 bg-base-100 px-5 py-2.5 rounded-2xl shadow-sm border border-base-300 hover:bg-error hover:text-white transition-all duration-300 cursor-pointer"
          >
            <span className="font-bold text-sm">Sign Out</span>
            <MdLogout className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* --- LEFT: Floating Profile Card --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-base-100 rounded-[3rem] p-8 shadow-2xl shadow-primary/5 border border-base-300 text-center relative overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-primary/10 to-transparent"></div>

              <div className="relative pt-4">
                <div className="relative inline-block group">
                  <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden border-4 border-base-100 shadow-xl mx-auto">
                    <img
                      src={
                        user?.photoURL ||
                        'https://i.ibb.co/3S3s8Vj/user-placeholder.png'
                      }
                      alt="Manager"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-base-100">
                    <MdVerified size={20} />
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-black text-base-content leading-tight">
                    {user?.displayName || 'GarFlex Manager'}
                  </h2>
                  <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] mt-1">
                    Lead Store Manager
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between bg-base-200 p-4 rounded-2xl">
                    <span className="text-xs font-black opacity-40 uppercase">
                      Status
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>{' '}
                      Active Now
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-base-200 p-4 rounded-2xl">
                    <span className="text-xs font-black opacity-40 uppercase">
                      Efficiency
                    </span>
                    <span className="text-sm font-black text-primary">
                      94.8%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn btn-primary btn-block rounded-2xl mt-8 shadow-lg shadow-primary/20 gap-2 cursor-pointer border-none"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: Information & Dynamic Content --- */}
          <div className="lg:col-span-8 space-y-8">
            {/* Contact & Bio Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                    <MdAdminPanelSettings size={24} />
                  </div>
                  <h3 className="font-black text-lg">Work Identity</h3>
                </div>
                <div className="space-y-4">
                  <DetailItem
                    icon={<MdOutlineMail />}
                    label="Corporate Email"
                    value={user?.email}
                  />
                  <DetailItem
                    icon={<MdPhone />}
                    label="Personal Line"
                    value="+880 1789-456123"
                  />
                  <DetailItem
                    icon={<MdLocationOn />}
                    label="Warehouse"
                    value="Zone-B, Export Processing Zone"
                  />
                </div>
              </div>

              {/* Swiper Cards for Statistics/Achievements */}
              <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <FiActivity className="text-2xl" />
                    <h3 className="font-bold text-lg">Performance Insights</h3>
                  </div>
                  <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    modules={[EffectCards, Autoplay]}
                    autoplay={{ delay: 2500 }}
                    className="w-full max-w-60"
                  >
                    <SwiperSlide className="bg-white text-primary p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
                      <h4 className="text-3xl font-black">120</h4>
                      <p className="text-xs font-bold uppercase opacity-60">
                        Orders Today
                      </p>
                    </SwiperSlide>
                    <SwiperSlide className="bg-warning text-neutral p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
                      <h4 className="text-3xl font-black">04</h4>
                      <p className="text-xs font-bold uppercase opacity-60">
                        Pending QC
                      </p>
                    </SwiperSlide>
                    <SwiperSlide className="bg-base-content text-base-100 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
                      <h4 className="text-3xl font-black">2.5k</h4>
                      <p className="text-xs font-bold uppercase opacity-60">
                        Total Units
                      </p>
                    </SwiperSlide>
                  </Swiper>
                </div>
                {/* Decorative Circle */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </div>
            </motion.div>

            {/* Quick Actions & Security */}
            <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-2 italic">
                  <FiShield className="text-primary" /> Security & Policy
                </h3>
                <span className="text-[10px] bg-base-200 px-3 py-1 rounded-full font-black opacity-50 uppercase tracking-widest">
                  Last Auth: 2h ago
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ActionButton
                  icon={<MdCalendarToday />}
                  label="Schedules"
                  color="text-info"
                />
                <ActionButton
                  icon={<FiSettings />}
                  label="Preferences"
                  color="text-warning"
                />
                <ActionButton
                  icon={<MdAdminPanelSettings />}
                  label="Auth Logs"
                  color="text-secondary"
                />
              </div>

              <div className="mt-8 p-6 bg-base-200 rounded-4xl border border-dashed border-base-300">
                <p className="text-sm font-medium opacity-60 leading-relaxed">
                  "As a manager at{' '}
                  <span className="text-primary font-bold">GarFlex</span>, your
                  role is pivotal in ensuring quality control and timely
                  delivery. Always maintain the standard of operations."
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            user={user}
            userData={userData}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              refetch();
              setShowEditModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Reusable Small Components ---
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="text-primary opacity-60 group-hover:opacity-100 transition-opacity">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black uppercase opacity-40 tracking-tighter mb-0.5">
        {label}
      </p>
      <p className="text-sm font-bold text-base-content/80 break-all">
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

const ActionButton = ({ icon, label, color }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-base-200/50 rounded-3xl border border-base-300 hover:border-primary/40 hover:bg-base-100 transition-all cursor-pointer group">
    <div className={`${color} mb-3 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="text-xs font-black uppercase opacity-60">{label}</span>
  </div>
);

export default MyProfile;
