import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, email, password, role } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        // Basic client-side password validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            const res = await register({ name, email, password, role });
            const targetEmail = res?.email || email;
            // Pass along whether the backend reported an email sending problem
            navigate('/otp-verify', { state: { email: targetEmail, emailError: !!res?.emailError } });
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
            setError(message);
            // If user already exists, redirect to login
            if (message.includes('already exists')) {
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] font-[Inter,sans-serif] px-4">
            <div className="bg-[#F8F9FA] rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[#0A2463]">
                <div className="text-center mb-6">
                    <UserPlus className="w-16 h-16 text-[#0A2463] mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold text-[#0A2463] mb-2">Create Account</h1>
                    <p className="text-[#212529] text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-[#28A745] hover:text-[#218838] underline">
                            Sign in
                        </Link>
                    </p>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                            {error.includes('already exists') && (
                                <p className="text-red-600 text-xs mt-1">Redirecting to login page...</p>
                            )}
                        </div>
                    )}
                </div>

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#212529] mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2463] w-5 h-5" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={onChange}
                                className="appearance-none block w-full pl-10 pr-4 py-3 border border-[#0A2463] rounded-lg shadow-sm placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] sm:text-sm bg-[#FFFFFF]"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#212529] mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2463] w-5 h-5" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={onChange}
                                className="appearance-none block w-full pl-10 pr-4 py-3 border border-[#0A2463] rounded-lg shadow-sm placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] sm:text-sm bg-[#FFFFFF]"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#212529] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2463] w-5 h-5" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={onChange}
                                className="appearance-none block w-full pl-10 pr-12 py-3 border border-[#0A2463] rounded-lg shadow-sm placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] sm:text-sm bg-[#FFFFFF]"
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A2463] hover:text-[#28A745]"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#FFFFFF] bg-[#0A2463] hover:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28A745] transition duration-200"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
