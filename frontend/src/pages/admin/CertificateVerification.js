import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Eye, Search, Calendar, User, Award } from 'lucide-react';

const CertificateVerification = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCertificates, setFilteredCertificates] = useState([]);

    useEffect(() => {
        fetchCertificates();
    }, []);

    useEffect(() => {
        // Filter certificates based on search term
        const filtered = certificates.filter(cert =>
            cert.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCertificates(filtered);
    }, [certificates, searchTerm]);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/certificates', config);
            setCertificates(res.data.data);
        } catch (err) {
            console.error('Failed to fetch certificates', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Certificate Verification</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by candidate name, certificate ID, or internship title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading certificates...</p>
                </div>
            ) : filteredCertificates.length === 0 ? (
                <div className="text-center py-12">
                    <Award className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Try adjusting your search terms.' : 'No certificates have been generated yet.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertificates.map(cert => (
                        <div key={cert._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Award className="h-8 w-8 text-purple-600 mr-3" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{cert.candidateName}</h3>
                                            <p className="text-sm text-gray-600">{cert.internshipTitle}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="h-4 w-4 mr-2" />
                                        <span>Candidate: {cert.candidateName}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Completion: {formatDate(cert.completionDate)}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Award className="h-4 w-4 mr-2" />
                                        <span>ID: {cert.certificateId}</span>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Duration:</span> {cert.duration}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <a
                                        href={cert.fileUrl || `/verify-certificate/${cert.certificateId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Certificate
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            {!loading && (
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{certificates.length}</div>
                            <div className="text-sm text-gray-600">Total Certificates</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {certificates.filter(cert => cert.completionDate).length}
                            </div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {new Set(certificates.map(cert => cert.internshipTitle)).size}
                            </div>
                            <div className="text-sm text-gray-600">Unique Programs</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateVerification;
