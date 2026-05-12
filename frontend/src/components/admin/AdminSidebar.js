import React from "react";
import { NavLink } from "react-router-dom";
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
  Megaphone,
  Mail,
  Trash2,
  BarChart3,
  UserCheck,
  Clock,
  HelpCircle,
  UserCog,
  Star,
  Share2,
  ArrowRightLeft,
} from "lucide-react";

const AdminSidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const commonClasses =
    "block w-full px-4 py-2.5 rounded-xl transition-all duration-200 group";
  const activeClass =
    "bg-primary/10 font-semibold shadow-sm ring-1 ring-primary/20 text-primary";
  const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  const menuSections = [
    {
      title: "Overview",
      items: [
        {
          to: "/admin-dashboard",
          icon: <Home size={18} />,
          label: "Dashboard",
          end: true,
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          to: "/admin-dashboard/users",
          icon: <Users size={18} />,
          label: "Manage Users",
        },
        {
          to: "/admin-dashboard/deletion-requests",
          icon: <Trash2 size={18} />,
          label: "Deletion Requests",
        },
      ],
    },
    {
      title: "Internship Management",
      items: [
        {
          to: "/admin-dashboard/add-internship",
          icon: <Briefcase size={18} />,
          label: "Add Internship",
        },
        {
          to: "/admin-dashboard/internship-registrations",
          icon: <FileText size={18} />,
          label: "Applications",
        },
        {
          to: "/admin-dashboard/manage-tasks",
          icon: <ClipboardList size={18} />,
          label: "Manage Tasks",
        },
        {
          to: "/admin-dashboard/assign-tasks",
          icon: <UserCheck size={18} />,
          label: "Assign Tasks",
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          to: "/admin-dashboard/manage-meetings",
          icon: <Calendar size={18} />,
          label: "Meetings",
        },
        {
          to: "/admin-dashboard/send-notification",
          icon: <Bell size={18} />,
          label: "Notifications",
        },
        {
          to: "/admin-dashboard/post-announcement",
          icon: <Megaphone size={18} />,
          label: "Announcements",
        },
      ],
    },
    {
      title: "Certificates & Letters",
      items: [
        {
          to: "/admin-dashboard/generate-certificate",
          icon: <Award size={18} />,
          label: "Certificates",
        },
        {
          to: "/admin-dashboard/generate-offer-letter",
          icon: <FileText size={18} />,
          label: "Offer Letters",
        },
        {
          to: "/admin-dashboard/send-offer-letter",
          icon: <Mail size={18} />,
          label: "Send Offer Letter",
        },
        {
          to: "/admin-dashboard/manage-ppo",
          icon: <Award size={18} />,
          label: "Manage PPO",
        },
        {
          to: "/admin-dashboard/certificate-verification",
          icon: <ShieldCheck size={18} />,
          label: "Verification",
        },
      ],
    },
    {
      title: "Finance & Reports",
      items: [
        {
          to: "/admin-dashboard/manage-payments",
          icon: <CreditCard size={18} />,
          label: "Payments",
        },
        {
          to: "/admin-dashboard/analytics",
          icon: <BarChart3 size={18} />,
          label: "Analytics",
        },
        {
          to: "/admin-dashboard/manage-refunds",
          icon: <ArrowRightLeft size={18} />,
          label: "Refunds",
        },
      ],
    },
    {
      title: "Others",
      items: [
        {
          to: "/admin-dashboard/manage-testimonials",
          icon: <Settings size={18} />,
          label: "Testimonials",
        },
        {
          to: "/admin-dashboard/queries",
          icon: <Mail size={18} />,
          label: "Queries",
        },
        {
          to: "/admin-dashboard/help-queries",
          icon: <HelpCircle size={18} />,
          label: "Help Center",
        },
        {
          to: "/admin-dashboard/manage-feedback",
          icon: <Star size={18} />,
          label: "User Feedback",
        },
        {
          to: "/admin-dashboard/manage-hr",
          icon: <UserCog size={18} />,
          label: "Manage HR",
        },
        {
          to: "/admin-dashboard/manage-social-links",
          icon: <Share2 size={18} />,
          label: "Social Links",
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white shadow-xl md:shadow-sm w-72 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0 z-50 border-r border-gray-200 overflow-hidden flex flex-col`}
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center space-x-3 w-full">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
            <Settings className="text-primary w-5 h-5" />
          </div>
          <div className="truncate">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 font-medium truncate">
              Management Console
            </p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 -mr-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-200 p-4 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            <h3 className="px-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item, itemIndex) => (
                <NavLink
                  key={itemIndex}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)} // mobile auto close
                  className={({ isActive }) =>
                    `${commonClasses} ${isActive ? activeClass : inactiveClass}`
                  }
                >
                  {({ isActive }) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex items-center justify-center transition-colors ${
                            isActive
                              ? "text-primary"
                              : "text-gray-400 group-hover:text-primary"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>
                      )}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-100 mt-2">
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `${commonClasses} ${isActive ? activeClass : inactiveClass}`
            }
          >
            {({ isActive }) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex items-center justify-center transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-primary"
                    }`}
                  >
                    <Clock size={18} />
                  </div>
                  <span className="text-sm">Logout</span>
                </div>
              </div>
            )}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
