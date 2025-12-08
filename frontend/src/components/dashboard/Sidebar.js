import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import {
    LayoutDashboard,
    Briefcase,
    Calendar,
    Bell,
    Award,
    FileText,
    User,
    LogOut,
    Upload,
    ListChecks,
    MessageSquare,
    Trash2,
    X
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const commonClasses = 'flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50 group';

    const navItems = [
        { href: '/dashboard/overview', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
        { href: '/dashboard/applied-internships', icon: <Briefcase className="h-5 w-5" />, label: 'Applied Internships' },
        { href: '/dashboard/transactions', icon: <FileText className="h-5 w-5" />, label: 'Transactions' },
        { href: '/dashboard/certificates', icon: <Award className="h-5 w-5" />, label: 'Certificates' },
        { href: '/dashboard/offer-letters', icon: <FileText className="h-5 w-5" />, label: 'Offer Letters' },
        { href: '/dashboard/meetings', icon: <Calendar className="h-5 w-5" />, label: 'Meetings' },
        { href: '/dashboard/notifications', icon: <Bell className="h-5 w-5" />, label: 'Notifications' },
        { href: '/dashboard/my-tasks', icon: <ListChecks className="h-5 w-5" />, label: 'My Tasks' },
        { href: '/dashboard/upload-task', icon: <Upload className="h-5 w-5" />, label: 'Upload Task' },
        { href: '/dashboard/help', icon: <MessageSquare className="h-5 w-5" />, label: 'Help & Support' },
    ];

    const bottomNavItems = [
        { href: '/dashboard/profile', icon: <User className="h-5 w-5" />, label: 'Profile Settings' },
        { href: '/dashboard/delete-account', icon: <Trash2 className="h-5 w-5" />, label: 'Delete Account' },
    ];

    // Close sidebar on mobile after navigation
    const handleNav = () => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar overlay"
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 bg-white shadow-xl w-72 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 z-50 flex flex-col border-r border-gray-200`}
                aria-label="User dashboard sidebar"
            >
                {/* Header with User Profile */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 rounded-lg text-gray-600 hover:bg-white/50 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    {/* User Profile Card */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-md">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.internId || 'Student ID'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === '/dashboard/overview'}
                            className={({ isActive }) =>
                                `${commonClasses} ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium [&>span:first-child]:text-blue-600'
                                        : 'text-gray-700 hover:text-gray-900'
                                }`
                            }
                            onClick={handleNav}
                        >
                            <span className="text-gray-500 group-hover:text-gray-700">
                                {item.icon}
                            </span>
                            <span className="ml-3">{item.label}</span>
                        </NavLink>
                    ))}

                    {/* Bottom Section */}
                    <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
                        {bottomNavItems.map((item) => (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                className={({ isActive }) =>
                                    `${commonClasses} ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium [&>span:first-child]:text-blue-600'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`
                                }
                                onClick={handleNav}
                            >
                                <span className="text-gray-500 group-hover:text-gray-700">
                                    {item.icon}
                                </span>
                                <span className="ml-3">{item.label}</span>
                            </NavLink>
                        ))}

                        {/* Logout button */}
                        <button
                            onClick={() => {
                                try {
                                    if (logout) logout({ navigate, redirectTo: '/' });
                                } catch (err) {
                                    localStorage.removeItem('token');
                                    navigate('/');
                                }
                            }}
                            className={`${commonClasses} text-red-600 hover:bg-red-50 w-full text-left`}
                            aria-label="Logout"
                        >
                            <LogOut className="h-5 w-5 text-red-500" />
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
