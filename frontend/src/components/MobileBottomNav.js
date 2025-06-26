import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, HelpCircle, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const MobileBottomNav = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-200 border-t-4 border-red-500 shadow-lg flex justify-around items-center py-2">
      <Link to="/dashboard" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
        <Home size={24} />
        <span className="text-xs mt-1">Menu</span>
      </Link>
      <Link to="/dashboard/profile" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
        <User size={24} />
        <span className="text-xs mt-1">Account</span>
      </Link>
      <Link to="/dashboard/help" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
        <HelpCircle size={24} />
        <span className="text-xs mt-1">Help</span>
      </Link>
      <button onClick={handleLogout} className="flex flex-col items-center text-gray-600 hover:text-red-600 transition focus:outline-none">
        <LogOut size={24} />
        <span className="text-xs mt-1">Logout</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav; 