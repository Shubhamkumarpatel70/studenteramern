import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Mail, RefreshCw, CheckCircle, X, AlertCircle } from 'lucide-react';
import api from '../config/api';

const OTPVerify = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorCountdown, setErrorCountdown] = useState(5);
    const navigate = useNavigate();
    const location = useLocation();
    

    // Get email from URL params first, then fallback to location state
    // Support both navigation state and direct URL query params so the OTP page
    // works when navigated internally (state) or opened directly from an email link.
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get('email');
    const emailErrorFromQuery = params.get('emailError') === 'true';

    const email = location.state?.email || emailFromQuery;
    const emailError = typeof location.state?.emailError !== 'undefined' ? location.state.emailError : emailErrorFromQuery;
    const isAdmin = location.state?.isAdmin || false;

    // Resend timer
    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    // Error modal countdown
    useEffect(() => {
        let timer;
        if (showErrorModal && errorCountdown > 0) {
            timer = setTimeout(() => setErrorCountdown(errorCountdown - 1), 1000);
        } else if (showErrorModal && errorCountdown === 0) {
            navigate('/otp-verify', { state: { email } });
        }
        return () => clearTimeout(timer);
    }, [showErrorModal, errorCountdown, navigate, email]);

    const onVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Use different endpoint for admin OTP verification
            const endpoint = isAdmin ? '/auth/admin-verify-otp' : '/auth/verify-otp';
            const res = await api.post(endpoint, { email, otp });

            if (isAdmin) {
                // For admin, set authentication state and redirect to admin dashboard
                // Since admin-verify-otp returns the token, we need to update the auth context
                // The backend already sends the token, so we can use the login function to set the state
                // But since we already verified, we can directly navigate and let the context load the user
                navigate('/admin-dashboard', { replace: true });
            } else {
                    // For regular users, show success modal briefly then redirect to login
                    setShowSuccessModal(true);
                    // After a short delay, navigate to login so the user can sign in
                    setTimeout(() => navigate('/login'), 1500);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(msg);
            setShowErrorModal(true);
            setErrorCountdown(5);
            console.error(err);
        }
    };

    const onResend = async () => {
        if (!canResend) return;
        try {
            await api.post('/auth/resend-otp', { email });
            setResendTimer(30);
            setCanResend(false);
            alert('A new OTP has been sent to your email.');
        } catch (err) {
            alert('Failed to resend OTP.');
            console.error(err);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 font-[Inter,sans-serif]">
                <p className="text-[#DC3545]">No email found. Please register first.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-[Inter,sans-serif] px-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-6">
                    <Shield className="w-16 h-16 text-[#0A2463] mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-[#0A2463]">
                        {isAdmin ? 'Verify Admin Login' : 'Verify your account'}
                    </h2>
                    <p className="mt-2 text-sm text-[#212529]">
                        We've sent a 6-digit code to {email}.
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#F8F9FA] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#0A2463]">
                    {error && <div className="mb-4 text-[#DC3545] text-center font-semibold">{error}</div>}
                    {emailError && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-yellow-800">
                            We were unable to send the OTP email automatically. Please click "Resend" below or contact support.
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={onVerify}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-[#212529] mb-2">
                                OTP Code
                            </label>
                            <div className="flex gap-2 justify-center">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={otp[index] || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value) {
                                                const newOtp = otp.slice(0, index) + value + otp.slice(index + 1);
                                                setOtp(newOtp);
                                                // Auto-focus next input
                                                if (index < 5 && value) {
                                                    const nextInput = document.getElementById(`otp-${index + 1}`);
                                                    if (nextInput) nextInput.focus();
                                                }
                                            } else {
                                                const newOtp = otp.slice(0, index) + otp.slice(index + 1);
                                                setOtp(newOtp);
                                                // Focus previous input on backspace
                                                if (index > 0) {
                                                    const prevInput = document.getElementById(`otp-${index - 1}`);
                                                    if (prevInput) prevInput.focus();
                                                }
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                                const prevInput = document.getElementById(`otp-${index - 1}`);
                                                if (prevInput) prevInput.focus();
                                            }
                                        }}
                                        id={`otp-${index}`}
                                        className="w-12 h-12 text-center text-xl font-bold border border-[#0A2463] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] bg-[#FFFFFF]"
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#FFFFFF] bg-[#0A2463] hover:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28A745] transition duration-200"
                            >
                                Verify Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={onResend}
                            disabled={!canResend}
                            className={`font-medium underline flex items-center justify-center gap-2 ${canResend ? 'text-[#28A745] hover:text-[#218838]' : 'text-gray-400 cursor-not-allowed'}`}
                        >
                            <RefreshCw className="w-4 h-4" />
                            {canResend ? "Didn't receive a code? Resend" : `Resend in ${resendTimer}s`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-[#0A2463] mb-2">OTP Verified Successfully!</h2>
                        <p className="text-[#212529] mb-4">Your account has been verified. You can now log in.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-semibold hover:bg-[#1C1C1E] transition"
                        >
                            Log in now
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-[#0A2463] mb-2">Verification Failed</h2>
                        <p className="text-[#212529] mb-4">{error}</p>
                        <p className="text-sm text-gray-600 mb-4">Redirecting to try again in {errorCountdown} seconds...</p>
                        <button
                            onClick={() => {
                                setShowErrorModal(false);
                                navigate('/otp-verify', { state: { email } });
                            }}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OTPVerify;
