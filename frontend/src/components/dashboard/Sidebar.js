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
    Trash2
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const commonClasses = 'flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105';

    const navItems = [
        { href: '/dashboard/overview', icon: <LayoutDashboard />, label: 'Dashboard' },
        { href: '/dashboard/transactions', icon: <FileText />, label: 'Transactions' },
        { href: '/dashboard/certificates', icon: <Award />, label: 'Certificates' },
        { href: '/dashboard/applied-internships', icon: <Briefcase />, label: 'Applied Internships' },
        { href: '/dashboard/meetings', icon: <Calendar />, label: 'Meetings' },
        { href: '/dashboard/notifications', icon: <Bell />, label: 'Notifications' },
        { href: '/dashboard/offer-letters', icon: <FileText />, label: 'My Offer Letters' },
        { href: '/dashboard/upload-task', icon: <Upload />, label: 'Upload Task' },
        { href: '/dashboard/my-tasks', icon: <ListChecks />, label: 'My Tasks' },
        { href: '/dashboard/help', icon: <MessageSquare />, label: 'Message' },
    ];

    const bottomNavItems = [
        { href: '/dashboard/profile', icon: <User />, label: 'Profile' },
        { href: '/dashboard/delete-account', icon: <Trash2 />, label: 'Delete Account' },
    ];

    // Close sidebar on mobile after navigation
    const handleNav = () => {
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar overlay"
                    tabIndex={0}
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 bg-gray-800 shadow-lg w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-[100] flex flex-col font-sans font-medium border-r border-gray-200`}
                aria-label="User dashboard sidebar"
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-sans">Dashboard</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-gray-900 text-3xl focus:outline-none hover:text-gray-600 transition-colors"
                        aria-label="Close sidebar"
                    >
                        &times;
                    </button>
                </div>
                <nav className="flex-1 flex flex-col p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === '/dashboard'}
                            className={({ isActive }) => `${commonClasses} ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={handleNav}
                            tabIndex={0}
                        >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                        </NavLink>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                        {bottomNavItems.map((item) => (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                className={({ isActive }) => `${commonClasses} ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={handleNav}
                                tabIndex={0}
                            >
                                {item.icon}
                                <span className="ml-2">{item.label}</span>
                            </NavLink>
                        ))}

                        {/* Logout button - calls AuthContext.logout with client-side navigation */}
                        <button
                            onClick={() => {
                                try {
                                    // Call logout with navigate so AuthContext performs a client-side redirect
                                    if (logout) logout({ navigate, redirectTo: '/' });
                                } catch (err) {
                                    // Fallback: clear local token and navigate
                                    localStorage.removeItem('token');
                                    navigate('/');
                                }
                            }}
                            className={`${commonClasses} text-gray-700 hover:bg-gray-100 w-full text-left mt-2`}
                            aria-label="Logout"
                        >
                            <LogOut />
                            <span className="ml-2">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar; 