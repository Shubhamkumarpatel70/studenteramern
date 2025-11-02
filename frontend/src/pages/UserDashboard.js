import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';

const UserDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-3 sm:p-6 md:p-8">
                    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 min-h-[80vh]">
                        <Outlet />
                    </div>
                </main>
                <MobileBottomNav onMenuClick={() => setSidebarOpen(true)} />
            </div>
        </div>
    );
};

export default UserDashboard;
