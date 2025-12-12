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
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <div className="text-center text-error bg-error/10 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-xl p-3">
                            <Bell className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">My Notifications</h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Stay updated with your latest activities</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                                {notifications.filter(n => !n.read).length} unread
                            </span>
                        )}
                        <button 
                            onClick={fetchNotifications} 
                            className="px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl shadow-md transition-all duration-200 text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50" 
                            disabled={loading}
                        >
                            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} /> 
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center min-h-[40vh]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
                            <p className="text-gray-600">Loading notifications...</p>
                        </div>
                    </div>
                ) : (notifications.length === 0 && localNotifications.length === 0) ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gray-100 rounded-full p-6">
                                <Bell className="h-16 w-16 text-orange-600" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Notifications Yet</h3>
                        <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {/* Local notifications (login/registration) */}
                        {localNotifications.map(notification => (
                            <div key={notification._id} className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                                        <Check className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-800 text-sm sm:text-base break-words">{notification.message}</div>
                                        <div className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Backend notifications */}
                        {notifications.map(notification => (
                            <div 
                                key={notification._id} 
                                className={`bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 border transition-all duration-200 ${
                                    !notification.read 
                                        ? 'border-orange-300 shadow-lg hover:shadow-xl' 
                                        : 'border-orange-100/50 hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`rounded-full p-2 flex-shrink-0 ${!notification.read ? 'bg-orange-100' : 'bg-gray-100'}`}>
                                        <Bell className={`h-4 w-4 ${!notification.read ? 'text-orange-600' : 'text-gray-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-semibold text-sm sm:text-base break-words ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {notification.message}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(notification.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notification._id)} 
                                            className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 flex-shrink-0"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications; 