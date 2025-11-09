import React, { useEffect, useState } from "react";
import api from "../../config/api";
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ icon, title, value, color, trend, subtitle }) => (
  <div
    className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${color} relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-white bg-opacity-20">{icon}</div>
        {trend && (
          <div className="flex items-center text-white text-sm">
            <TrendingUp size={16} className="mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-white text-opacity-80 text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

const QuickActionCard = ({ icon, title, description, link, color }) => (
  <Link to={link} className="block">
    <div
      className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${color} group cursor-pointer`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-white text-opacity-80 text-sm">{description}</p>
        </div>
        <div className="text-white group-hover:translate-x-1 transition-transform">
          →
        </div>
      </div>
    </div>
  </Link>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
      <Activity className="text-gray-400" size={24} />
    </div>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className={`p-2 rounded-full ${activity.color}`}>
            {activity.icon}
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-medium">{activity.title}</p>
            <p className="text-gray-500 text-sm">{activity.description}</p>
          </div>
          <div className="text-gray-400 text-sm">{activity.time}</div>
        </div>
      ))}
    </div>
  </div>
);

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (localStorage.token) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorage.token}`;
      }
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);

        // Mock recent activities - in real app, fetch from API
        setRecentActivities([
          {
            icon: <Users size={16} className="text-white" />,
            title: "New User Registration",
            description: "John Doe registered for internship",
            time: "2 hours ago",
            color: "bg-blue-500",
          },
          {
            icon: <Briefcase size={16} className="text-white" />,
            title: "Internship Created",
            description: "Web Development internship posted",
            time: "4 hours ago",
            color: "bg-green-500",
          },
          {
            icon: <DollarSign size={16} className="text-white" />,
            title: "Payment Received",
            description: "₹149 payment for internship",
            time: "6 hours ago",
            color: "bg-yellow-500",
          },
          {
            icon: <Calendar size={16} className="text-white" />,
            title: "Meeting Scheduled",
            description: "Team meeting for next week",
            time: "1 day ago",
            color: "bg-purple-500",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <StatCard
                icon={<Users size={28} className="text-white" />}
                title="Total Users"
                value={stats.totalUsers ?? 0}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
                trend="+12%"
                subtitle="Active this month"
              />
              <StatCard
                icon={<Briefcase size={28} className="text-white" />}
                title="Total Internships"
                value={stats.totalInternships ?? 0}
                color="bg-gradient-to-br from-green-500 to-green-600"
                trend="+5%"
                subtitle="Available positions"
              />
              <StatCard
                icon={<Calendar size={28} className="text-white" />}
                title="Total Meetings"
                value={stats.totalMeetings ?? 0}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
                trend="+8%"
                subtitle="Scheduled this week"
              />
              <StatCard
                icon={<DollarSign size={28} className="text-white" />}
                title="Revenue"
                value={`₹${(
                  stats.totalTransactionAmount ?? 0
                ).toLocaleString()}`}
                color="bg-gradient-to-br from-yellow-500 to-orange-500"
                trend="+15%"
                subtitle="This month"
              />
              <StatCard
                icon={<TrendingUp size={28} className="text-white" />}
                title="Revenue Growth"
                value="₹8,149"
                color="bg-gradient-to-br from-emerald-500 to-green-600"
                trend="+25%"
                subtitle="Increased user amount"
              />
              <StatCard
                icon={<FileText size={28} className="text-white" />}
                title="Applications"
                value={stats.totalRegistrations ?? 0}
                color="bg-gradient-to-br from-pink-500 to-pink-600"
                trend="+20%"
                subtitle="Total registrations"
              />
              <StatCard
                icon={<CheckCircle2 size={28} className="text-white" />}
                title="Approved"
                value={stats.totalTransactions ?? 0}
                color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                trend="+10%"
                subtitle="Successful applications"
              />
              <StatCard
                icon={<AlertCircle size={28} className="text-white" />}
                title="Pending"
                value={
                  (stats.totalRegistrations ?? 0) -
                  (stats.totalTransactions ?? 0)
                }
                color="bg-gradient-to-br from-red-500 to-red-600"
                trend="-5%"
                subtitle="Awaiting approval"
              />
              <StatCard
                icon={<BarChart3 size={28} className="text-white" />}
                title="Success Rate"
                value={`${
                  stats.totalRegistrations
                    ? Math.round(
                        ((stats.totalTransactions ?? 0) /
                          stats.totalRegistrations) *
                          100
                      )
                    : 0
                }%`}
                color="bg-gradient-to-br from-teal-500 to-teal-600"
                trend="+3%"
                subtitle="Approval rate"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <QuickActionCard
                icon={<Plus size={24} className="text-white" />}
                title="Add Internship"
                description="Create new internship opportunities"
                link="/admin-dashboard/add-internship"
                color="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              />
              <QuickActionCard
                icon={<Users size={24} className="text-white" />}
                title="Manage Users"
                description="View and manage user accounts"
                link="/admin-dashboard/users"
                color="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              />
              <QuickActionCard
                icon={<Calendar size={24} className="text-white" />}
                title="Schedule Meeting"
                description="Organize team meetings and events"
                link="/admin-dashboard/manage-meetings"
                color="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              />
              <QuickActionCard
                icon={<FileText size={24} className="text-white" />}
                title="View Applications"
                description="Review internship applications"
                link="/admin-dashboard/internship-registrations"
                color="bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              />
              <QuickActionCard
                icon={<Settings size={24} className="text-white" />}
                title="System Settings"
                description="Configure platform settings"
                link="/admin-dashboard/manage-testimonials"
                color="bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              />
              <QuickActionCard
                icon={<Eye size={24} className="text-white" />}
                title="View Reports"
                description="Analytics and performance reports"
                link="/admin-dashboard/manage-payments"
                color="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
              />
            </div>

            {/* Recent Activity and Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentActivity activities={recentActivities} />

              {/* System Health */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    System Health
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium">
                      All Systems Operational
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Server Status</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Database</span>
                    <span className="text-green-600 font-medium">
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email Service</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Backup</span>
                    <span className="text-gray-800 font-medium">
                      2 hours ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to Load Dashboard
            </h3>
            <p className="text-gray-600">
              Please check your connection and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
