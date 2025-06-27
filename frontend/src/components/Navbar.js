import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

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
            case 'admin':
                return '/admin-dashboard';
            case 'co-admin':
                return '/co-admin-dashboard';
            default:
                return '/dashboard';
        }
    };
    
    const navLinks = (
        <>
            <Link to="/" className="block py-2 px-3 hover:text-indigo-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/internships" className="block py-2 px-3 hover:text-indigo-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Internships</Link>
            <Link to="/about" className="block py-2 px-3 hover:text-indigo-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/verify-certificate" className="block py-2 px-3 hover:text-indigo-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Verify Certificate</Link>
        </>
    );

    const authLinks = (
        !isAuthenticated ? (
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                <Link to="/login" className="w-full md:w-auto text-center px-4 py-2 rounded-md bg-white text-indigo-600 font-semibold hover:bg-indigo-100 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="w-full md:w-auto text-center px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 font-semibold transition-colors duration-200" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                <Link to={getDashboardLink()} className="w-full md:w-auto text-center px-4 py-2 hover:text-indigo-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="w-full md:w-auto text-center px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 font-semibold transition-colors duration-200">Logout</button>
                 {user?.avatar && <img src={user.avatar} alt="avatar" className="h-10 w-10 rounded-full border-2 border-white" />}
            </div>
        )
    );

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="font-bold text-xl md:text-2xl flex items-center gap-3 hover:opacity-90 transition-opacity duration-200">
                        <span>Student Era</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks}
                        {authLinks}
                    </div>

                    {/* Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu" className="p-2 hover:bg-indigo-700 rounded-md transition-colors duration-200">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden pb-4 bg-gradient-to-b from-indigo-600 to-purple-600">
                    <div className="flex flex-col items-center space-y-2">
                        {navLinks}
                        <div className="w-full border-t border-indigo-400 my-2"></div>
                        {authLinks}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 