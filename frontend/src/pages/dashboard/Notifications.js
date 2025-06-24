import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, Loader2, X } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('/api/notifications', config);
            setNotifications(res.data.data);
        } catch (err) {
            setError('Could not fetch notifications.');
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`/api/notifications/${id}/read`, {}, config);
            
            // Update the state locally to reflect the change immediately
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark as read', err);
            // Optionally set an error state to show in the UI
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <Bell className="mr-3 h-8 w-8 text-indigo-500" /> My Notifications
            </h1>
            <div className="bg-white rounded-lg shadow-md">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        You have no notifications.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {notifications.map(notification => (
                            <li key={notification._id} className={`p-4 flex justify-between items-center transition-colors duration-300 ${notification.read ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}>
                                <div>
                                    <p className={`text-gray-800 ${notification.read ? 'font-normal' : 'font-semibold'}`}>{notification.message}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <button 
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className="text-sm flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                                        title="Mark as read"
                                    >
                                        <Check size={16} /> Mark as Read
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications; 