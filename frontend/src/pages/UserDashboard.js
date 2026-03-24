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
        <div className="flex min-h-screen bg-gray-50 uppercase-remove">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
                {/* Clean Flat Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8 py-3.5">
                        <div className="flex items-center justify-between">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            {/* Desktop: Greeting placeholder */}
                            <div className="hidden lg:block"></div>

                            {/* Right side: User info and notifications */}
                            <div className="flex items-center gap-4">
                                {/* Notifications */}
                                <Link
                                    to="/dashboard/notifications"
                                    className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                    {/* Notification badge indicator */}
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
                                </Link>

                                {/* User Profile */}
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-sm font-semibold text-gray-800 leading-none">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {user?.internId ? `ID: ${user.internId}` : 'Student'}
                                        </p>
                                    </div>
                                    <Link
                                        to="/dashboard/profile"
                                        className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav onMenuClick={() => setSidebarOpen(true)} />
            </div>
        </div>
    );
};

export default UserDashboard;
