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
  AlertCircle,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Clock,
  Database,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ icon, title, value, colorClass, trend, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow relative group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend.startsWith('+') ? <TrendingUp size={16} className="mr-1" /> : null}
          {trend}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-400 font-medium">{subtitle}</p>
      )}
    </div>
  </div>
);

const QuickActionCard = ({ icon, title, description, link, colorClass }) => (
  <Link to={link} className="block group">
    <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-gray-200 group-hover:ring-primary/40 group-hover:shadow-md transition-all h-full">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${colorClass} shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-base font-bold text-gray-900 mb-1 truncate group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{description}</p>
        </div>
        <div className="shrink-0 pt-1 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  </Link>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 flex flex-col h-full">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
      <button className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors">
        <Activity size={20} />
      </button>
    </div>
    <div className="space-y-6 flex-1">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-4 group">
          <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${activity.colorClass}`}>
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 mb-0.5">{activity.title}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{activity.description}</p>
          </div>
          <div className="shrink-0 flex items-center text-xs font-medium text-gray-400 whitespace-nowrap">
            <Clock size={12} className="mr-1" />
            {activity.time}
          </div>
        </div>
      ))}
    </div>
    <button className="w-full mt-6 py-2.5 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors">
      View All Activity
    </button>
  </div>
);

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (localStorage.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.token}`;
      }
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);

        if (res.data.data.recentActivities) {
          const mappedActivities = res.data.data.recentActivities.map(act => {
            let icon = <Activity size={18} />;
            let colorClass = "bg-gray-50 text-gray-600 ring-1 ring-gray-100";
            if (act.type === 'user') { icon = <Users size={18} />; colorClass = "bg-blue-50 text-blue-600 ring-1 ring-blue-100"; }
            if (act.type === 'application') { icon = <Briefcase size={18} />; colorClass = "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"; }
            if (act.type === 'payment') { icon = <DollarSign size={18} />; colorClass = "bg-amber-50 text-amber-600 ring-1 ring-amber-100"; }

            const diff = new Date() - new Date(act.time);
            const hrs = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor(diff / (1000 * 60));
            const timeStr = hrs > 24 ? `${Math.floor(hrs / 24)}d ago` : hrs > 0 ? `${hrs}h ago` : mins > 0 ? `${mins}m ago` : 'Just now';

            return {
              icon,
              title: act.title,
              description: act.description,
              time: timeStr,
              colorClass
            };
          });
          setRecentActivities(mappedActivities);
        } else {
          setRecentActivities([]);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="pb-12">
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Administrator Dashboard
        </h1>
        <p className="text-gray-500 font-medium">
          Overview of platform metrics, active applications, and system status.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : stats ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1 py-1">
            <StatCard
              icon={<Users size={24} />}
              title="Total Users"
              value={stats.totalUsers ?? 0}
              colorClass="bg-blue-50 text-blue-600 border border-blue-100"
              trend="+12%"
              subtitle="Registered accounts"
            />
            <StatCard
              icon={<Briefcase size={24} />}
              title="Total Internships"
              value={stats.totalInternships ?? 0}
              colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100"
              trend="+5%"
              subtitle="Available programs"
            />
            <StatCard
              icon={<Calendar size={24} />}
              title="Meetings"
              value={stats.totalMeetings ?? 0}
              colorClass="bg-purple-50 text-purple-600 border border-purple-100"
              trend="+8%"
              subtitle="Scheduled this week"
            />
            <StatCard
              icon={<DollarSign size={24} />}
              title="Revenue"
              value={`₹${(stats.totalTransactionAmount ?? 0).toLocaleString()}`}
              colorClass="bg-amber-50 text-amber-600 border border-amber-100"
              trend="+15%"
              subtitle="Processed payments"
            />
            <StatCard
              icon={<FileText size={24} />}
              title="Total Applications"
              value={stats.totalRegistrations ?? 0}
              colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100"
              trend="+20%"
              subtitle="Across all programs"
            />
            <StatCard
              icon={<CheckCircle2 size={24} />}
              title="Approved"
              value={stats.totalTransactions ?? 0}
              colorClass="bg-green-50 text-green-600 border border-green-100"
              trend="+10%"
              subtitle="Successful verifications"
            />
            <StatCard
              icon={<AlertCircle size={24} />}
              title="Pending Approval"
              value={(stats.totalRegistrations ?? 0) - (stats.totalTransactions ?? 0)}
              colorClass="bg-red-50 text-red-600 border border-red-100"
              trend="-5%"
              subtitle="Awaiting action"
            />
            <StatCard
              icon={<BarChart3 size={24} />}
              title="Approval Rate"
              value={`${stats.totalRegistrations ? Math.round(((stats.totalTransactions ?? 0) / stats.totalRegistrations) * 100) : 0}%`}
              colorClass="bg-teal-50 text-teal-600 border border-teal-100"
              trend="+3%"
              subtitle="Application conversion"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <QuickActionCard
                icon={<Plus size={22} />}
                title="Create Internship"
                description="Draft and publish a new program listing"
                link="/admin-dashboard/add-internship"
                colorClass="bg-blue-50 text-blue-600 border border-blue-100"
              />
              <QuickActionCard
                icon={<Users size={22} />}
                title="Manage Users"
                description="View profiles, handle bans, and permissions"
                link="/admin-dashboard/users"
                colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100"
              />
              <QuickActionCard
                icon={<Calendar size={22} />}
                title="Schedule Meeting"
                description="Organize interviews or team check-ins"
                link="/admin-dashboard/manage-meetings"
                colorClass="bg-purple-50 text-purple-600 border border-purple-100"
              />
              <QuickActionCard
                icon={<FileText size={22} />}
                title="Review Applications"
                description="Evaluate candidate submissions and tasks"
                link="/admin-dashboard/internship-registrations"
                colorClass="bg-amber-50 text-amber-600 border border-amber-100"
              />
              <QuickActionCard
                icon={<Settings size={22} />}
                title="Platform Settings"
                description="Configure testimonials, FAQs, and links"
                link="/admin-dashboard/manage-testimonials"
                colorClass="bg-gray-100 text-gray-600 border border-gray-200"
              />
              <QuickActionCard
                icon={<Eye size={22} />}
                title="Financial Reports"
                description="View payment history and detailed analytics"
                link="/admin-dashboard/manage-payments"
                colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <RecentActivity activities={recentActivities} />

            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-900">System Information</h2>
                <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 text-xs font-bold uppercase tracking-wide">Operational</span>
                </div>
              </div>

              <div className="space-y-5 flex-1 p-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Settings size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">API Server Uptime</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-sm bg-emerald-100/50 px-2 py-1 rounded">
                    {stats.systemInfo?.serverUptime ? `${Math.floor(stats.systemInfo.serverUptime / 3600)}h ${Math.floor((stats.systemInfo.serverUptime % 3600) / 60)}m` : 'Online'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Database size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Database Connection</span>
                  </div>
                  <span className={`font-bold text-sm px-2 py-1 rounded ${stats.systemInfo?.databaseStatus === 'Connected' ? 'text-emerald-600 bg-emerald-100/50' : 'text-red-600 bg-red-100/50'}`}>
                    {stats.systemInfo?.databaseStatus || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Email Gateway</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-sm bg-emerald-100/50 px-2 py-1 rounded">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Clock size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Last System Backup</span>
                  </div>
                  <span className="text-gray-900 font-bold text-sm bg-white border border-gray-200 shadow-sm px-2 py-1 rounded">
                    {stats.systemInfo?.lastBackup ? new Date(stats.systemInfo.lastBackup).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : 'Today, 02:00 AM'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-12 text-center max-w-md mx-auto mt-10">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unavailable</h3>
          <p className="text-gray-500 text-sm">Please check your connection and try again.</p>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
