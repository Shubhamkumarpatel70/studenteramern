import React, { useState } from 'react';
import api from '../config/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await api.post('/auth/forgotpassword', { email });
            setMessage('An email has been sent with password reset instructions.');
        } catch (err) {
            setMessage('Error: Could not send email.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                <p className="mb-6">Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={onSubmit}>
                    <input
                        className="w-full p-2 mb-4 border rounded"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Send Reset Link
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword; 