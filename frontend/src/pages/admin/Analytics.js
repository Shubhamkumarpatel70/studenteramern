import React, { useEffect, useState } from "react";
import api from "../../config/api";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
} from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await api.get("/dashboard/stats", config);
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Analytics Dashboard
        </h1>

        {stats ? (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Internships
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalInternships || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{(stats.totalTransactionAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Applications
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalRegistrations || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart3 className="mr-2" />
                  User Growth
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart visualization would go here
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2" />
                  Revenue Trends
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart visualization would go here
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Detailed Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalTransactions || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Successful Transactions
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.totalMeetings || 0}
                  </p>
                  <p className="text-sm text-gray-600">Scheduled Meetings</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {(stats.totalRegistrations || 0) -
                      (stats.totalTransactions || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Pending Applications</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to Load Analytics
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

export default Analytics;
