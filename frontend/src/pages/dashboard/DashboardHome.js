import React, { useEffect, useState, useContext } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import setAuthToken from '../../utils/setAuthToken';
import MobileBottomNav from '../../components/MobileBottomNav';
import Transactions from './Transactions';
import Certificates from './Certificates';

const StatCard = ({ title, value, linkTo }) => (
    <Link to={linkTo} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
        <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
    </Link>
);

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        meetings: 0,
        notifications: 0,
        certificates: 0,
        offerLetters: 0
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        const fetchStats = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
            }
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch dashboard stats', err);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (!user) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back, {user.name}!</h1>
            <p className="text-gray-600 mb-8">Here's a summary of your internship activities.</p>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b">
                {['Overview', 'Transactions', 'Certificates'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-semibold border-b-2 transition-colors duration-200 ${activeTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-indigo-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Overview' && (
                loading ? (
                    <p>Loading stats...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Meetings" value={stats.meetings} linkTo="/dashboard/meetings" />
                        <StatCard title="Notifications" value={stats.notifications} linkTo="/dashboard/notifications" />
                        <StatCard title="Certificates" value={stats.certificates} linkTo="/dashboard/certificates" />
                        <StatCard title="Offer Letters" value={stats.offerLetters} linkTo="/dashboard/offer-letters" />
                    </div>
                )
            )}
            {activeTab === 'Transactions' && <Transactions />}
            {activeTab === 'Certificates' && <Certificates />}
            <MobileBottomNav />
        </div>
    );
};

export default DashboardHome; 