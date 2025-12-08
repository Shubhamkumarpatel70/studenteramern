import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';
import AuthContext from '../context/AuthContext';
import { Bell, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Top Header Bar */}
                <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            {/* Desktop: Show nothing, sidebar handles it */}
                            <div className="hidden lg:block"></div>

                            {/* Right side: User info and notifications */}
                            <div className="flex items-center gap-4">
                                {/* Notifications */}
                                <Link
                                    to="/dashboard/notifications"
                                    className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                    {/* Notification badge would go here */}
                                </Link>

                                {/* User Profile */}
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user?.internId || 'Student'}
                                        </p>
                                    </div>
                                    <Link
                                        to="/dashboard/profile"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg transition-shadow"
                                    >
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-12rem)]">
                            <Outlet />
                        </div>
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav onMenuClick={() => setSidebarOpen(true)} />
            </div>
        </div>
    );
};

export default UserDashboard;
