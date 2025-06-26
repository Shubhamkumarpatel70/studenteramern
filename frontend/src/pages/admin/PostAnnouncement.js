import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Trash2 } from 'lucide-react';

const PostAnnouncement = () => {
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            const { data } = await api.get('/announcements');
            setAnnouncements(data.data);
        } catch (err) {
            console.error("Could not fetch announcements", err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.post('/announcements', { message, link }, config);
            
            setSuccess('Announcement posted successfully!');
            setMessage('');
            setLink('');
            fetchAnnouncements(); // Refresh to show the new announcement
        } catch (err) {
            setError(err.response?.data?.message || 'Could not post announcement.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await api.delete(`/announcements/${id}`, config);
                fetchAnnouncements(); // Refresh the list
            } catch (err) {
                 setError('Could not delete announcement.');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Announcements</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Form to post */}
                <div className="bg-white p-8 rounded-lg shadow-md self-start">
                    <h2 className="text-xl font-bold mb-4">Post a New Announcement</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Announcement Message</label>
                            <textarea
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows="3"
                                placeholder="e.g., New batch for Web Development starting soon!"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link (optional)</label>
                            <input
                                type="text"
                                name="link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="e.g., /internships/web-development"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm p-3 bg-red-100 rounded">{error}</div>}
                        {success && <div className="text-green-500 text-sm p-3 bg-green-100 rounded">{success}</div>}

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
                                {loading ? 'Posting...' : 'Post Announcement'}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Display current announcements */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Current Announcements</h2>
                    <div className="space-y-4">
                        {announcements.length > 0 ? (
                            announcements.map(announcement => (
                                <div key={announcement._id} className="bg-indigo-100 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-indigo-800">{announcement.message}</p>
                                            {announcement.link && (
                                                <a href={announcement.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                                                    Go to link
                                                </a>
                                            )}
                                        </div>
                                        <button onClick={() => handleDelete(announcement._id)} className="text-red-500 hover:text-red-700 flex-shrink-0 ml-4">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">There are no active announcements.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostAnnouncement;
