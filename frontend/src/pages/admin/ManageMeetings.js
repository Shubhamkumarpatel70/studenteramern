import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Trash, Edit } from 'lucide-react';

const ManageMeetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [internships, setInternships] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        link: '',
        targetType: 'all',
        internshipId: '',
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
            console.error('Failed to fetch meetings', err);
        }
    };

    const fetchInternships = async () => {
        try {
            const res = await api.get('/internships', apiConfig());
            setInternships(res.data.data);
        } catch (err) {
            console.error('Failed to fetch internships', err);
        }
    };

    useEffect(() => {
        fetchMeetings();
        fetchInternships();
    }, []);

    const resetForm = () => {
        setFormData({ title: '', date: '', link: '', targetType: 'all', internshipId: '', expireAfterMinutes: 60 });
        setEditMode(false);
        setSelectedMeetingId(null);
    };

    const handleEdit = (meeting) => {
        setEditMode(true);
        setSelectedMeetingId(meeting._id);
        // Convert stored meeting.date (ISO) into a local datetime-local value
        const d = new Date(meeting.date);
        const localISO = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setFormData({
            title: meeting.title,
            date: localISO,
            link: meeting.link,
            targetType: meeting.targetType,
            internshipId: meeting.selectedInternship || '',
            expireAfterMinutes: meeting.expireAfterMinutes || 60
        });
        window.scrollTo(0, 0); // Scroll to top to see the form
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
            // convert local datetime-local value to ISO (UTC)
            date: formData.date ? new Date(formData.date).toISOString() : '',
            link: formData.link,
            targetType: formData.targetType,
            selectedInternship: formData.targetType === 'internship' ? formData.internshipId : undefined,
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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit Meeting' : 'Schedule a New Meeting'}</h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={onChange} required className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date and Time</label>
                        <input type="datetime-local" name="date" value={formData.date} onChange={onChange} required className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
                        <input type="text" name="link" value={formData.link} onChange={onChange} required className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                        <select name="targetType" value={formData.targetType} onChange={onChange} className="mt-1 block w-full">
                            <option value="all">All Users</option>
                            <option value="co-admins">All Co-Admins</option>
                            <option value="accountants">All Accountants</option>
                            <option value="users">Specific Users</option>
                            <option value="internship">Specific Internship</option>
                        </select>
                    </div>
                    {formData.targetType === 'internship' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Internship</label>
                            <select name="internshipId" value={formData.internshipId} onChange={onChange} required className="mt-1 block w-full">
                                <option value="">--Select Internship--</option>
                                {internships.map(internship => (
                                    <option key={internship._id} value={internship._id}>{internship.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Meeting Expiration (minutes after start)</label>
                        <input type="number" name="expireAfterMinutes" min="1" value={formData.expireAfterMinutes} onChange={onChange} required className="mt-1 block w-full" />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}
                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4">
                            {loading ? 'Processing...' : (editMode ? 'Update Meeting' : 'Schedule Meeting')}
                        </button>
                    </div>
                    {editMode && <button type="button" onClick={resetForm} className="w-full flex justify-center py-2 px-4 mt-2">Cancel Edit</button>}
                </form>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Scheduled Meetings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {meetings.map(meeting => (
                                <tr key={meeting._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{meeting.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(meeting.date).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">{meeting.targetType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {meeting.user && (
                                            <span>
                                                {meeting.user.name} <br />
                                                <span className="text-xs text-gray-500">{meeting.user.email}</span>
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(meeting)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={20} /></button>
                                        <button onClick={() => handleDelete(meeting._id)} className="text-red-600 hover:text-red-900"><Trash size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageMeetings; 