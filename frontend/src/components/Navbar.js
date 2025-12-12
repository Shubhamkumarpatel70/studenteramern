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
                return '/coadmin';
            case 'accountant':
                return '/accountant';
            default:
                return '/dashboard';
        }
    };
    
    const navLinks = (
        <>
            <Link to="/" className="block py-2 px-3 text-white hover:text-[#0A84FF] transition-colors duration-200" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/internships" className="block py-2 px-3 text-white hover:text-[#0A84FF] transition-colors duration-200" onClick={() => setMenuOpen(false)}>Internships</Link>
            <Link to="/about" className="block py-2 px-3 text-white hover:text-[#0A84FF] transition-colors duration-200" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/verify-certificate" className="block py-2 px-3 text-white hover:text-[#0A84FF] transition-colors duration-200" onClick={() => setMenuOpen(false)}>Verify Certificate</Link>
        </>
    );

    const authLinks = (
        !isAuthenticated ? (
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                <Link to="/login" className="w-full md:w-auto text-center px-4 py-2 rounded-md bg-white text-[#0A84FF] font-semibold hover:bg-[#E0E0E0] transition-colors duration-200" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="w-full md:w-auto text-center px-4 py-2 rounded-md bg-[#FF9F0A] hover:bg-[#FFB800] font-semibold transition-colors duration-200" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                <Link to={getDashboardLink()} className="w-full md:w-auto text-center px-4 py-2 hover:text-[#0A84FF] transition-colors duration-200" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="w-full md:w-auto text-center px-4 py-2 rounded-md bg-[#FF9F0A] hover:bg-[#FFB800] font-semibold transition-colors duration-200">Logout</button>
                 {user?.avatar && <img src={user.avatar} alt="avatar" className="h-10 w-10 rounded-full border-2 border-white" />}
            </div>
        )
    );

    return (
        <nav className="sticky top-0 z-50 font-bold font-[Inter,sans-serif]">
            <div className="max-w-7xl mx-auto px-4 py-2">
                <div className="bg-[#0A2463]/50 backdrop-blur-md shadow-lg rounded-[15px] border border-white/10">
                    <div className="flex justify-between items-center h-20 px-6">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src="/logo192.png" alt="Student Era Logo" className="w-12 h-12 rounded-full bg-white shadow-md group-hover:scale-105 transition-transform duration-200" />
                        </Link>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8 text-lg font-bold font-[Inter,sans-serif]">
                            {navLinks}
                            {authLinks}
                        </div>
                        {/* Hamburger Button - only on small screens */}
                        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu" className="md:hidden p-2 hover:bg-white/10 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]">
                            <svg className={`h-7 w-7 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                    {/* Mobile Menu */}
                    <div className={`md:hidden transition-all duration-300 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}> 
                        <div className="flex flex-col items-center space-y-2 py-4 px-6 border-t border-white/10">
                            {navLinks}
                            <div className="w-full border-t border-white/10 my-2"></div>
                            {authLinks}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 