import React from 'react';
import { NavLink } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const CoAdminSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const commonClasses = 'flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200';
    const activeClass = 'bg-teal-600 text-white';
    const inactiveClass = 'text-gray-600 hover:bg-gray-200';

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white shadow-xl w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-50`}>
            <div className="p-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-teal-600">Co-Admin</h1>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-600">
                    &times;
                </button>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <NavLink to="/coadmin" end className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Home</NavLink>
                <NavLink to="/coadmin/students" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Manage Students</NavLink>
                <NavLink to="/coadmin/meetings" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}>Meetings</NavLink>
                <NavLink to="/coadmin/deletion-requests" className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}><Trash2 className="mr-2" size={18}/>Deletion Requests</NavLink>
                <div className="pt-4 border-t border-gray-200">
                    <NavLink to="/logout" className={`${commonClasses} ${inactiveClass}`}>Logout</NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default CoAdminSidebar; 