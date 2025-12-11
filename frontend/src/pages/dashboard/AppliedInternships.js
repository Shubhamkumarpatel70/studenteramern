import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/api';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, Eye, Briefcase, Calendar, FileText, Inbox } from 'lucide-react';
import Modal from '../../components/Modal';

const StatusBadge = ({ status }) => {
    let colorClasses = 'bg-yellow-100 text-yellow-800';
    if (status === 'Approved' || status === 'Offered') colorClasses = 'bg-green-100 text-green-800';
    if (status === 'Rejected') colorClasses = 'bg-red-100 text-red-800';
    
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};

const AppliedInternships = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    
    useEffect(() => {
        const fetchAppliedInternships = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await api.get('/applications/my-applications', config);
                setApplications(res.data.data);
            } catch (err) {
                setError('Failed to fetch your applications.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppliedInternships();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading applications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto text-center bg-red-50 border border-red-200 rounded-2xl p-6">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-800 font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
            <div className="w-full max-w-6xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2">My Applied Internships</h1>
                    <p className="text-sm sm:text-base text-gray-600">Track the status of your internship applications</p>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-100/50 p-8 sm:p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-6">
                                <Inbox className="h-16 w-16 text-indigo-600" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">You haven't applied for any internships yet. Find your next opportunity!</p>
                        <Link to="/internships" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-200 font-semibold">
                            <Briefcase className="h-4 w-4" />
                            Browse Internships
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="block md:hidden space-y-4">
                            {applications.map(app => (
                                <div key={app._id} className="bg-white rounded-xl shadow-lg p-4 border border-indigo-100/50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2">{app.internship?.title || 'Internship not available'}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(app.dateApplied).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <StatusBadge status={app.status} />
                                    </div>
                                    <button 
                                        onClick={() => setSelectedApp(app)} 
                                        className="w-full mt-3 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 px-4 rounded-lg transition-colors duration-200 font-semibold text-sm"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-hidden border border-indigo-100/50">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Internship</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applied On</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {applications.map(app => (
                                            <tr key={app._id} className="hover:bg-indigo-50/50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="h-4 w-4 text-indigo-600" />
                                                        <div className="text-sm font-bold text-gray-800">{app.internship?.title || 'Internship not available'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(app.dateApplied).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={app.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button 
                                                        onClick={() => setSelectedApp(app)} 
                                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span className="hidden lg:inline">View</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {selectedApp && (
                <Modal onClose={() => setSelectedApp(null)}>
                    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-2xl border border-indigo-100/50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                Application Details
                            </h2>
                            <button 
                                onClick={() => setSelectedApp(null)} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="text-xs text-gray-500 mb-1">Internship</div>
                                <div className="text-base font-semibold text-gray-800">{selectedApp.internship?.title || 'N/A'}</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="text-xs text-gray-500 mb-1">Applied On</div>
                                <div className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(selectedApp.dateApplied).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="text-xs text-gray-500 mb-1">Status</div>
                                <div><StatusBadge status={selectedApp.status} /></div>
                            </div>
                            {selectedApp.paymentScreenshot && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-xs text-gray-500 mb-2">Transaction Screenshot</div>
                                    <a href={selectedApp.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="block">
                                        <img src={selectedApp.paymentScreenshot} alt="Transaction Screenshot" className="w-full max-w-md mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow" />
                                    </a>
                                </div>
                            )}
                            {selectedApp.status === 'Rejected' && selectedApp.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="text-xs text-red-600 font-semibold mb-1">Rejection Reason</div>
                                    <div className="text-sm text-red-800">{selectedApp.rejectionReason}</div>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => setSelectedApp(null)} 
                            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
                )}
            </div>
        </div>
    );
};

export default AppliedInternships; 