import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Mail, RefreshCw } from 'lucide-react';
import api from '../config/api';

const OTPVerify = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const emailError = location.state?.emailError;

    const onVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/verify-otp', { email, otp });
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(msg);
            console.error(err);
        }
    };

    const onResend = async () => {
        try {
            await api.post('/auth/resend-otp', { email });
            alert('A new OTP has been sent to your email.');
        } catch (err) {
            alert('Failed to resend OTP.');
            console.error(err);
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
                        Verify your account
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
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2463] w-5 h-5" />
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    maxLength="6"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-[#0A2463] rounded-lg shadow-sm placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] sm:text-sm bg-[#FFFFFF]"
                                    placeholder="Enter 6-digit code"
                                />
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
                        <button onClick={onResend} className="font-medium text-[#28A745] hover:text-[#218838] underline flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Didn't receive a code? Resend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerify;
