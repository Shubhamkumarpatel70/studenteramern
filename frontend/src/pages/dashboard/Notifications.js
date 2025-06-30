import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/api';
import { Bell, Check, Loader2, X, RefreshCw } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { localNotifications } = useContext(AuthContext);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/notifications', config);
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
        const interval = setInterval(fetchNotifications, 30000); // auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put(`/notifications/${id}/read`, {}, config);
            
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
        <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-full">
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="h-7 w-7 text-indigo-600" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Notifications</h1>
                    <span className="ml-auto flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">{notifications.filter(n => !n.read).length} unread</span>
                        <button onClick={fetchNotifications} className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-xs sm:text-sm flex items-center gap-1" disabled={loading}>
                            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} /> Refresh
                        </button>
                    </span>
                </div>
                {loading ? (
                    <div className="text-center py-8">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No notifications yet.</div>
                ) : (
                    <div className="space-y-4">
                        {/* Local notifications (login/registration) */}
                        {localNotifications.map(notification => (
                            <div key={notification._id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800">{notification.message}</div>
                                    <div className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                        {/* Backend notifications */}
                        {notifications.map(notification => (
                            <div key={notification._id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800">{notification.message}</div>
                                    <div className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString()}</div>
                                </div>
                                {!notification.read && (
                                    <button onClick={() => handleMarkAsRead(notification._id)} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-200 transition">Mark as Read</button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications; 