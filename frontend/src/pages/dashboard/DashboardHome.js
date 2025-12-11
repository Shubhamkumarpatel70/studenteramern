import React, { useEffect, useState, useContext } from 'react';
import api from '../../config/api';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import setAuthToken from '../../utils/setAuthToken';
import {
    Calendar,
    Bell,
    Award,
    FileText,
    Briefcase,
    CheckCircle,
    Clock,
    TrendingUp,
    ArrowRight,
    Loader2,
    Sparkles,
    MessageCircle
} from 'lucide-react';

// Loading Skeleton Component
const StatCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
    </div>
);

// Enhanced Stat Card Component
const StatCard = ({ title, value, linkTo, icon, color = 'blue', subtitle, badge }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        pink: 'bg-pink-50 text-pink-600 border-pink-200',
    };

    return (
        <Link
            to={linkTo}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:-translate-y-1"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
                {badge && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                        {badge}
                    </span>
                )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            <div className="flex items-baseline justify-between">
                <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[1]}`}>
                    {value}
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
            </div>
            {subtitle && (
                <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
            )}
        </Link>
    );
};

// Quick Action Card
const QuickActionCard = ({ title, description, icon, linkTo, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-500 hover:bg-blue-600',
        green: 'bg-green-500 hover:bg-green-600',
        purple: 'bg-purple-500 hover:bg-purple-600',
        orange: 'bg-orange-500 hover:bg-orange-600',
    };

    return (
        <Link
            to={linkTo}
            className={`${colorClasses[color]} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-3`}
        >
            <div className="p-2 bg-white/20 rounded-lg">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-sm">{title}</h4>
                <p className="text-xs opacity-90">{description}</p>
            </div>
            <ArrowRight className="h-4 w-4" />
        </Link>
    );
};

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [whatsappLink, setWhatsappLink] = useState(null);
    const [stats, setStats] = useState({
        meetings: 0,
        notifications: 0,
        totalNotifications: 0,
        certificates: 0,
        offerLetters: 0,
        applications: 0,
        approvedApplications: 0,
        pendingApplications: 0,
        tasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWhatsAppLink();
        const fetchStats = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
            }
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data.data);
                setError('');
            } catch (err) {
                console.error('Failed to fetch dashboard stats', err);
                setError('Failed to load dashboard statistics. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const fetchWhatsAppLink = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } : {};
            
            const res = await api.get('/social-links', config);
            const links = res.data.data;
            
            const whatsapp = links.find(link => link.platform === 'whatsapp' && link.isActive);
            if (whatsapp) {
                setWhatsappLink(whatsapp.url);
            }
        } catch (err) {
            console.error('Failed to fetch WhatsApp link', err);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 md:p-8 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-6 w-6" />
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {greeting}, {user.name?.split(' ')[0]}!
                    </h1>
                </div>
                <p className="text-blue-100 text-sm md:text-base">
                    Here's an overview of your internship journey with Student Era
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    {/* Primary Stats */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Overview
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Meetings"
                                value={stats.meetings}
                                linkTo="/dashboard/meetings"
                                icon={<Calendar className="h-6 w-6" />}
                                color="blue"
                            />
                            <StatCard
                                title="Notifications"
                                value={stats.notifications}
                                linkTo="/dashboard/notifications"
                                icon={<Bell className="h-6 w-6" />}
                                color="orange"
                                badge={stats.notifications > 0 ? 'New' : null}
                                subtitle={`${stats.totalNotifications} total`}
                            />
                            <StatCard
                                title="Certificates"
                                value={stats.certificates}
                                linkTo="/dashboard/certificates"
                                icon={<Award className="h-6 w-6" />}
                                color="green"
                            />
                            <StatCard
                                title="Offer Letters"
                                value={stats.offerLetters}
                                linkTo="/dashboard/offer-letters"
                                icon={<FileText className="h-6 w-6" />}
                                color="purple"
                            />
                        </div>
                    </div>

                    {/* Applications & Tasks Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Applications Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-indigo-600" />
                                Applications
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatCard
                                    title="Total"
                                    value={stats.applications}
                                    linkTo="/dashboard/applied-internships"
                                    icon={<Briefcase className="h-5 w-5" />}
                                    color="indigo"
                                />
                                <StatCard
                                    title="Approved"
                                    value={stats.approvedApplications}
                                    linkTo="/dashboard/applied-internships"
                                    icon={<CheckCircle className="h-5 w-5" />}
                                    color="green"
                                />
                                <StatCard
                                    title="Pending"
                                    value={stats.pendingApplications}
                                    linkTo="/dashboard/applied-internships"
                                    icon={<Clock className="h-5 w-5" />}
                                    color="orange"
                                />
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Tasks
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatCard
                                    title="Total Tasks"
                                    value={stats.tasks}
                                    linkTo="/dashboard/my-tasks"
                                    icon={<CheckCircle className="h-5 w-5" />}
                                    color="blue"
                                />
                                <StatCard
                                    title="Completed"
                                    value={stats.completedTasks}
                                    linkTo="/dashboard/my-tasks"
                                    icon={<CheckCircle className="h-5 w-5" />}
                                    color="green"
                                />
                                <StatCard
                                    title="Pending"
                                    value={stats.pendingTasks}
                                    linkTo="/dashboard/my-tasks"
                                    icon={<Clock className="h-5 w-5" />}
                                    color="orange"
                                />
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Group Card */}
                    {whatsappLink && (
                        <div className="mb-6">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-4 rounded-full">
                                            <MessageCircle className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Join WhatsApp Group</h3>
                                            <p className="text-green-100 text-sm">Connect with our community and get updates</p>
                                        </div>
                                    </div>
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                                    >
                                        Join Now
                                        <ArrowRight className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <QuickActionCard
                                title="Browse Internships"
                                description="Explore available opportunities"
                                icon={<Briefcase className="h-5 w-5" />}
                                linkTo="/internships"
                                color="blue"
                            />
                            <QuickActionCard
                                title="Upload Task"
                                description="Submit your completed work"
                                icon={<FileText className="h-5 w-5" />}
                                linkTo="/dashboard/upload-task"
                                color="green"
                            />
                            <QuickActionCard
                                title="View Profile"
                                description="Update your information"
                                icon={<Award className="h-5 w-5" />}
                                linkTo="/dashboard/profile"
                                color="purple"
                            />
                            <QuickActionCard
                                title="Get Help"
                                description="Contact support team"
                                icon={<Bell className="h-5 w-5" />}
                                linkTo="/dashboard/help"
                                color="orange"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardHome;
