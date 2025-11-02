import React, { useState, useEffect } from 'react';
import api from '../../config/api';

const ScheduleMeeting = () => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        link: '',
        expireAfterMinutes: 60,
        targetType: 'all', // all, users, internship
        selectedUsers: [],
        selectedInternship: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [internships, setInternships] = useState([]);

    const apiConfig = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users', apiConfig());
            setUsers(res.data.data);
        } catch (err) {
            setError('Failed to fetch users');
        }
    };

    const fetchInternships = async () => {
        try {
            const res = await api.get('/internships/public');
            setInternships(res.data.data);
        } catch (err) {
            setError('Failed to fetch internships');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchInternships();
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const meetingData = {
            title: formData.title,
            // convert local datetime-local value to ISO (UTC) so backend stores a timezone-aware timestamp
            date: formData.date ? new Date(formData.date).toISOString() : '',
            link: formData.link,
            expireAfterMinutes: formData.expireAfterMinutes,
            targetType: formData.targetType,
            selectedUsers: formData.targetType === 'users' ? formData.selectedUsers : [],
            selectedInternship: formData.targetType === 'internship' ? formData.selectedInternship : ''
        };
        try {
            await api.post('/meetings', meetingData, apiConfig());
            setSuccess('Meeting scheduled successfully!');
            setFormData({ title: '', date: '', link: '', expireAfterMinutes: 60, targetType: 'all', selectedUsers: [], selectedInternship: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUserSelect = e => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, selectedUsers: options });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Schedule Meeting</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={onChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Date and Time</label>
                    <input type="datetime-local" name="date" value={formData.date} onChange={onChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Meeting Link</label>
                    <input type="text" name="link" value={formData.link} onChange={onChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Meeting Expiration (minutes after start)</label>
                    <input type="number" name="expireAfterMinutes" min="1" value={formData.expireAfterMinutes} onChange={onChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Target Audience</label>
                    <select name="targetType" value={formData.targetType} onChange={onChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        <option value="all">All Users</option>
                        <option value="users">Selected Users</option>
                        <option value="internship">Selected Internship</option>
                    </select>
                </div>
                {formData.targetType === 'users' && (
                    <div>
                        <label className="block text-sm font-medium">Select Users</label>
                        <select multiple value={formData.selectedUsers} onChange={handleUserSelect} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            {users.map(user => (
                                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                            ))}
                        </select>
                    </div>
                )}
                {formData.targetType === 'internship' && (
                    <div>
                        <label className="block text-sm font-medium">Select Internship</label>
                        <select name="selectedInternship" value={formData.selectedInternship} onChange={onChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            <option value="">Select Internship</option>
                            {internships.map(internship => (
                                <option key={internship._id} value={internship._id}>{internship.title}</option>
                            ))}
                        </select>
                    </div>
                )}
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-500 text-sm">{success}</div>}
                <div>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                        {loading ? 'Scheduling...' : 'Schedule Meeting'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleMeeting;
