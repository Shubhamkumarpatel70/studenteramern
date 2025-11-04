import React, { useEffect, useState } from 'react';
import api from '../../config/api';
import { Users, Briefcase, Calendar, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, title, value, color }) => (
    <div className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 ${color}`}>
        <div className="p-3 rounded-full bg-white bg-opacity-30">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-3xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
    </div>
);

const AdminHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (localStorage.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
            }
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            {loading ? (
                <p>Loading statistics...</p>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <StatCard 
                        icon={<Users size={32} className="text-white" />} 
                        title="Total Users" 
                        value={stats.totalUsers ?? 0} 
                        color="bg-blue-500"
                    />
                    <StatCard 
                        icon={<Briefcase size={32} className="text-white" />} 
                        title="Total Internships" 
                        value={stats.totalInternships ?? 0} 
                        color="bg-green-500"
                    />
                    <StatCard 
                        icon={<Calendar size={32} className="text-white" />} 
                        title="Total Meetings" 
                        value={stats.totalMeetings ?? 0} 
                        color="bg-purple-500"
                    />
                    <StatCard 
                        icon={<DollarSign size={32} className="text-white" />} 
                        title="Total Transactions" 
                        value={stats.totalTransactions ?? 0} 
                        color="bg-yellow-500"
                    />
                    <StatCard 
                        icon={<DollarSign size={32} className="text-white" />} 
                        title="Transaction Amount" 
                        value={stats.totalTransactionAmount ?? 0} 
                        color="bg-orange-500"
                    />
                    <StatCard 
                        icon={<FileText size={32} className="text-white" />} 
                        title="Internship Registrations" 
                        value={stats.totalRegistrations ?? 0} 
                        color="bg-pink-500"
                    />
                    <Link to="/admin-dashboard/deletion-requests" className="block">
                        <div className="p-6 rounded-lg shadow-lg flex items-center space-x-4 bg-red-500 hover:opacity-95 transition">
                            <div className="p-3 rounded-full bg-white bg-opacity-30">
                                <CheckCircle2 size={32} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Deletion Requests</h3>
                                <p className="text-3xl font-bold text-white">View & Manage</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ) : (
                <p>Could not load statistics.</p>
            )}
            {/* Add more admin-specific components here later */}
        </div>
    );
};

export default AdminHome;