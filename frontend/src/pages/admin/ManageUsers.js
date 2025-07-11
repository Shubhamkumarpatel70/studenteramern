import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import EditUserModal from '../../components/admin/EditUserModal';
import { Trash, Edit } from 'lucide-react';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_URL || '';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleLoading, setRoleLoading] = useState(null);
    const [roleError, setRoleError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
            alert('Could not fetch users. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                await api.delete(`/users/${userId}`);
                fetchUsers(); // Refresh user list
            } catch (err) {
                console.error('Failed to delete user', err);
                alert('Could not delete user.');
            }
        }
    };

    const handleModalSave = async (updatedUser) => {
        try {
            await api.put(`/users/${updatedUser._id}`, updatedUser);
            setIsModalOpen(false);
            setSelectedUser(null);
            fetchUsers(); // Refresh user list
        } catch (err) {
            console.error('Failed to update user', err);
            alert('Could not update user.');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setRoleLoading(userId);
        setRoleError('');
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (err) {
            setRoleError('Failed to change role');
        } finally {
            setRoleLoading(null);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            {loading ? <p>Loading users...</p> : (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile %</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={user.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${IMAGE_BASE_URL}/${user.profilePicture}`) : '/default-avatar.png'}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full border object-cover shadow"
                                                onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.internId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={user.role}
                                                onChange={e => handleRoleChange(user._id, e.target.value)}
                                                className="border rounded px-2 py-1"
                                                disabled={roleLoading === user._id}
                                            >
                                                <option value="user">User</option>
                                                <option value="co-admin">Co-Admin</option>
                                                <option value="accountant">Accountant</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            {roleLoading === user._id && <span className="ml-2 text-xs text-gray-500">Saving...</span>}
                                            {roleError && <div className="text-xs text-red-500">{roleError}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {user.isVerified ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                {user.profileCompleteness || 0}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={20} /></button>
                                            <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900"><Trash size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <EditUserModal 
                    user={selectedUser} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleModalSave}
                />
            )}
        </div>
    );
};

export default ManageUsers; 