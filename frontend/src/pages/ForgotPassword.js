import React, { useState, useRef, useEffect } from 'react';
import api from '../config/api';
import { Loader2, Mail, ArrowLeft, Lock, User, ShieldCheck, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
    const [countdown, setCountdown] = useState(0);
    const otpRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            if (res.data.success) {
                setMessage('OTP sent to your email address.');
                setStep('otp');
                setCountdown(60);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }

        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', { email, otp: otpString, type: 'forgot_password' });
            if (res.data.success) {
                setResetToken(res.data.resetToken);
                setStep('reset');
                setMessage('OTP verified! Now enter your new password.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setMessage('');
        setError('');
        setLoading(true);
        try {
            // Using the existing reset-password endpoint with the token we got from verify-otp
            const res = await api.put(`/auth/reset-password/${resetToken}`, { password });
            if (res.data.success) {
                setMessage('Password updated successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        if (countdown > 0) return;
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('A new OTP has been sent to your email.');
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            setError('Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12 font-[Inter]">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-gray-100 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                
                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
                            {step === 'email' && <Mail className="h-8 w-8 text-indigo-600" />}
                            {step === 'otp' && <ShieldCheck className="h-8 w-8 text-indigo-600" />}
                            {step === 'reset' && <Lock className="h-8 w-8 text-indigo-600" />}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {step === 'email' && 'Forgot Password?'}
                            {step === 'otp' && 'Verify Email'}
                            {step === 'reset' && 'Set New Password'}
                        </h2>
                        <p className="text-gray-500">
                            {step === 'email' && 'Enter your email to receive a 6-digit verification code.'}
                            {step === 'otp' && `We've sent a code to ${email}`}
                            {step === 'reset' && 'Create a strong password for your account.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-start">
                            <span className="font-medium mr-2">Error:</span> {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-r-lg">
                            {message}
                        </div>
                    )}

                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Send Code'}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleOtpVerify} className="space-y-8">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                                    />
                                ))}
                            </div>
                            <div className="text-center">
                                <p className="text-gray-500 text-sm mb-2">Didn't receive the code?</p>
                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    disabled={countdown > 0 || loading}
                                    className="text-indigo-600 font-bold hover:text-indigo-800 disabled:text-gray-400"
                                >
                                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Verify Code'}
                            </button>
                        </form>
                    )}

                    {step === 'reset' && (
                        <form onSubmit={handlePasswordReset} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
