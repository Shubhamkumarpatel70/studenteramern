import React, { useState, useEffect } from 'react';
import api from '../../config/api';

const currentUserId = 'coadmin123'; // TODO: Replace with real user ID from context/auth

const ViewMeetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        link: '',
        expireAfterMinutes: 60
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const apiConfig = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchMeetings = async () => {
        try {
            const res = await api.get('/meetings', apiConfig());
            setMeetings(res.data.data);
        } catch (err) {
            setError('Failed to fetch meetings');
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const resetForm = () => {
        setFormData({ title: '', date: '', link: '', expireAfterMinutes: 60 });
        setEditMode(false);
        setSelectedMeetingId(null);
    };

    const handleEdit = (meeting) => {
        setEditMode(true);
        setSelectedMeetingId(meeting._id);
        setFormData({
            title: meeting.title,
            date: new Date(meeting.date).toISOString().slice(0, 16),
            link: meeting.link,
            expireAfterMinutes: meeting.expireAfterMinutes || 60
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this meeting?')) {
            try {
                await api.delete(`/meetings/${id}`, apiConfig());
                fetchMeetings();
            } catch (err) {
                setError('Could not delete meeting.');
            }
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const meetingData = {
            title: formData.title,
            date: formData.date,
            link: formData.link,
            expireAfterMinutes: formData.expireAfterMinutes
        };
        try {
            if (editMode) {
                await api.put(`/meetings/${selectedMeetingId}`, meetingData, apiConfig());
                setSuccess('Meeting updated successfully!');
            } else {
                await api.post('/meetings', meetingData, apiConfig());
                setSuccess('Meeting created successfully!');
            }
            fetchMeetings();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Meetings</h1>
            {/* Schedule Meeting Form */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">{editMode ? 'Edit Meeting' : 'Schedule a New Meeting'}</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={onChange} required className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date and Time</label>
                        <input type="datetime-local" name="date" value={formData.date} onChange={onChange} required className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Meeting Link</label>
                        <input type="text" name="link" value={formData.link} onChange={onChange} required className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Meeting Expiration (minutes after start)</label>
                        <input type="number" name="expireAfterMinutes" min="1" value={formData.expireAfterMinutes} onChange={onChange} required className="mt-1 block w-full" />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}
                    <div>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-500 text-white rounded-md">
                            {loading ? 'Processing...' : (editMode ? 'Update Meeting' : 'Schedule Meeting')}
                        </button>
                        {editMode && <button type="button" onClick={resetForm} className="ml-2 px-4 py-2 bg-gray-300 rounded-md">Cancel Edit</button>}
                    </div>
                </form>
            </div>
            {/* Meetings List */}
            <h2 className="text-xl font-semibold mb-2">All Meetings</h2>
            <div className="space-y-4">
                {meetings.map(meeting => (
                    <div key={meeting._id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                            <h2 className="font-bold">{meeting.title}</h2>
                            <p className="text-sm text-gray-500">{new Date(meeting.date).toLocaleString()}</p>
                            <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">Join Meeting</a>
                        </div>
                        {meeting.creatorId === currentUserId && (
                            <div className="flex space-x-2">
                                <button onClick={() => handleEdit(meeting)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                                <button onClick={() => handleDelete(meeting._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewMeetings; 