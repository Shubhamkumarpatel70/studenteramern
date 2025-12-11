import React, { useState } from 'react';
import api from '../config/api';
import { Loader2, Mail, ArrowLeft, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('email'); // 'email' or 'password'
    const navigate = useNavigate();

    const handleEmailCheck = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/check-email', { email });
            if (res.data.success && res.data.data) {
                setUserName(res.data.data.name);
                setStep('password');
            } else {
                setError('User not found with this email address.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'User not found with this email address.';
            setError(errorMessage);
            console.error('Check email error:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        
        setLoading(true);
        try {
            const res = await api.put('/auth/reset-password-direct', { email, password });
            if (res.data.success) {
                setMessage('Password updated successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update password. Please try again.';
            setError(errorMessage);
            console.error('Reset password error:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center px-4 py-8">
            <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-indigo-500">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Forgot Password?
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {step === 'email' 
                            ? "Enter your email address to reset your password."
                            : "Enter your new password below."}
                    </p>
                </div>

                {step === 'email' ? (
                    <form onSubmit={handleEmailCheck} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-indigo-400" />
                        <input
                            className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-lg transition-all duration-300"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            aria-label="Email address"
                        />
                    </div>

                    <button
                            type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-4 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-6 w-6 mr-3" />
                                    Checking...
                            </>
                        ) : (
                                'Check Email'
                        )}
                    </button>
                </form>
                ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="h-5 w-5 text-indigo-600" />
                                <span className="text-sm font-semibold text-indigo-800">User Found:</span>
                            </div>
                            <p className="text-lg font-bold text-indigo-900">{userName}</p>
                            <p className="text-sm text-indigo-700 mt-1">{email}</p>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-indigo-400" />
                            <input
                                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-lg transition-all duration-300"
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={6}
                                aria-label="New password"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-indigo-400" />
                            <input
                                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-lg transition-all duration-300"
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={6}
                                aria-label="Confirm password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-4 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-6 w-6 mr-3" />
                                    Updating...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep('email');
                                setPassword('');
                                setConfirmPassword('');
                                setUserName('');
                                setError('');
                                setMessage('');
                            }}
                            className="w-full text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-300"
                        >
                            ← Back to Email
                        </button>
                    </form>
                )}

                {message && (
                    <div className="mt-6 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-green-800 text-center font-bold text-lg">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-800 text-center font-bold text-lg">
                        {error}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-300"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
