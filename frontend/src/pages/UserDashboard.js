import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';

const UserDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-3 sm:p-6 md:p-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 min-h-[80vh] hover:shadow-2xl transition-all duration-300">
                        <Outlet />
                    </div>
                </main>
                <MobileBottomNav onMenuClick={() => setSidebarOpen(true)} />
            </div>
        </div>
    );
};

export default UserDashboard;
