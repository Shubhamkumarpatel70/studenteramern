import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Star, Trash2, User, Mail, Calendar, MessageSquare } from 'lucide-react';

const ManageFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get('/feedback', config);
            setFeedbacks(res.data.data);
        } catch (err) {
            setError('Failed to load feedbacks');
            console.error('Failed to fetch feedbacks', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/feedback/${id}`, config);
            fetchFeedbacks(); // Refresh the list
        } catch (err) {
            console.error('Failed to delete feedback', err);
            alert('Could not delete feedback.');
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">({rating}/5)</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">User Feedback</h1>
                <p className="text-gray-600">View and manage all user feedback submissions</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {feedbacks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Feedback Yet</h3>
                    <p className="text-gray-500">Users haven't submitted any feedback yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {feedbacks.map((feedback) => (
                        <div
                            key={feedback._id}
                            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            {/* User Info */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center">
                                        {feedback.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {feedback.user?.name || 'Unknown User'}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {feedback.user?.email || 'N/A'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {feedback.user?.internId || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(feedback._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete feedback"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Rating */}
                            <div className="mb-4">
                                {renderStars(feedback.rating)}
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <p className="text-gray-700 leading-relaxed">{feedback.description}</p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(feedback.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        feedback.isPublic
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {feedback.isPublic ? 'Public' : 'Private'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Statistics */}
            {feedbacks.length > 0 && (
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Feedback Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">{feedbacks.length}</p>
                            <p className="text-sm text-gray-600 mt-1">Total Feedbacks</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-3xl font-bold text-green-600">
                                {(feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-3xl font-bold text-purple-600">
                                {feedbacks.filter(f => f.rating === 5).length}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">5 Star Ratings</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-3xl font-bold text-yellow-600">
                                {feedbacks.filter(f => f.isPublic).length}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Public Feedbacks</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFeedback;

