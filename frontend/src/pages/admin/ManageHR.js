import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Trash, Edit, Plus, X } from 'lucide-react';

const ManageHR = () => {
    const [hrs, setHrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHR, setEditingHR] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        internshipCategory: '',
        email: '',
        phone: '',
        isActive: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [internships, setInternships] = useState([]);
    const [relatedInternships, setRelatedInternships] = useState([]);

    const fetchHRs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/hr', config);
            setHrs(res.data.data);
        } catch (err) {
            console.error('Failed to fetch HRs', err);
            setError('Failed to load HRs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHRs();
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/internships', config);
            setInternships(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch internships', err);
        }
    };

    useEffect(() => {
        if (formData.internshipCategory && formData.internshipCategory.trim() !== '') {
            const categoryLower = formData.internshipCategory.toLowerCase();
            const related = internships.filter(internship => {
                if (!internship.title) return false;
                const titleLower = internship.title.toLowerCase();
                // Check if category matches title or vice versa
                return titleLower.includes(categoryLower) || 
                       categoryLower.includes(titleLower) ||
                       titleLower.split(' ').some(word => categoryLower.includes(word)) ||
                       categoryLower.split(' ').some(word => titleLower.includes(word));
            });
            setRelatedInternships(related);
        } else {
            setRelatedInternships([]);
        }
    }, [formData.internshipCategory, internships]);

    const handleEdit = (hr) => {
        setEditingHR(hr);
        setFormData({
            name: hr.name || '',
            internshipCategory: hr.internshipCategory || '',
            email: hr.email || '',
            phone: hr.phone || '',
            isActive: hr.isActive !== undefined ? hr.isActive : true
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this HR? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.delete(`/hr/${id}`, config);
            fetchHRs();
            setSuccess('HR deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Failed to delete HR', err);
            setError('Failed to delete HR');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            if (editingHR) {
                await api.put(`/hr/${editingHR._id}`, formData, config);
                setSuccess('HR updated successfully');
            } else {
                await api.post('/hr', formData, config);
                setSuccess('HR created successfully');
            }
            
            setIsModalOpen(false);
            setEditingHR(null);
            setFormData({ name: '', internshipCategory: '', email: '', phone: '', isActive: true });
            fetchHRs();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Failed to save HR', err);
            setError(err.response?.data?.message || 'Failed to save HR');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingHR(null);
        setFormData({ name: '', internshipCategory: '', email: '', phone: '', isActive: true });
        setError('');
    };

    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Manage HR</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    Add HR
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    {success}
                </div>
            )}

            {loading ? (
                <p>Loading HRs...</p>
            ) : (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        HR Name
                                    </th>
                                    <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Internship Category
                                    </th>
                                    <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Phone
                                    </th>
                                    <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-2 sm:px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {hrs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No HRs found. Click "Add HR" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    hrs.map((hr) => (
                                        <tr key={hr._id} className="hover:bg-gray-50">
                                            <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                                {hr.name}
                                            </td>
                                            <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                                    {hr.internshipCategory}
                                                </span>
                                            </td>
                                            <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                                                {hr.email || '-'}
                                            </td>
                                            <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                                                {hr.phone || '-'}
                                            </td>
                                            <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        hr.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {hr.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(hr)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(hr._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">
                                {editingHR ? 'Edit HR' : 'Add New HR'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    HR Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter HR name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Internship Category *
                                </label>
                                <input
                                    type="text"
                                    name="internshipCategory"
                                    value={formData.internshipCategory}
                                    onChange={onChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="e.g., Web Development, Data Science, etc."
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Category should match internship titles (e.g., "Web Development" matches "Web Development Internship")
                                </p>
                                {relatedInternships.length > 0 && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                        <p className="text-xs font-semibold text-blue-800 mb-2">
                                            Related Internships ({relatedInternships.length}):
                                        </p>
                                        <div className="space-y-1 max-h-40 overflow-y-auto">
                                            {relatedInternships.map((internship) => (
                                                <div
                                                    key={internship._id}
                                                    className="text-xs p-2 bg-white border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                                                >
                                                    <div className="font-semibold text-blue-700">
                                                        {internship.title}
                                                    </div>
                                                    {internship.company && (
                                                        <div className="text-gray-600 text-xs mt-0.5">
                                                            {internship.company}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter email (optional)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={onChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter phone (optional)"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={onChange}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Active
                                </label>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    {editingHR ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageHR;

