import React, { useState } from 'react';
import api from '../config/api';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('An email has been sent with password reset instructions. Please check your inbox and spam folder.');
        } catch (err) {
            setError('Could not send reset email. Please try again.');
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
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
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
                        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-4 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-6 w-6 mr-3" />
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                {message && (
                    <div className="mt-6 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-green-800 text-center font-bold text-lg animate-pulse">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-800 text-center font-bold text-lg animate-pulse">
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
