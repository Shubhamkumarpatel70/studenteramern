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
        stipendType: 'month',
        location: 'Remote',
        duration: '4 Weeks',
        isAccepting: true,
        features: [],
        totalPositions: 1,
        registrationFee: 149,
        tag: '',
        tagColor: '#3B82F6',
        order: 999,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasStipend, setHasStipend] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState(null);

    const [featureInput, setFeatureInput] = useState('');

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
        stipendType,
        location, 
        duration, 
        isAccepting,
        features,
        totalPositions,
        registrationFee,
        tag,
        tagColor,
        order,
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
            technologies: technologies.split(',').map(s => s.trim()),
            stipendType: stipendType || 'month',
            totalPositions: Number(totalPositions) || 1,
            order: order !== undefined && order !== '' ? Number(order) : 999,
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
                stipendType: 'month',
                location: 'Remote',
                duration: '4 Weeks',
                isAccepting: true,
                features: [],
                totalPositions: 1,
                registrationFee: 149,
                tag: '',
                tagColor: '#3B82F6',
                order: 999,
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

    const addFeature = () => {
        const value = featureInput.trim();
        if (value && (!formData.features || !formData.features.includes(value))) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), value]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (idx) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== idx)
        }));
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

                    {/* Total Positions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Positions</label>
                        <input type="number" name="totalPositions" value={totalPositions} onChange={onChange} min="1" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Registration Fee */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Fee (₹)</label>
                        <input type="number" name="registrationFee" value={formData.registrationFee || 149} onChange={onChange} min="0" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="149" />
                        <p className="mt-1 text-xs text-gray-500">This fee will be shown as "Application Fee" on the payment page</p>
                    </div>

                    {/* Tag (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tag (Optional)</label>
                        <div className="mt-1 flex gap-2">
                            <input 
                                type="text" 
                                name="tag" 
                                value={tag || ''} 
                                onChange={onChange} 
                                placeholder="e.g., New, Popular, Featured" 
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                            <input 
                                type="color" 
                                name="tagColor" 
                                value={tagColor || '#3B82F6'} 
                                onChange={onChange} 
                                className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer" 
                                title="Tag background color"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Tag will appear in the top right corner of the internship card</p>
                        {tag && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-gray-600">Preview:</span>
                                <span 
                                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                    style={{ backgroundColor: tagColor || '#3B82F6' }}
                                >
                                    {tag}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Display Order</label>
                        <input 
                            type="number" 
                            name="order" 
                            value={order !== undefined && order !== '' ? order : 999} 
                            onChange={onChange} 
                            min="1" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                            placeholder="999"
                        />
                        <p className="mt-1 text-xs text-gray-500">Lower numbers appear first (1 = top, 2 = second, etc.). Default: 999 (appears last)</p>
                    </div>

                    {/* Stipend Toggle and Input */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input type="checkbox" name="hasStipend" checked={hasStipend} onChange={handleStipendCheck} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm font-medium text-gray-700">Offer Stipend?</label>
                        </div>
                        {hasStipend && (
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Stipend</label>
                                    <input type="number" name="stipend" value={stipend || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stipend Type</label>
                                    <select name="stipendType" value={stipendType || 'month'} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="day">Per Day</option>
                                        <option value="week">Per Week</option>
                                        <option value="month">Per Month</option>
                                    </select>
                                </div>
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
                        <div className="flex gap-2 mb-2">
                            <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} className="flex-1 border border-gray-300 rounded-md px-2 py-1" placeholder="Add feature" />
                            <button type="button" onClick={addFeature} className="px-3 py-1 bg-indigo-600 text-white rounded-md">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {Array.isArray(features) && features.map((feature, idx) => (
                                <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full flex items-center">
                                    {feature}
                                    <button type="button" onClick={() => removeFeature(idx)} className="ml-2 text-red-500">&times;</button>
                                </span>
                            ))}
                        </div>
                        <textarea name="features" value={features ? features.join('\n') : ''} onChange={e => setFormData(prev => ({ ...prev, features: e.target.value.split(/\n/).map(f => f.trim()).filter(f => f.length > 0) }))} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" placeholder="Or paste features, one per line"></textarea>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {internships.map(internship => (
                                <tr key={internship._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                                            {internship.order || 999}
                                        </span>
                                    </td>
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