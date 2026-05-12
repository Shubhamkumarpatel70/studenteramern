import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

const OTPModal = ({ isOpen, onClose, email, onVerify, onResend, loading }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const otpRefs = useRef([]);

    useEffect(() => {
        if (isOpen) {
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
            setError('');
            // Focus first input after animation
            setTimeout(() => {
                if (otpRefs.current[0]) otpRefs.current[0].focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (countdown > 0 && isOpen) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, isOpen]);

    if (!isOpen) return null;

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits.');
            return;
        }
        setError('');
        onVerify(otpString);
    };

    const handleResend = () => {
        if (countdown > 0) return;
        onResend();
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        setError('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="relative p-8 text-center">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-6">
                        <ShieldCheck className="h-10 w-10 text-indigo-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                    <p className="text-gray-500 mb-8 px-4">
                        We've sent a 6-digit verification code to <br/>
                        <span className="font-semibold text-gray-800">{email}</span>
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-between gap-2 max-w-xs mx-auto">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (otpRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-bold bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-6 w-6" />
                                ) : (
                                    <>
                                        Verify & Register
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-gray-500 text-sm mb-1">Didn't receive the code?</p>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={countdown > 0 || loading}
                                    className="text-indigo-600 font-bold hover:text-indigo-800 disabled:text-gray-400 text-sm"
                                >
                                    {countdown > 0 ? `Resend available in ${countdown}s` : 'Resend Verification Code'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex items-center justify-center">
                        <Mail className="h-3 w-3 mr-2" />
                        Secure Verification by Student Era
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTPModal;
