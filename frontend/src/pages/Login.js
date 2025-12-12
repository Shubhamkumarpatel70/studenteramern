import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, X, RefreshCw } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../config/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', captcha: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaData, setCaptchaData] = useState(null);
    const [loadingCaptcha, setLoadingCaptcha] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // Fetch CAPTCHA on component mount
    useEffect(() => {
        fetchCaptcha();
    }, []);

    // Show success message if redirected from registration
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [location.state]);

    // Fetch CAPTCHA from backend
    const fetchCaptcha = async () => {
        setLoadingCaptcha(true);
        try {
            const res = await api.get('/captcha/generate');
            if (res.data.success) {
                setCaptchaData(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch CAPTCHA:', err);
            setError('Failed to load CAPTCHA. Please refresh the page.');
        } finally {
            setLoadingCaptcha(false);
        }
    };

    const getRedirectPath = (role) => {
        switch (role) {
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

    const { email, password, captcha } = formData;

    // Check if captcha matches exactly (case-insensitive)
    const isCaptchaValid = captchaData && captcha && captcha.trim().toUpperCase() === captchaData.code.toUpperCase();
    
    // Button should be disabled if captcha doesn't match or is submitting
    const isButtonDisabled = !isCaptchaValid || isSubmitting || !captchaData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        
        // Validate CAPTCHA
        if (!captcha || !captchaData) {
            setError('Please enter the CAPTCHA code');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await login(email.toLowerCase(), password, captchaData.captchaId, captcha);
            if (result && !result.error) {
                // For all users (admin and regular), redirect to dashboard after login
                const redirectPath = from !== '/' ? from : getRedirectPath(result.role);
                navigate(redirectPath, { replace: true });
            } else {
                const errorMessage = result?.error || 'Login failed';
                if (errorMessage.includes('CAPTCHA')) {
                    setError(errorMessage);
                    // Refresh CAPTCHA on error
                    fetchCaptcha();
                    setFormData({ ...formData, captcha: '' });
                } else if (errorMessage === 'Invalid credentials') {
                    setError('Invalid email or password. Please check your credentials and try again.');
                    // Refresh CAPTCHA on error
                    fetchCaptcha();
                    setFormData({ ...formData, captcha: '' });
                } else if (errorMessage === 'Your account is pending deletion and cannot be accessed. Please contact support if this is a mistake.') {
                    setError('Your account is pending deletion. Please contact support for assistance.');
                } else {
                    // Show modal for unregistered user
                    setShowModal(true);
                    setCountdown(5);
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Countdown timer for auto-redirect
    useEffect(() => {
        let timer;
        if (showModal && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (showModal && countdown === 0) {
            navigate('/register');
        }
        return () => clearTimeout(timer);
    }, [showModal, countdown, navigate]);

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

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">{successMessage}</p>
                    </div>
                )}

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

                    {/* CAPTCHA Section */}
                    <div>
                        <label htmlFor="captcha" className="block text-sm font-medium text-[#212529] mb-2">
                            Enter CAPTCHA
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 flex items-center gap-2 bg-white border-2 border-[#0A2463] rounded-lg p-3 font-mono text-2xl font-bold text-[#0A2463] tracking-wider justify-center min-h-[50px]">
                                {loadingCaptcha ? (
                                    <RefreshCw className="w-6 h-6 animate-spin text-[#0A2463]" />
                                ) : captchaData ? (
                                    captchaData.code
                                ) : (
                                    '----'
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={fetchCaptcha}
                                disabled={loadingCaptcha}
                                className="p-2 border border-[#0A2463] rounded-lg hover:bg-[#0A2463] hover:text-white transition-colors disabled:opacity-50"
                                title="Refresh CAPTCHA"
                            >
                                <RefreshCw className={`w-5 h-5 ${loadingCaptcha ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <input
                            id="captcha"
                            name="captcha"
                            type="text"
                            required
                            value={captcha}
                            onChange={onChange}
                            maxLength={4}
                            className="mt-2 appearance-none block w-full px-4 py-3 border border-[#0A2463] rounded-lg shadow-sm placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] sm:text-sm bg-[#FFFFFF] uppercase"
                            placeholder="Enter CAPTCHA"
                            style={{ textTransform: 'uppercase' }}
                        />
                        <p className="mt-1 text-xs text-[#6C757D]">Enter the 4-character code shown above</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-[#28A745] hover:text-[#218838] underline">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isButtonDisabled}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#FFFFFF] ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0A2463] hover:bg-[#1C1C1E]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28A745] transition duration-200`}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                        {!isCaptchaValid && captcha && captchaData && (
                            <p className="mt-2 text-xs text-red-600 text-center">CAPTCHA does not match. Please enter the exact code shown above.</p>
                        )}
                    </div>
                </form>
            </div>

            {/* Modal for unregistered user */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center">
                        <div className="flex justify-between items-center mb-4">
                            <AlertCircle className="w-8 h-8 text-[#FF3B30] mx-auto" />
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-[#0A2463] mb-2">Account Not Found</h2>
                        <p className="text-[#212529] mb-4">
                            It looks like you are not registered yet. Would you like to create an account?
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Redirecting to registration in {countdown} seconds...
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-[#28A745] text-white rounded-lg font-semibold hover:bg-[#218838] transition"
                                onClick={() => setShowModal(false)}
                            >
                                Register Now
                            </Link>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
