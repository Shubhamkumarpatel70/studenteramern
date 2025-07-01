import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash } from 'lucide-react';
import EditInternshipModal from './EditInternshipModal';

const AddInternship = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        shortDescription: '',
        description: '',
        image: '',
        technologies: '',
        stipend: 0,
        location: 'Remote',
        duration: '4 Weeks',
        isAccepting: true,
        features: [],
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasStipend, setHasStipend] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState(null);

    const fetchInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/internships', config);
            setInternships(res.data.data);
        } catch (err) {
            console.error('Failed to fetch internships', err);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    const { 
        title, 
        company,
        shortDescription, 
        description, 
        image,
        technologies, 
        stipend, 
        location, 
        duration, 
        isAccepting,
        features,
    } = formData;

    const handleStipendCheck = (e) => {
        const isChecked = e.target.checked;
        setHasStipend(isChecked);
        if (!isChecked) {
            setFormData({ ...formData, stipend: 0 });
        }
    };

    const onChange = e => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const internshipData = { 
            ...formData, 
            technologies: technologies.split(',').map(s => s.trim()) 
        };
        
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            
            await api.post('/internships', internshipData, config);
            
            setSuccess('Internship created successfully!');
            fetchInternships(); // Refresh the list
            setFormData({ // Reset form
                title: '',
                company: '',
                shortDescription: '',
                description: '',
                image: '',
                technologies: '',
                stipend: 0,
                location: 'Remote',
                duration: '4 Weeks',
                isAccepting: true,
                features: [],
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Could not create internship.');
            console.error('Failed to create internship', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this internship?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await api.delete(`/internships/${id}`, config);
                fetchInternships(); // Refresh the list
            } catch (err) {
                console.error('Failed to delete internship', err);
                setError('Could not delete internship.');
            }
        }
    };

    const handleEdit = (internship) => {
        setSelectedInternship(internship);
        setIsModalOpen(true);
    };

    const handleSave = async (updatedInternship) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put(`/internships/${updatedInternship._id}`, updatedInternship, config);
            
            setIsModalOpen(false);
            fetchInternships(); // Refresh list
        } catch (err) {
            console.error('Failed to update internship', err);
            // You can set an error state here to show in the modal
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Internships</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Add a New Internship</h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" value={title} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input type="text" name="company" value={company} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    
                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input type="text" name="image" value={image} onChange={onChange} required placeholder="https://example.com/image.png" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Description (for cards)</label>
                        <textarea name="shortDescription" value={shortDescription} onChange={onChange} required rows="2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>

                    {/* Full Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Description</label>
                        <textarea name="description" value={description} onChange={onChange} required rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>

                    {/* Technologies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
                        <input type="text" name="technologies" value={technologies} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Stipend Toggle and Input */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input type="checkbox" name="hasStipend" checked={hasStipend} onChange={handleStipendCheck} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm font-medium text-gray-700">Offer Stipend?</label>
                        </div>
                        {hasStipend && (
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Stipend (per month)</label>
                                <input type="number" name="stipend" value={stipend} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        )}
                    </div>
                    
                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (e.g., 4 Weeks)</label>
                        <input type="text" name="duration" value={duration} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Is Accepting Applications */}
                    <div className="flex items-center">
                        <input type="checkbox" name="isAccepting" checked={isAccepting} onChange={onChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label className="ml-2 block text-sm text-gray-900">Accepting Applications</label>
                    </div>

                    {/* Features */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Features</label>
                        <textarea name="features" value={features ? features.join('\n') : ''} onChange={e => setFormData(prev => ({ ...prev, features: e.target.value.split(/\n/).map(f => f.trim()).filter(f => f.length > 0) }))} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>

                    {error && <div className="text-red-500 text-sm p-3 bg-red-100 rounded">{error}</div>}
                    {success && <div className="text-green-500 text-sm p-3 bg-green-100 rounded">{success}</div>}

                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                            {loading ? 'Creating...' : 'Create Internship'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Internships Table */}
            <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Existing Internships</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {internships.map(internship => (
                                <tr key={internship._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{internship.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{internship.company}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${internship.isAccepting ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {internship.isAccepting ? 'Accepting' : 'Closed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(internship)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={20} /></button>
                                        <button onClick={() => handleDelete(internship._id)} className="text-red-600 hover:text-red-900"><Trash size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && (
                <EditInternshipModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    internship={selectedInternship}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default AddInternship; 