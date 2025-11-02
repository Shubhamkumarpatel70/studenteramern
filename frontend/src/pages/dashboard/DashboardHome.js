import React, { useEffect, useState, useContext } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import setAuthToken from '../../utils/setAuthToken';
import MobileBottomNav from '../../components/MobileBottomNav';
import Transactions from './Transactions';
import Certificates from './Certificates';
import { Calendar, Bell, Award, FileText } from 'lucide-react';

const StatCard = ({ title, value, linkTo, icon }) => (
    <Link to={linkTo} className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100/50 flex flex-col items-center text-center hover:scale-105 group">
        <div className="mb-3 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white shadow-lg group-hover:shadow-xl transition-shadow">
            {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 font-sans">{title}</h3>
        <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mt-2 font-sans drop-shadow-sm">{value}</p>
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
                    <StatCard title="Meetings" value={stats.meetings} linkTo="/dashboard/meetings" icon={<Calendar className="h-6 w-6" />} />
                    <StatCard title="Notifications" value={stats.notifications} linkTo="/dashboard/notifications" icon={<Bell className="h-6 w-6" />} />
                    <StatCard title="Certificates" value={stats.certificates} linkTo="/dashboard/certificates" icon={<Award className="h-6 w-6" />} />
                    <StatCard title="Offer Letters" value={stats.offerLetters} linkTo="/dashboard/offer-letters" icon={<FileText className="h-6 w-6" />} />
                </div>
            )}
            <MobileBottomNav />
        </div>
    );
};

export default DashboardHome; 