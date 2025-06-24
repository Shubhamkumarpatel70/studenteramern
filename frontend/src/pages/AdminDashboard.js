import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import Footer from '../components/Footer';
import ManageUsers from './admin/ManageUsers';
import PostAnnouncement from './admin/PostAnnouncement';
import SendNotification from './admin/SendNotification';
import ManageTestimonials from './admin/ManageTestimonials';
import AddInternship from './admin/AddInternship';
import ManageMeetings from './admin/ManageMeetings';
import GenerateOfferLetter from './admin/GenerateOfferLetter';
import GenerateCertificate from './admin/GenerateCertificate';
import InternshipRegistrations from './admin/InternshipRegistrations';

const AdminDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
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

export default AdminDashboard; 