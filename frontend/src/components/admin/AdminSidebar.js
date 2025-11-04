import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Users,
    Briefcase,
    Calendar,
    CreditCard,
    Bell,
    Award,
    ShieldCheck,
    FileText,
    ClipboardList,
    Settings,
    MessageSquare,
    Megaphone,
    Mail,
    Trash2,
    BarChart3,
    UserCheck,
    Clock,
    HelpCircle
} from 'lucide-react';

const AdminSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const commonClasses = 'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group';
    const activeClass = 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg';
    const inactiveClass = 'text-gray-600 hover:bg-gray-100 hover:text-purple-600';

    const menuSections = [
        {
            title: "Overview",
            items: [
                { to: "/admin-dashboard", icon: <Home size={20} />, label: "Dashboard", end: true }
            ]
        },
        {
            title: "User Management",
            items: [
                { to: "/admin-dashboard/users", icon: <Users size={20} />, label: "Manage Users" },
                { to: "/admin-dashboard/deletion-requests", icon: <Trash2 size={20} />, label: "Deletion Requests" }
            ]
        },
        {
            title: "Internship Management",
            items: [
                { to: "/admin-dashboard/add-internship", icon: <Briefcase size={20} />, label: "Add Internship" },
                { to: "/admin-dashboard/internship-registrations", icon: <FileText size={20} />, label: "Applications" },
                { to: "/admin-dashboard/manage-tasks", icon: <ClipboardList size={20} />, label: "Manage Tasks" },
                { to: "/admin-dashboard/assign-tasks", icon: <UserCheck size={20} />, label: "Assign Tasks" }
            ]
        },
        {
            title: "Communication",
            items: [
                { to: "/admin-dashboard/manage-meetings", icon: <Calendar size={20} />, label: "Meetings" },
                { to: "/admin-dashboard/send-notification", icon: <Bell size={20} />, label: "Notifications" },
                { to: "/admin-dashboard/post-announcement", icon: <Megaphone size={20} />, label: "Announcements" }
            ]
        },
        {
            title: "Certificates & Verification",
            items: [
                { to: "/admin-dashboard/generate-certificate", icon: <Award size={20} />, label: "Certificates" },
                { to: "/admin-dashboard/generate-offer-letter", icon: <FileText size={20} />, label: "Offer Letters" },
                { to: "/admin-dashboard/certificate-verification", icon: <ShieldCheck size={20} />, label: "Verification" }
            ]
        },
        {
            title: "Finance & Reports",
            items: [
                { to: "/admin-dashboard/manage-payments", icon: <CreditCard size={20} />, label: "Payments" },
                { to: "/admin-dashboard/analytics", icon: <BarChart3 size={20} />, label: "Analytics" }
            ]
        },
        {
            title: "Content & Support",
            items: [
                { to: "/admin-dashboard/manage-testimonials", icon: <Settings size={20} />, label: "Testimonials" },
                { to: "/admin-dashboard/queries", icon: <Mail size={20} />, label: "Queries" },
                { to: "/admin-dashboard/help-queries", icon: <HelpCircle size={20} />, label: "Help Center" }
            ]
        }
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white shadow-2xl w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-50 border-r border-gray-100`}>
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                        <Settings className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-xs text-gray-500">Management Console</p>
                    </div>
                </div>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    ✕
                </button>
            </div>

            <nav className="flex flex-col p-4 space-y-6 overflow-y-auto h-full pb-20">
                {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-2">
                        <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item, itemIndex) => (
                                <NavLink
                                    key={itemIndex}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `${commonClasses} ${isActive ? activeClass : inactiveClass}`
                                    }
                                >
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className={`p-1.5 rounded-lg transition-colors ${
                                            ({ isActive }) => isActive ? 'bg-white bg-opacity-20' : 'group-hover:bg-purple-100'
                                        }`}>
                                            {item.icon}
                                        </div>
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {({ isActive }) => isActive && (
                                        <div className="w-1.5 h-6 bg-white rounded-full"></div>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-6 border-t border-gray-200">
                    <NavLink
                        to="/logout"
                        className={`${commonClasses} ${inactiveClass} hover:bg-red-50 hover:text-red-600`}
                    >
                        <div className="flex items-center space-x-3 flex-1">
                            <div className="p-1.5 rounded-lg">
                                <Clock size={20} />
                            </div>
                            <span className="font-medium">Logout</span>
                        </div>
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
