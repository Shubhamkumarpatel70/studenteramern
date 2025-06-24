import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CoAdminSidebar from '../components/coadmin/CoAdminSidebar';
import Footer from '../components/Footer';

const CoAdminDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <CoAdminSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm md:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="p-4 text-gray-600">
                        ☰ Menu
                    </button>
                </header>
                <main className="flex-1 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CoAdminDashboard; 