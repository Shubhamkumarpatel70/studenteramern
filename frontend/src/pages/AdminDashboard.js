import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Navigation */}
            <AdminSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-72 min-w-0 transition-all duration-300">
                {/* Mobile Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 md:hidden sticky top-0 z-30 flex items-center justify-between p-4 px-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo192.png" alt="Logo" className="w-8 h-8 rounded-full border border-gray-100 p-0.5" />
                        <span className="font-bold text-gray-900">Admin Panel</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                        aria-label="Open menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;