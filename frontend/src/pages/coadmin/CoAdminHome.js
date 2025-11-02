import React, { useEffect, useState } from 'react';
import api from '../../config/api';
import { Users, Briefcase, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, title, value, color }) => (
    <div className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 ${color}`}>
        <div className="p-3 rounded-full bg-white bg-opacity-30">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const CoAdminHome = () => {
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
                console.error('Failed to fetch co-admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Co-Admin Dashboard</h1>
            {loading ? (
                <p>Loading statistics...</p>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard 
                        icon={<Users size={32} className="text-white" />} 
                        title="Total Students" 
                        value={stats.totalUsers ?? 0} 
                        color="bg-teal-500"
                    />
                    <StatCard 
                        icon={<Calendar size={32} className="text-white" />} 
                        title="Meetings This Week" 
                        value={stats.totalMeetings ?? 0} 
                        color="bg-cyan-500"
                    />
                    <StatCard 
                        icon={<Briefcase size={32} className="text-white" />} 
                        title="Active Internships" 
                        value={stats.totalInternships ?? 0} 
                        color="bg-emerald-500"
                    />
                    <Link to="/coadmin/deletion-requests" className="block">
                        <div className="p-6 rounded-lg shadow-lg flex items-center space-x-4 bg-red-500 hover:opacity-95 transition">
                            <div className="p-3 rounded-full bg-white bg-opacity-30">
                                <Calendar size={32} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Deletion Requests</h3>
                                <p className="text-3xl font-bold text-white">Review & Action</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ) : (
                <p>Could not load statistics.</p>
            )}
        </div>
    );
};

export default CoAdminHome; 