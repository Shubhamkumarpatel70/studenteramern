import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';

const InternshipRegistrations = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showScreenshot, setShowScreenshot] = useState(false);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/applications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(res.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch applications.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleUpdateStatus = async (id, status, reason = '') => {
        try {
            const token = localStorage.getItem('token');
            const body = { status, rejectionReason: reason };
            await axios.put(`/api/applications/${id}/status`, body, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchApplications(); // Refresh the list
            setIsRejectModalOpen(false);
            setRejectionReason('');
        } catch (err) {
            setError('Failed to update status.');
        }
    };

    const openViewModal = (app) => {
        setSelectedApp(app);
        setIsViewModalOpen(true);
    };

    const openRejectModal = (app) => {
        setSelectedApp(app);
        setIsRejectModalOpen(true);
    };

    if (loading) return <div className="p-8"><p>Loading applications...</p></div>;
    if (error) return <div className="p-8"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Internship Registrations</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map(app => (
                            <tr key={app._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{app.user?.name}</div>
                                    <div className="text-sm text-gray-500">{app.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.internship?.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.dateApplied).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button onClick={() => openViewModal(app)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Eye size={20} /></button>
                                    <button onClick={() => handleUpdateStatus(app._id, 'Approved')} className="text-green-600 hover:text-green-900 mr-4"><CheckCircle2 size={20} /></button>
                                    <button onClick={() => openRejectModal(app)} className="text-red-600 hover:text-red-900"><XCircle size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal */}
            {isViewModalOpen && selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
                        <h2 className="text-2xl font-bold mb-4">Application Details</h2>
                        <p><strong>Applicant:</strong> {selectedApp.user.name}</p>
                        <p><strong>Email:</strong> {selectedApp.user.email}</p>
                        <p><strong>Internship:</strong> {selectedApp.internship.title}</p>
                        <p><strong>Duration:</strong> {selectedApp.duration}</p>
                        <p><strong>Status:</strong> {selectedApp.status}</p>
                        <p><strong>Transaction ID:</strong> {selectedApp.transactionId}</p>
                        <p><strong>Applied On:</strong> {new Date(selectedApp.dateApplied).toLocaleString()}</p>
                        {selectedApp.status === 'Rejected' && <p><strong>Rejection Reason:</strong> {selectedApp.rejectionReason}</p>}
                        {selectedApp.paymentScreenshot && (
                            <button
                                onClick={() => setShowScreenshot(true)}
                                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
                            >
                                View Screenshot
                            </button>
                        )}
                        <button onClick={() => setIsViewModalOpen(false)} className="mt-4 ml-2 px-4 py-2 bg-indigo-600 text-white rounded">Close</button>
                    </div>
                    {/* Screenshot Modal */}
                    {showScreenshot && selectedApp.paymentScreenshot && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                            <div className="bg-white p-4 rounded shadow-lg relative max-w-2xl w-full flex flex-col items-center">
                                <button
                                    onClick={() => setShowScreenshot(false)}
                                    className="absolute top-2 right-2 text-gray-500 text-2xl"
                                >
                                    &times;
                                </button>
                                <img
                                    src={`http://localhost:5000/uploads/paymentScreenshots/${selectedApp.paymentScreenshot.replace(/^.*[\\/]/, '')}`}
                                    alt="Payment Screenshot"
                                    className="max-w-full max-h-[70vh] rounded border"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Rejection Modal */}
            {isRejectModalOpen && selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Reject Application</h2>
                        <p>You are about to reject the application from <strong>{selectedApp.user.name}</strong> for the <strong>{selectedApp.internship.title}</strong> internship.</p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Provide a reason for rejection (optional but recommended)"
                            className="w-full mt-2 p-2 border rounded"
                        />
                        <div className="mt-4 flex justify-end gap-4">
                            <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={() => handleUpdateStatus(selectedApp._id, 'Rejected', rejectionReason)} className="px-4 py-2 bg-red-600 text-white rounded">Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternshipRegistrations; 