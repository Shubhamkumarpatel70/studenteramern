import React, { useEffect, useState } from 'react';
import api from '../config/api';

const AccountantNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data.data);
            } catch (err) {
                setError('Failed to fetch notifications');
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : notifications.length === 0 ? (
                <div>No notifications found.</div>
            ) : (
                <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
                    {notifications.map(n => (
                        <li key={n._id} className="p-4">
                            <div className="font-semibold">{n.title}</div>
                            <div className="text-gray-700">{n.message}</div>
                            <div className="text-xs text-gray-500 mt-1">{new Date(n.date).toLocaleString()}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AccountantNotifications; 