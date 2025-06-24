import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { resettoken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/auth/resetpassword/${resettoken}`, { password });
            setMessage('Password has been reset successfully. You can now log in.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage('Error: Invalid or expired token.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <form onSubmit={onSubmit}>
                    <input
                        className="w-full p-2 mb-4 border rounded"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        className="w-full p-2 mb-4 border rounded"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
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