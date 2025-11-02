import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const user = await login(email, password);
        if (user) {
            // Redirect to the page the user was trying to access, or to a default based on role
            if (from !== '/') {
                navigate(from, { replace: true });
            } else {
                switch (user.role) {
                    case 'admin':
                        navigate('/admin-dashboard', { replace: true });
                        break;
                    case 'co-admin':
                        navigate('/coadmin', { replace: true });
                        break;
                    case 'accountant':
                        navigate('/accountant', { replace: true });
                        break;
                    default:
                        navigate('/dashboard', { replace: true });
                }
            }
        }
        // If login fails, an error is logged in the context, and we stay on the login page.
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] font-[Inter,sans-serif] px-4">
            <div className="bg-[#F8F9FA] rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[#0A2463]">
                <div className="text-center mb-6">
                    <LogIn className="w-16 h-16 text-[#0A2463] mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold text-[#0A2463] mb-2">Welcome Back</h1>
                    <p className="text-[#212529] text-sm">
                        Sign in to your account or{' '}
                        <Link to="/register" className="font-medium text-[#28A745] hover:text-[#218838] underline">
                            create a new account
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={onSubmit}>
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
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={onChange}
                                className="appearance-none block w-full pl-10 pr-12 py-3 border border-[#0A2463] rounded-lg shadow-sm placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] sm:text-sm bg-[#FFFFFF]"
                                placeholder="Enter your password"
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

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-[#28A745] hover:text-[#218838] underline">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#FFFFFF] bg-[#0A2463] hover:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28A745] transition duration-200"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
