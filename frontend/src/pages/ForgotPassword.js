import React, { useState } from 'react';
import api from '../config/api';
import { Loader2 } from 'lucide-react';

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
            await api.post('/auth/forgotpassword', { email });
            setMessage('An email has been sent with password reset instructions. Please check your inbox and spam folder.');
        } catch (err) {
            setError('Could not send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center border-t-4 border-indigo-500">
                <h2 className="text-3xl font-extrabold mb-2 text-indigo-700">Forgot Password?</h2>
                <p className="mb-6 text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <button
                        className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                        Send Reset Link
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
                {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword; 