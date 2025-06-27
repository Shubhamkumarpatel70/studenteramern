import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Menu as MenuIcon, User, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const MobileBottomNav = ({ onMenuClick }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-200 border-t-4 border-red-500 shadow-lg flex justify-around items-center py-2 md:hidden">
      <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <button onClick={onMenuClick} className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition focus:outline-none">
        <MenuIcon size={24} />
        <span className="text-xs mt-1">Menu</span>
      </button>
      <Link to="/dashboard/profile" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
        <User size={24} />
        <span className="text-xs mt-1">Account</span>
      </Link>
      <button onClick={handleLogout} className="flex flex-col items-center text-gray-600 hover:text-red-600 transition focus:outline-none">
        <LogOut size={24} />
        <span className="text-xs mt-1">Logout</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav; 