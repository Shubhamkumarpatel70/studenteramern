import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTPVerify = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const onVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(msg);
            console.error(err);
        }
    };

    const onResend = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
            alert('A new OTP has been sent to your email.');
        } catch (err) {
            alert('Failed to resend OTP.');
            console.error(err);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                <p className="text-red-500">No email found. Please register first.</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Verify your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    We've sent a 6-digit code to {email}.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
                    <form className="space-y-6" onSubmit={onVerify}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                OTP Code
                            </label>
                            <div className="mt-1">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    maxLength="6"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Verify Account
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <button onClick={onResend} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Didn't receive a code? Resend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerify; 