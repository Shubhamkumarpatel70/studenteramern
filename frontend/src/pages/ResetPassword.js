import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';

const ResetPassword = () => {
    const { resettoken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        try {
            await api.put(`/auth/reset-password/${resettoken}`, { password });
            setMessage('Password has been reset successfully. You can now log in.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage('Error: Invalid or expired token.');
        }
    };

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const res = await api.get(`/auth/reset-password/${resettoken}`);
                if (res.data && res.data.success) {
                    setName(res.data.data.name || '');
                    setEmail(res.data.data.email || '');
                } else {
                    setMessage(res.data.message || 'Invalid or expired token');
                }
            } catch (err) {
                setMessage(err.response?.data?.message || 'Invalid or expired token');
            }
        };
        if (resettoken) fetchTokenData();
    }, [resettoken]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <form onSubmit={onSubmit}>
                    <div className="text-left mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input className="w-full p-2 border rounded mt-1 bg-gray-100" type="text" value={name} readOnly />
                    </div>
                    <div className="text-left mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input className="w-full p-2 border rounded mt-1 bg-gray-100" type="email" value={email} readOnly />
                    </div>
                    <div className="text-left mb-4">
                        <label className="block text-sm font-medium text-gray-700">Enter new password</label>
                        <input
                            className="w-full p-2 mt-1 border rounded"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="text-left mb-4">
                        <label className="block text-sm font-medium text-gray-700">Re-enter new password</label>
                        <input
                            className="w-full p-2 mt-1 border rounded"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Reset Password
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword; 