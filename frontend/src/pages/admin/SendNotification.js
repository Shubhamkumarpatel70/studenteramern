import React, { useState } from 'react';
import axios from 'axios';
import { Send, User, Users, AtSign, Loader2 } from 'lucide-react';

const SendNotification = () => {
    const [message, setMessage] = useState('');
    const [targetType, setTargetType] = useState('all');
    const [targetValue, setTargetValue] = useState(''); // For email or domain
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!message) {
            setError('Please enter a notification message.');
            setLoading(false);
            return;
        }

        let target = { type: targetType };
        if (targetType === 'user') {
            if (!targetValue) {
                setError('Please enter a user email.');
                setLoading(false);
                return;
            }
            target.email = targetValue;
        } else if (targetType === 'domain') {
            if (!targetValue) {
                setError('Please enter an email domain.');
                setLoading(false);
                return;
            }
            target.domain = targetValue;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post('/api/notifications', { message, target }, config);

            setSuccess(res.data.message || 'Notification sent successfully!');
            setMessage('');
            setTargetValue('');

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send notification.');
        } finally {
            setLoading(false);
        }
    };
    
    const TargetIcon = () => {
        switch(targetType) {
            case 'user': return <User className="h-5 w-5 text-gray-400" />;
            case 'domain': return <AtSign className="h-5 w-5 text-gray-400" />;
            default: return null;
        }
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-start">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Send a Notification</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your notification here..."
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Audience
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Radio buttons for targeting */}
                            <label className={`p-4 border rounded-lg cursor-pointer ${targetType === 'all' ? 'bg-indigo-50 border-indigo-500' : ''}`}><input type="radio" name="targetType" value="all" checked={targetType === 'all'} onChange={(e) => setTargetType(e.target.value)} className="mr-2"/>All Users</label>
                            <label className={`p-4 border rounded-lg cursor-pointer ${targetType === 'co-admins' ? 'bg-indigo-50 border-indigo-500' : ''}`}><input type="radio" name="targetType" value="co-admins" checked={targetType === 'co-admins'} onChange={(e) => setTargetType(e.target.value)} className="mr-2"/>All Co-Admins</label>
                            <label className={`p-4 border rounded-lg cursor-pointer ${targetType === 'user' ? 'bg-indigo-50 border-indigo-500' : ''}`}><input type="radio" name="targetType" value="user" checked={targetType === 'user'} onChange={(e) => setTargetType(e.target.value)} className="mr-2"/>Specific User</label>
                            <label className={`p-4 border rounded-lg cursor-pointer ${targetType === 'domain' ? 'bg-indigo-50 border-indigo-500' : ''}`}><input type="radio" name="targetType" value="domain" checked={targetType === 'domain'} onChange={(e) => setTargetType(e.target.value)} className="mr-2"/>Email Domain</label>
                        </div>
                    </div>

                    {(targetType === 'user' || targetType === 'domain') && (
                        <div>
                            <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 capitalize">
                                {targetType === 'user' ? 'User Email' : 'Domain (e.g., example.com)'}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <TargetIcon />
                                </div>
                                <input
                                    type={targetType === 'user' ? 'email' : 'text'}
                                    id="targetValue"
                                    value={targetValue}
                                    onChange={(e) => setTargetValue(e.target.value)}
                                    placeholder={targetType === 'user' ? 'user@example.com' : 'university.edu'}
                                    className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    
                    {error && <div className="text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</div>}
                    {success && <div className="text-green-600 bg-green-100 p-3 rounded-md text-center">{success}</div>}

                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                            {loading ? <Loader2 className="animate-spin" /> : <Send />}
                            {loading ? 'Sending...' : 'Send Notification'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendNotification; 