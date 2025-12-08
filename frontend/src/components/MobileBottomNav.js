import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Menu as MenuIcon, User, LogOut, LayoutDashboard } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const MobileBottomNav = ({ onMenuClick }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/dashboard/overview') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/overview';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      to: '/',
      icon: Home,
      label: 'Home',
      active: location.pathname === '/'
    },
    {
      to: '/dashboard/overview',
      icon: LayoutDashboard,
      label: 'Dashboard',
      active: isActive('/dashboard')
    },
    {
      action: onMenuClick,
      icon: MenuIcon,
      label: 'Menu',
      active: false
    },
    {
      to: '/dashboard/profile',
      icon: User,
      label: 'Profile',
      active: location.pathname === '/dashboard/profile'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isItemActive = item.active;
          
          if (item.action) {
            return (
              <button
                key={index}
                onClick={item.action}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all ${
                  isItemActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
                aria-label={item.label}
              >
                <Icon size={22} className={isItemActive ? 'text-blue-600' : ''} />
                <span className={`text-xs mt-1 ${isItemActive ? 'text-blue-600 font-medium' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={index}
              to={item.to}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all ${
                isItemActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              aria-label={item.label}
            >
              <Icon size={22} className={isItemActive ? 'text-blue-600' : ''} />
              <span className={`text-xs mt-1 ${isItemActive ? 'text-blue-600 font-medium' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all text-gray-600 hover:text-red-600 hover:bg-red-50"
          aria-label="Logout"
        >
          <LogOut size={22} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
