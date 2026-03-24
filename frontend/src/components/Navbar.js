import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'admin': return '/admin-dashboard';
            case 'co-admin': return '/coadmin';
            case 'accountant': return '/accountant';
            default: return '/dashboard';
        }
    };

    const navLinks = (
        <>
            <Link to="/" className="block py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/internships" className="block py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Internships</Link>
            <Link to="/about" className="block py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/verify-certificate" className="block py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Verify Certificate</Link>
        </>
    );

    const authLinks = (
        !isAuthenticated ? (
            <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
                <Link to="/login" className="w-full md:w-auto text-center px-4 py-2 rounded-lg bg-gray-50 text-gray-700 font-bold text-sm border border-gray-200 hover:bg-gray-100 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="w-full md:w-auto text-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors duration-200" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
                <Link to={getDashboardLink()} className="w-full md:w-auto text-center px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 bg-transparent" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="w-full md:w-auto text-center px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors duration-200">Logout</button>
                {user?.avatar && <img src={user.avatar} alt="avatar" className="h-9 w-9 rounded-full border border-gray-200 bg-gray-50 object-cover hidden md:block" />}
            </div>
        )
    );

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 font-sans transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <img src="/logo192.png" alt="Student Era Logo" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-200 object-contain p-0.5 bg-white" />
                        <span className="font-extrabold text-gray-900 tracking-tight text-lg sm:text-xl hidden sm:block">Student Era</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks}
                    </div>

                    <div className="hidden md:flex items-center">
                        {authLinks}
                    </div>

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                        className="md:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors focus:outline-none"
                    >
                        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
                <div className="px-4 pt-2 pb-6 space-y-1 shadow-xl">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        {user?.avatar && <img src={user.avatar} alt="avatar" className="h-10 w-10 rounded-full border border-gray-200 object-cover" />}
                        {user && <span className="font-bold text-gray-900">{user.name}</span>}
                    </div>
                    {navLinks}
                    <div className="border-t border-gray-100 my-4 pt-4">
                        {authLinks}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;