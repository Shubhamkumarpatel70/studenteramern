import React, { useState, useEffect } from 'react';

const EditInternshipModal = ({ isOpen, onClose, internship, onSave }) => {
    const [formData, setFormData] = useState(internship);
    const [featureInput, setFeatureInput] = useState('');

    useEffect(() => {
        setFormData({
            ...internship,
            technologies: Array.isArray(internship.technologies) ? internship.technologies.join(', ') : ''
        });
    }, [internship]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    const handleSubmit = e => {
        e.preventDefault();
        const finalData = {
            ...formData,
            technologies: formData.technologies.split(',').map(s => s.trim()),
            features: Array.isArray(formData.features) ? formData.features : (formData.features ? formData.features.split('\n').map(f => f.trim()).filter(f => f.length > 0) : [])
        };
        onSave(finalData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Edit Internship</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Description</label>
                        <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
                        <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stipend</label>
                        <input type="number" name="stipend" value={formData.stipend || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Features</label>
                        <div className="flex gap-2 mb-2">
                            <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} className="flex-1 border border-gray-300 rounded-md px-2 py-1" placeholder="Add feature" />
                            <button type="button" onClick={addFeature} className="px-3 py-1 bg-indigo-600 text-white rounded-md">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {Array.isArray(formData.features) && formData.features.map((feature, idx) => (
                                <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full flex items-center">
                                    {feature}
                                    <button type="button" onClick={() => removeFeature(idx)} className="ml-2 text-red-500">&times;</button>
                                </span>
                            ))}
                        </div>
                        <textarea name="features" value={formData.features ? formData.features.join('\n') : ''} onChange={e => setFormData(prev => ({ ...prev, features: e.target.value.split(/\n/).map(f => f.trim()).filter(f => f.length > 0) }))} rows="3" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Or paste features, one per line"></textarea>
                    </div>

                    {/* Add other fields like stipend, location, duration as needed */}

                    <div className="flex items-center">
                        <input type="checkbox" name="isAccepting" checked={formData.isAccepting} onChange={handleChange} className="h-4 w-4 text-indigo-600 rounded" />
                        <label className="ml-2 block text-sm text-gray-900">Accepting Applications</label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInternshipModal; 