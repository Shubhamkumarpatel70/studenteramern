import React, { useState, useContext } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import api from '../../config/api';
import AuthContext from '../../context/AuthContext';

const Feedback = () => {
    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (rating === 0) {
            setError('Please select a rating');
            setLoading(false);
            return;
        }

        if (!description.trim()) {
            setError('Please provide a description');
            setLoading(false);
            return;
        }

        if (description.trim().length > 500) {
            setError('Description cannot exceed 500 characters');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await api.post('/feedback', {
                rating,
                description: description.trim(),
                isPublic
            }, config);

            setSuccess('Thank you for your feedback!');
            setRating(0);
            setDescription('');
            setIsPublic(true);
            
            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Feedback</h1>
                <p className="text-gray-600">We value your opinion! Please share your experience with us.</p>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-800">{success}</p>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`h-10 w-10 transition-colors ${
                                        star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        maxLength={500}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Please share your feedback, suggestions, or any issues you encountered..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {description.length}/500 characters
                    </p>
                </div>

                {/* Public/Private Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                        Make this feedback public (default: checked)
                    </label>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading || rating === 0 || !description.trim()}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            loading || rating === 0 || !description.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5" />
                                <span>Submit Feedback</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Feedback;

