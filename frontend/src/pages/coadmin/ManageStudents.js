import React, { useEffect, useState } from 'react';
import api from '../../config/api';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setStudents(res.data.data);
            } catch (err) {
                setError('Failed to fetch students');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
            {loading ? (
                <p>Loading students...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td className="px-6 py-4">{student.name}</td>
                                    <td className="px-6 py-4">{student.email}</td>
                                    <td className="px-6 py-4">{student.role}</td>
                                    <td className="px-6 py-4"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{student.isVerified ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button className="text-teal-600 hover:text-teal-900">View Details</button>
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

export default ManageStudents; 