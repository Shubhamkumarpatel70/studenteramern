import React, { useEffect, useState, useContext } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import setAuthToken from '../../utils/setAuthToken';
import MobileBottomNav from '../../components/MobileBottomNav';
import Transactions from './Transactions';
import Certificates from './Certificates';

const StatCard = ({ title, value, linkTo }) => (
    <Link to={linkTo} className="bg-gradient-to-br from-primary-light via-background to-accent-light p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-primary-light/30 flex flex-col items-center text-center">
        <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-1 font-sans">{title}</h3>
        <p className="text-3xl sm:text-4xl font-extrabold text-primary mt-2 font-sans drop-shadow">{value}</p>
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
        <div className="p-2 sm:p-4 md:p-8 font-sans font-medium">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-primary-dark font-sans">Welcome Back, {user.name}!</h1>
            <p className="text-primary-dark/80 mb-8 font-sans">Here's a summary of your internship activities.</p>
            {loading ? (
                <p>Loading stats...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mx-auto font-sans font-medium">
                    <StatCard title="Meetings" value={stats.meetings} linkTo="/dashboard/meetings" />
                    <StatCard title="Notifications" value={stats.notifications} linkTo="/dashboard/notifications" />
                    <StatCard title="Certificates" value={stats.certificates} linkTo="/dashboard/certificates" />
                    <StatCard title="Offer Letters" value={stats.offerLetters} linkTo="/dashboard/offer-letters" />
                </div>
            )}
            <MobileBottomNav />
        </div>
    );
};

export default DashboardHome; 