import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import {
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaEuroSign,
  FaChartLine,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaFileAlt,
} from "react-icons/fa";
import ReportsModal from "../components/ReportsModal";

// Custom color palette based on client's requirements
const colors = {
  lightPink: "#EDDCD9",
  offWhite: "#F2EBE9",
  brightPink: "#DE5499",
  darkTeal: "#264143",
  orange: "#E9944C",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentUsers: [],
    monthlyRevenue: [],
    topProducts: [],
    orderStatuses: {},
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateRange, setDateRange] = useState("30"); // days
  const [showReportsModal, setShowReportsModal] = useState(false);

  useEffect(() => {
    // For testing purposes - remove this in production
    if (!localStorage.getItem("token")) {
      localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg3N2VjYTZmNzEzY2U5NGRlZGI3NmEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MzcxMDI5OSwiZXhwIjoxNzUzNzk2Njk5fQ.rl94go2VdicRDaxdLWhrWIetQf5-y-bcsm4mCS00dEw"
      );
    }
    fetchDashboardData();
  }, [dateRange]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        window.location.href = "/login";
        return;
      }

      // Fetch all data in parallel
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        apiFetch("/users"),
        apiFetch("/orders"),
        apiFetch("/products"),
      ]);

      // Check if responses are ok
      if (!usersRes.ok || !ordersRes.ok || !productsRes.ok) {
        if (
          usersRes.status === 401 ||
          ordersRes.status === 401 ||
          productsRes.status === 401
        ) {
          console.log("Unauthorized, redirecting to login");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        console.log(
          "Response status:",
          usersRes.status,
          ordersRes.status,
          productsRes.status
        );
        throw new Error("Failed to fetch data");
      }

      const users = await usersRes.json();
      const orders = await ordersRes.json();
      const products = await productsRes.json();

      // Calculate statistics
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      // Calculate monthly revenue (last 6 months)
      const monthlyRevenue = calculateMonthlyRevenue(orders);

      // Calculate order statuses
      const orderStatuses = calculateOrderStatuses(orders);

      // Calculate top products
      const topProducts = calculateTopProducts(orders, products);

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
        recentOrders: orders.slice(-5).reverse(),
        recentUsers: users.slice(-5).reverse(),
        monthlyRevenue,
        orderStatuses,
        topProducts,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // If it's a JSON parse error, it might be an HTML response (login page)
      if (err.message.includes("Unexpected token '<'")) {
        console.log("Received HTML response, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  const calculateMonthlyRevenue = (orders) => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      });
      const revenue = monthOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );
      months.push({ month: monthName, revenue });
    }
    return months;
  };

  const calculateOrderStatuses = (orders) => {
    const statuses = {};
    orders.forEach((order) => {
      const status = order.status || "Unknown";
      statuses[status] = (statuses[status] || 0) + 1;
    });
    return statuses;
  };

  const calculateTopProducts = (orders, products) => {
    const productSales = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const productId = item.productId;
        productSales[productId] =
          (productSales[productId] || 0) + (item.quantity || 1);
      });
    });

    return products
      .map((product) => ({
        ...product,
        sales: productSales[product._id] || 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const StatCard = ({ title, value, icon, trend, color, bgColor }) => (
    <div
      className={`${bgColor} p-6 rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
              <span className="ml-1">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded-full ${color
            .replace("border-", "bg-")
            .replace("-500", "-100")}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const RevenueChart = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Revenue Trend</h3>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
      <div className="h-64 flex items-end justify-between space-x-2">
        {stats.monthlyRevenue.map((item, index) => {
          const maxRevenue = Math.max(
            ...stats.monthlyRevenue.map((m) => m.revenue)
          );
          const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${height}%`,
                  backgroundColor: colors.brightPink,
                  minHeight: "20px",
                }}
              />
              <p className="text-xs text-gray-600 mt-2">{item.month}</p>
              <p className="text-xs font-medium text-gray-900">
                €{item.revenue}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const OrderStatusChart = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Order Status Distribution
      </h3>
      <div className="space-y-4">
        {Object.entries(stats.orderStatuses).map(([status, count], index) => {
          const total = Object.values(stats.orderStatuses).reduce(
            (sum, val) => sum + val,
            0
          );
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const colorsArray = [
            colors.brightPink,
            colors.orange,
            colors.darkTeal,
            colors.lightPink,
          ];
          const color = colorsArray[index % colorsArray.length];

          return (
            <div key={status} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {status}
                </span>
                <span className="text-sm text-gray-500">{count} orders</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TopProductsChart = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {stats.topProducts.map((product, index) => (
          <div
            key={product._id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: colors.brightPink }}
              >
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">€{product.price}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {product.sales} sold
              </p>
              <p className="text-sm text-gray-500">
                €{(product.sales * product.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers className="text-white" size={24} />}
          color="border-blue-500"
          bgColor="bg-white"
          trend={12}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart className="text-white" size={24} />}
          color="border-green-500"
          bgColor="bg-white"
          trend={8}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<FaBox className="text-white" size={24} />}
          color="border-purple-500"
          bgColor="bg-white"
          trend={-3}
        />
        <StatCard
          title="Total Revenue"
          value={`€${stats.totalRevenue.toFixed(2)}`}
          icon={<FaEuroSign className="text-white" size={24} />}
          color="border-yellow-500"
          bgColor="bg-white"
          trend={15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrderStatusChart />
      </div>

      {/* Top Products and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart />

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {stats.recentOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lightPink }}
                >
                  <FaShoppingCart
                    size={14}
                    style={{ color: colors.darkTeal }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New order #{order._id.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    €{order.totalPrice} •{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "پرداخت شده"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
      fetchOrders();
    }, []);

    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        const res = await apiFetch("/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
      try {
        await apiFetch(`/orders/${orderId}`, {
          method: "PUT",
          body: JSON.stringify({ status: newStatus }),
        });
        fetchOrders();
      } catch (err) {
        console.error("Error updating order:", err);
      }
    };

    const filteredOrders =
      filter === "all"
        ? orders
        : orders.filter((order) => order.status === filter);

    if (ordersLoading)
      return (
        <div className="flex items-center justify-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: colors.brightPink }}
          ></div>
        </div>
      );

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Order Management
            </h3>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Orders</option>
                <option value="در حال پردازش">Processing</option>
                <option value="پرداخت شده">Paid</option>
                <option value="ارسال شده">Shipped</option>
                <option value="تحویل شده">Delivered</option>
                <option value="لغو شده">Cancelled</option>
              </select>
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: colors.brightPink }}
              >
                <FaDownload size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    €{order.totalPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="در حال پردازش">Processing</option>
                      <option value="پرداخت شده">Paid</option>
                      <option value="ارسال شده">Shipped</option>
                      <option value="تحویل شده">Delivered</option>
                      <option value="لغو شده">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <FaEye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <FaEdit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const UsersView = () => {
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      fetchUsers();
    }, []);

    async function fetchUsers() {
      setUsersLoading(true);
      try {
        const res = await apiFetch("/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setUsersLoading(false);
      }
    }

    const filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (usersLoading)
      return (
        <div className="flex items-center justify-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: colors.brightPink }}
          ></div>
        </div>
      );

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              User Management
            </h3>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: colors.brightPink }}
              >
                <FaDownload size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <FaEye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <FaEdit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: colors.brightPink }}
          ></div>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access the admin dashboard.
          </p>
          <a
            href="/login"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: colors.brightPink }}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto p-6"
      style={{ backgroundColor: colors.offWhite }}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: colors.darkTeal }}>
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Complete store management and analytics
          </p>
        </div>
        <button
          onClick={() => setShowReportsModal(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: colors.orange }}
        >
          <FaFileAlt size={16} />
          <span>Generate Reports</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
            { id: "orders", label: "Orders", icon: <FaShoppingCart /> },
            { id: "users", label: "Users", icon: <FaUsers /> },
            { id: "products", label: "Products", icon: <FaBox /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? `border-b-2 font-semibold`
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              style={
                activeTab === tab.id
                  ? { borderColor: colors.brightPink, color: colors.brightPink }
                  : {}
              }
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "dashboard" && <DashboardView />}
      {activeTab === "orders" && <OrdersView />}
      {activeTab === "users" && <UsersView />}
      {activeTab === "products" && (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Product Management
          </h3>
          <p className="text-gray-600 mb-6">
            Go to the main admin panel to manage products.
          </p>
          <a
            href="/admin"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: colors.brightPink }}
          >
            <FaBox size={16} />
            <span>Manage Products</span>
          </a>
        </div>
      )}

      {/* Reports Modal */}
      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        data={stats}
      />
    </div>
  );
}
