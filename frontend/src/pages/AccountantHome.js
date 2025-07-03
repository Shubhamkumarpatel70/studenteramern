import React, { useEffect, useState } from 'react';
import api from '../config/api';

const StatCard = ({ title, value, color }) => (
    <div className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 ${color}`}>
        <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AccountantHome = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/applications');
                const applications = res.data.data;
                const total = applications.length;
                const pending = applications.filter(app => app.status === 'Applied' || app.status === 'Under Review').length;
                const approved = applications.filter(app => app.status === 'Approved').length;
                const rejected = applications.filter(app => app.status === 'Rejected').length;
                setStats({ total, pending, approved, rejected });
            } catch (err) {
                console.error('Failed to fetch accountant stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Accountant Dashboard</h1>
            {loading ? (
                <p>Loading statistics...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Transactions" value={stats.total} color="bg-indigo-500" />
                    <StatCard title="Pending Approvals" value={stats.pending} color="bg-yellow-500" />
                    <StatCard title="Approved" value={stats.approved} color="bg-green-500" />
                    <StatCard title="Rejected" value={stats.rejected} color="bg-red-500" />
                </div>
            )}
        </div>
    );
};

export default AccountantHome; 