import React from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import {
  MdDashboard,
  MdPeople,
  MdInventory,
  MdShoppingCart,
  MdAttachMoney,
  MdPendingActions,
  MdCheckCircle,
  MdLocalShipping,
  MdTrendingUp,
} from 'react-icons/md';
import { FiPackage, FiUser, FiClock } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useRole from '../../../hooks/useRole';
import useAuth from '../../../hooks/useAuth';
import Loader from '../../../components/common/Loader/Loader';
import Container from '../../../components/common/Container/Container';

// Chart colors matching the project theme
const COLORS = {
  primary: '#570df8',
  secondary: '#f000b8',
  accent: '#37cdbe',
  success: '#36d399',
  warning: '#fbbd23',
  error: '#f87272',
  info: '#3abff8',
};

const PIE_COLORS = [
  '#570df8',
  '#f000b8',
  '#37cdbe',
  '#36d399',
  '#fbbd23',
  '#f87272',
];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 p-3 rounded-xl shadow-lg border border-base-300">
        <p className="font-bold text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}:{' '}
            {typeof entry.value === 'number' && entry.name.includes('Revenue')
              ? `৳${entry.value.toLocaleString()}`
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Home = () => {
  const { role, roleLoading } = useRole();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch dashboard stats based on role
  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-stats', role],
    enabled: !!role,
    queryFn: async () => {
      const endpoint =
        role === 'Admin'
          ? '/admin/dashboard-stats'
          : role === 'Manager'
          ? '/manager/dashboard-stats'
          : '/buyer/dashboard-stats';
      const res = await axiosSecure.get(endpoint);
      return res.data?.data;
    },
  });

  if (roleLoading || isLoading) return <Loader />;

  // Render based on role
  if (role === 'Admin')
    return <AdminDashboard stats={stats} user={user} refetch={refetch} />;
  if (role === 'Manager')
    return <ManagerDashboard stats={stats} user={user} refetch={refetch} />;
  if (role === 'Buyer')
    return <BuyerDashboard stats={stats} user={user} refetch={refetch} />;

  return <Loader />;
};

// ==================== ADMIN DASHBOARD ====================
const AdminDashboard = ({ stats, user, refetch }) => {
  const overviewCards = [
    {
      label: 'Total Users',
      value: stats?.overview?.totalUsers || 0,
      icon: MdPeople,
      color: 'primary',
    },
    {
      label: 'Total Products',
      value: stats?.overview?.totalProducts || 0,
      icon: MdInventory,
      color: 'secondary',
    },
    {
      label: 'Total Orders',
      value: stats?.overview?.totalOrders || 0,
      icon: MdShoppingCart,
      color: 'accent',
    },
    {
      label: 'Total Revenue',
      value: `৳${(stats?.overview?.totalRevenue || 0).toLocaleString()}`,
      icon: MdAttachMoney,
      color: 'success',
    },
  ];

  const orderStatusData = [
    { name: 'Pending', value: stats?.ordersByStatus?.pending || 0 },
    { name: 'Approved', value: stats?.ordersByStatus?.approved || 0 },
    { name: 'Shipped', value: stats?.ordersByStatus?.shipped || 0 },
    { name: 'Delivered', value: stats?.ordersByStatus?.delivered || 0 },
    { name: 'Rejected', value: stats?.ordersByStatus?.rejected || 0 },
  ];

  const userRoleData = [
    { name: 'Admins', value: stats?.usersByRole?.admin || 0 },
    { name: 'Managers', value: stats?.usersByRole?.manager || 0 },
    { name: 'Buyers', value: stats?.usersByRole?.buyer || 0 },
  ];

  const monthlyData = (stats?.monthlyOrders || []).map((item) => ({
    month: formatMonth(item._id),
    orders: item.orders,
    revenue: item.revenue,
  }));

  return (
    <div className="pb-10 min-h-screen bg-base-200/30">
      <Container>
        {/* Header */}
        <DashboardHeader
          title="Admin Dashboard"
          subtitle="Complete overview of your platform"
          icon={MdDashboard}
          user={user}
          refetch={refetch}
        />

        {/* Overview Stats */}
        <StatsGrid cards={overviewCards} />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Orders & Revenue */}
          <ChartCard title="Monthly Orders & Revenue" icon={MdTrendingUp}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.success}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.success}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  name="Orders"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.success}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue (৳)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Order Status Distribution */}
          <ChartCard title="Order Status Distribution" icon={FiPackage}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Users by Role */}
          <ChartCard title="Users by Role" icon={MdPeople}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userRoleData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill={COLORS.primary}
                  radius={[0, 8, 8, 0]}
                  name="Users"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Products by Category */}
          <ChartCard
            title="Products by Category"
            icon={MdInventory}
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={(stats?.productsByCategory || [])
                  .slice(0, 6)
                  .map((item) => ({
                    name: item._id || 'Other',
                    count: item.count,
                  }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill={COLORS.secondary}
                  radius={[8, 8, 0, 0]}
                  name="Products"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Orders */}
        <RecentOrdersTable
          orders={stats?.recentOrders || []}
          title="Recent Orders"
        />
      </Container>
    </div>
  );
};

// ==================== MANAGER DASHBOARD ====================
const ManagerDashboard = ({ stats, user, refetch }) => {
  const overviewCards = [
    {
      label: 'My Products',
      value: stats?.overview?.myProducts || 0,
      icon: MdInventory,
      color: 'primary',
    },
    {
      label: 'Pending Orders',
      value: stats?.overview?.pendingOrders || 0,
      icon: MdPendingActions,
      color: 'warning',
    },
    {
      label: 'Approved Orders',
      value: stats?.overview?.approvedOrders || 0,
      icon: MdCheckCircle,
      color: 'success',
    },
    {
      label: 'Shipped Orders',
      value: stats?.overview?.shippedOrders || 0,
      icon: MdLocalShipping,
      color: 'info',
    },
  ];

  const orderStatusData = [
    { name: 'Pending', value: stats?.ordersByStatus?.pending || 0 },
    { name: 'Approved', value: stats?.ordersByStatus?.approved || 0 },
    { name: 'Shipped', value: stats?.ordersByStatus?.shipped || 0 },
    { name: 'Delivered', value: stats?.ordersByStatus?.delivered || 0 },
  ];

  const monthlyData = (stats?.monthlyOrders || []).map((item) => ({
    month: formatMonth(item._id),
    orders: item.orders,
    revenue: item.revenue,
  }));

  return (
    <div className="pb-10 min-h-screen bg-base-200/30">
      <Container>
        {/* Header */}
        <DashboardHeader
          title="Manager Dashboard"
          subtitle="Manage products and process orders"
          icon={MdDashboard}
          user={user}
          refetch={refetch}
        />

        {/* Overview Stats */}
        <StatsGrid cards={overviewCards} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Orders Trend */}
          <ChartCard title="Monthly Orders Trend" icon={MdTrendingUp}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.success}
                  strokeWidth={3}
                  dot={{ fill: COLORS.success, strokeWidth: 2, r: 5 }}
                  name="Revenue (৳)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Order Status Distribution */}
          <ChartCard title="Order Status Overview" icon={FiPackage}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* My Products by Category */}
        {stats?.productsByCategory?.length > 0 && (
          <div className="mb-8">
            <ChartCard title="My Products by Category" icon={MdInventory}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={(stats?.productsByCategory || []).map((item) => ({
                    name: item._id || 'Other',
                    count: item.count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill={COLORS.secondary}
                    radius={[8, 8, 0, 0]}
                    name="Products"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {/* Recent Pending Orders */}
        <RecentOrdersTable
          orders={stats?.recentPendingOrders || []}
          title="Recent Pending Orders"
        />
      </Container>
    </div>
  );
};

// ==================== BUYER DASHBOARD ====================
const BuyerDashboard = ({ stats, user, refetch }) => {
  const overviewCards = [
    {
      label: 'My Orders',
      value: stats?.overview?.myOrders || 0,
      icon: FiPackage,
      color: 'primary',
    },
    {
      label: 'Total Spent',
      value: `৳${(stats?.overview?.totalSpent || 0).toLocaleString()}`,
      icon: MdAttachMoney,
      color: 'success',
    },
    {
      label: 'Pending Orders',
      value: stats?.overview?.pendingOrders || 0,
      icon: MdPendingActions,
      color: 'warning',
    },
    {
      label: 'Delivered',
      value: stats?.overview?.deliveredOrders || 0,
      icon: MdCheckCircle,
      color: 'accent',
    },
  ];

  const orderStatusData = [
    { name: 'Pending', value: stats?.ordersByStatus?.pending || 0 },
    { name: 'Approved', value: stats?.ordersByStatus?.approved || 0 },
    { name: 'Shipped', value: stats?.ordersByStatus?.shipped || 0 },
    { name: 'Delivered', value: stats?.ordersByStatus?.delivered || 0 },
  ];

  const monthlyData = (stats?.monthlyOrders || []).map((item) => ({
    month: formatMonth(item._id),
    orders: item.orders,
    spent: item.spent,
  }));

  return (
    <div className="pb-10 min-h-screen bg-base-200/30">
      <Container>
        {/* Header */}
        <DashboardHeader
          title="My Dashboard"
          subtitle="Track your orders and spending"
          icon={MdDashboard}
          user={user}
          refetch={refetch}
        />

        {/* Overview Stats */}
        <StatsGrid cards={overviewCards} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Orders & Spending */}
          <ChartCard title="My Order History" icon={MdTrendingUp}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="colorBuyerOrders"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.success}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.success}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorBuyerOrders)"
                  name="Orders"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="spent"
                  stroke={COLORS.success}
                  fillOpacity={1}
                  fill="url(#colorSpent)"
                  name="Spent (৳)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Order Status */}
          <ChartCard title="Order Status" icon={FiPackage}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Spending by Category */}
        {stats?.ordersByCategory?.length > 0 && (
          <div className="mb-8">
            <ChartCard title="Spending by Category" icon={MdInventory}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={(stats?.ordersByCategory || []).map((item) => ({
                    name: item._id || 'Other',
                    count: item.count,
                    spent: item.spent,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="spent"
                    fill={COLORS.success}
                    radius={[8, 8, 0, 0]}
                    name="Spent (৳)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {/* Recent Orders */}
        <RecentOrdersTable
          orders={stats?.recentOrders || []}
          title="My Recent Orders"
          showUser={false}
        />
      </Container>
    </div>
  );
};

// ==================== SHARED COMPONENTS ====================

// Dashboard Header Component
const DashboardHeader = ({ title, subtitle, icon: Icon, user, refetch }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 pt-6"
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-linear-to-br from-primary to-secondary text-white rounded-2xl shadow-lg shadow-primary/20">
          <Icon className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          <p className="opacity-60 font-medium text-sm md:text-base">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-base-100 rounded-xl border border-base-300">
          <span className="text-sm opacity-60">Welcome,</span>
          <span className="font-bold text-primary">
            {user?.displayName?.split(' ')[0] || 'User'}
          </span>
        </div>
        <button
          onClick={() => refetch()}
          className="btn btn-outline btn-primary rounded-xl"
        >
          Refresh
        </button>
      </div>
    </div>
  </motion.div>
);

// Stats Grid Component
const StatsGrid = ({ cards }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {cards.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-sm hover:shadow-md transition-all group"
      >
        <div
          className={`p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform ${
            item.color === 'warning'
              ? 'bg-warning/10'
              : item.color === 'success'
              ? 'bg-success/10'
              : item.color === 'primary'
              ? 'bg-primary/10'
              : item.color === 'secondary'
              ? 'bg-secondary/10'
              : item.color === 'accent'
              ? 'bg-accent/10'
              : item.color === 'info'
              ? 'bg-info/10'
              : 'bg-blue-500/10'
          }`}
        >
          <item.icon
            className={`text-2xl ${
              item.color === 'warning'
                ? 'text-warning'
                : item.color === 'success'
                ? 'text-success'
                : item.color === 'primary'
                ? 'text-primary'
                : item.color === 'secondary'
                ? 'text-secondary'
                : item.color === 'accent'
                ? 'text-accent'
                : item.color === 'info'
                ? 'text-info'
                : 'text-blue-500'
            }`}
          />
        </div>
        <div className="text-2xl font-black">{item.value}</div>
        <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">
          {item.label}
        </div>
      </motion.div>
    ))}
  </div>
);

// Chart Card Component
const ChartCard = ({ title, icon: Icon, children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-base-100 rounded-3xl border border-base-300 shadow-sm p-6 ${className}`}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-primary/10 rounded-xl">
        <Icon className="text-xl text-primary" />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    {children}
  </motion.div>
);

// Recent Orders Table Component
const RecentOrdersTable = ({ orders, title, showUser = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden"
  >
    <div className="p-6 border-b border-base-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <MdShoppingCart className="text-xl text-primary" />
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead className="bg-base-200/50 text-base-content/70">
          <tr className="text-sm uppercase tracking-wider">
            <th className="py-4 px-6">Order ID</th>
            <th>Product</th>
            {showUser && <th>Customer</th>}
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-200">
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-base-200/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-base-200 rounded-lg">
                      <FiPackage className="text-lg text-primary" />
                    </div>
                    <span className="font-bold text-sm">
                      #GF-{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="font-bold text-sm truncate max-w-[150px]">
                    {order.productTitle}
                  </div>
                </td>
                {showUser && (
                  <td>
                    <div className="flex items-center gap-2">
                      <FiUser className="text-xs opacity-50" />
                      <span className="text-sm">
                        {order.userName || 'Guest'}
                      </span>
                    </div>
                  </td>
                )}
                <td className="font-bold text-primary">
                  ৳{order.orderPrice?.toLocaleString()}
                </td>
                <td>
                  <span
                    className={`badge border-none py-2 px-3 rounded-lg font-bold text-xs ${
                      order.orderStatus === 'Pending'
                        ? 'bg-warning/10 text-warning'
                        : order.orderStatus === 'Approved'
                        ? 'bg-success/10 text-success'
                        : order.orderStatus === 'Rejected'
                        ? 'bg-error/10 text-error'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-info/10 text-info'
                        : order.orderStatus === 'Delivered'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-base-200'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <div className="text-xs opacity-60 flex items-center gap-1">
                    <FiClock />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showUser ? 6 : 5} className="text-center py-12">
                <FiPackage className="text-5xl opacity-10 mx-auto mb-3" />
                <p className="text-sm opacity-40 font-medium">
                  No orders found
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// Helper function to format month
const formatMonth = (dateStr) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[parseInt(month) - 1]} ${year?.slice(2)}`;
};

export default Home;
