import React, { useEffect, useState } from 'react';
import api from '../config/api';

const AccountantMeetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await api.get('/meetings');
                setMeetings(res.data.data);
            } catch (err) {
                setError('Failed to fetch meetings');
            } finally {
                setLoading(false);
            }
        };
        fetchMeetings();
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Meetings</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : meetings.length === 0 ? (
                <div>No meetings found.</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Link</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {meetings.map(meeting => (
                                <tr key={meeting._id}>
                                    <td className="px-4 py-2">{meeting.title}</td>
                                    <td className="px-4 py-2">{new Date(meeting.date).toLocaleString()}</td>
                                    <td className="px-4 py-2">
                                        <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{meeting.link}</a>
                                    </td>
                                    <td className="px-4 py-2">
                                        <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">Join</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AccountantMeetings; 