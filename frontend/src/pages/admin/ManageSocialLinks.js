import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { MessageCircle, Instagram, Linkedin, CheckCircle, XCircle, Save, Plus } from 'lucide-react';

const ManageSocialLinks = () => {
    const [socialLinks, setSocialLinks] = useState({
        whatsapp: { url: '', isActive: false, _id: null },
        instagram: { url: '', isActive: false, _id: null },
        linkedin: { url: '', isActive: false, _id: null }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSocialLinks();
    }, []);

    const fetchSocialLinks = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get('/social-links', config);
            const links = res.data.data;
            
            // Initialize state with fetched links
            const linksState = {
                whatsapp: { url: '', isActive: false, _id: null },
                instagram: { url: '', isActive: false, _id: null },
                linkedin: { url: '', isActive: false, _id: null }
            };
            
            links.forEach(link => {
                linksState[link.platform] = {
                    url: link.url,
                    isActive: link.isActive,
                    _id: link._id
                };
            });
            
            setSocialLinks(linksState);
        } catch (err) {
            console.error('Failed to fetch social links', err);
            setError('Failed to load social links');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (platform, field, value) => {
        setSocialLinks(prev => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [field]: value
            }
        }));
    };

    const handleSave = async (platform) => {
        setSaving(prev => ({ ...prev, [platform]: true }));
        setError('');
        setSuccess('');

        const link = socialLinks[platform];
        
        if (!link.url.trim()) {
            setError('Please enter a URL');
            setSaving(prev => ({ ...prev, [platform]: false }));
            return;
        }

        // Validate URL
        try {
            new URL(link.url);
        } catch (err) {
            setError('Invalid URL format');
            setSaving(prev => ({ ...prev, [platform]: false }));
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await api.post('/social-links', {
                platform,
                url: link.url.trim(),
                isActive: link.isActive
            }, config);

            // Update local state with the response data
            if (response.data.data) {
                handleChange(platform, '_id', response.data.data._id);
                handleChange(platform, 'isActive', response.data.data.isActive);
            }

            setSuccess(`${platform.charAt(0).toUpperCase() + platform.slice(1)} link saved successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to save ${platform} link`);
        } finally {
            setSaving(prev => ({ ...prev, [platform]: false }));
        }
    };

    const handleToggleStatus = async (platform) => {
        const link = socialLinks[platform];
        
        if (!link._id) {
            setError('Please save the link first before toggling status');
            setTimeout(() => setError(''), 3000);
            return;
        }

        const newStatus = !link.isActive;
        
        // Optimistically update UI
        handleChange(platform, 'isActive', newStatus);
        
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            await api.patch(`/social-links/${link._id}/status`, {
                isActive: newStatus
            }, config);

            setSuccess(`${platform.charAt(0).toUpperCase() + platform.slice(1)} link ${newStatus ? 'activated' : 'deactivated'}!`);
            setTimeout(() => setSuccess(''), 3000);
            setError(''); // Clear any previous errors
        } catch (err) {
            // Revert on error
            handleChange(platform, 'isActive', !newStatus);
            setError(err.response?.data?.message || 'Failed to update status');
            setTimeout(() => setError(''), 3000);
        }
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'whatsapp':
                return <MessageCircle className="h-6 w-6 text-green-600" />;
            case 'instagram':
                return <Instagram className="h-6 w-6 text-pink-600" />;
            case 'linkedin':
                return <Linkedin className="h-6 w-6 text-blue-600" />;
            default:
                return null;
        }
    };

    const getPlatformName = (platform) => {
        return platform.charAt(0).toUpperCase() + platform.slice(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Social Links</h1>
                <p className="text-gray-600">Add and manage social media links for your website</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800">{success}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['whatsapp', 'instagram', 'linkedin'].map((platform) => {
                    const link = socialLinks[platform];
                    return (
                        <div
                            key={platform}
                            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {getPlatformIcon(platform)}
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {getPlatformName(platform)}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            link.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {link.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL
                                    </label>
                                    <input
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => handleChange(platform, 'url', e.target.value)}
                                        placeholder={`Enter ${getPlatformName(platform)} URL`}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700">Status:</span>
                                        <span className={`text-sm font-semibold ${
                                            link.isActive ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                            {link.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleStatus(platform)}
                                        disabled={!link._id}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                            link.isActive ? 'bg-green-600' : 'bg-gray-300'
                                        } ${!link._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        title={!link._id ? 'Please save the link first' : link.isActive ? 'Click to deactivate' : 'Click to activate'}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                link.isActive ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                                {!link._id && (
                                    <p className="text-xs text-gray-500 mt-1">Save the link first to toggle status</p>
                                )}

                                <button
                                    onClick={() => handleSave(platform)}
                                    disabled={saving[platform] || !link.url.trim()}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                                        saving[platform] || !link.url.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {saving[platform] ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            <span>Save Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-800 text-sm">
                    <li>Enter the URL for each social media platform</li>
                    <li>Click "Save Link" to store the URL</li>
                    <li>Toggle the status to "Active" to display the link on the website</li>
                    <li>For WhatsApp, use the format: <code className="bg-blue-100 px-1 rounded">https://wa.me/919027880288?text=Hi, I am come across your website</code></li>
                    <li>Links are inactive by default and won't appear until activated</li>
                </ul>
            </div>
        </div>
    );
};

export default ManageSocialLinks;

