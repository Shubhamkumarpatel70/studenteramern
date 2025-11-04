import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, FileCheck2, Users, Briefcase, ClipboardList, MessageSquare, Megaphone, Mail, Trash2, CreditCard, ShieldCheck } from 'lucide-react';

const AdminSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const commonClasses = 'flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200';
    const activeClass = 'bg-purple-600 text-white';
    const inactiveClass = 'text-gray-600 hover:bg-gray-200';

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white shadow-xl w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-50`}>
            <div className="p-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-purple-600">Admin</h1>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-600">
                    &times;
                </button>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <NavLink to="/admin-dashboard" end className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Home</NavLink>
                <NavLink to="/admin-dashboard/users" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Manage Users</NavLink>
                <NavLink to="/admin-dashboard/add-internship" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Manage Internships</NavLink>
                <NavLink to="/admin-dashboard/manage-meetings" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Manage Meetings</NavLink>
                <NavLink to="/admin-dashboard/manage-payments" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}><CreditCard className="mr-2" size={18}/>Manage Payments</NavLink>
                <NavLink to="/admin-dashboard/send-notification" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Send Notification</NavLink>
                <NavLink to="/admin-dashboard/generate-certificate" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Generate Certificate</NavLink>
                <NavLink to="/admin-dashboard/certificate-verification" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}><ShieldCheck className="mr-2" size={18}/>Certificate Verification</NavLink>
                <NavLink to="/admin-dashboard/generate-offer-letter" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Generate Offer Letter</NavLink>
                <NavLink to="/admin-dashboard/internship-registrations" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Internship Registrations</NavLink>
                <NavLink to="/admin-dashboard/manage-tasks" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Manage Tasks</NavLink>
                <NavLink to="/admin-dashboard/assign-tasks" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Assign Tasks</NavLink>
                <NavLink to="/admin-dashboard/manage-testimonials" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Manage Testimonials</NavLink>
                <NavLink to="/admin-dashboard/queries" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}><Mail className="mr-2" size={18}/>Queries</NavLink>
                <NavLink to="/admin-dashboard/help-queries" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}><MessageSquare className="mr-2" size={18}/>Help Queries</NavLink>
                <NavLink to="/admin-dashboard/post-announcement" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Post Announcement</NavLink>
                <NavLink to="/admin-dashboard/deletion-requests" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}><Trash2 className="mr-2" size={18}/>Deletion Requests</NavLink>
                <div className="pt-4 border-t border-gray-200">
                    <NavLink to="/logout" className={`${commonClasses} ${inactiveClass}`}>Logout</NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar; 