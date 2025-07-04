import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/api';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, Eye } from 'lucide-react';
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

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
        </div>
    );

    if (error) return (
        <div className="p-4 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">{error}</p>
        </div>
    );

    return (
        <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-primary-light via-background to-accent-light min-h-full font-sans font-medium">
            <h1 className="text-3xl font-extrabold mb-6 text-primary-dark font-sans">My Applied Internships</h1>

            {applications.length === 0 ? (
                <div className="text-center py-8 px-4 sm:px-6 bg-card rounded-2xl shadow-lg max-w-lg mx-auto">
                    <h3 className="text-xl font-medium text-primary-dark">You haven't applied for any internships yet.</h3>
                    <p className="text-primary-dark/70 mt-2">Find your next opportunity on our main page.</p>
                    <Link to="/" className="mt-4 inline-block px-6 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow transition-colors duration-200">
                        Browse Internships
                    </Link>
                </div>
            ) : (
                <div className="bg-card shadow-lg rounded-2xl overflow-x-auto font-sans font-medium border border-primary-light/30">
                    <table className="min-w-full divide-y divide-primary-light/30 text-sm sm:text-base">
                        <thead className="bg-gradient-to-r from-primary-light/40 to-accent-light/40">
                            <tr>
                                <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Internship</th>
                                <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Applied On</th>
                                <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Status</th>
                                <th className="px-2 sm:px-6 py-3 text-center text-xs font-bold text-primary-dark uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-light/20">
                            {applications.map(app => (
                                <tr key={app._id} className="hover:bg-primary-light/10 transition-colors duration-200">
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-primary-dark">{app.internship?.title || 'Internship not available'}</div>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-primary-dark/70">
                                        {new Date(app.dateApplied).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button onClick={() => setSelectedApp(app)} className="text-primary hover:text-accent transition-colors duration-200">
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedApp && (
                <Modal onClose={() => setSelectedApp(null)}>
                    <div className="p-6 bg-background rounded-2xl shadow-xl border border-primary-light/30 animate-fade-in">
                        <h2 className="text-xl font-bold mb-2 text-primary-dark">Application Details</h2>
                        <div className="mb-2"><strong>Internship:</strong> {selectedApp.internship?.title}</div>
                        <div className="mb-2"><strong>Applied On:</strong> {new Date(selectedApp.dateApplied).toLocaleDateString()}</div>
                        <div className="mb-2"><strong>Status:</strong> <StatusBadge status={selectedApp.status} /></div>
                        {selectedApp.paymentScreenshot && (
                            <div className="mb-2">
                                <strong>Transaction Screenshot:</strong><br />
                                <a href={selectedApp.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                                    <img src={selectedApp.paymentScreenshot} alt="Transaction Screenshot" className="max-w-xs mt-2 rounded shadow" />
                                </a>
                            </div>
                        )}
                        {selectedApp.status === 'Rejected' && selectedApp.rejectionReason && (
                            <div className="mb-2 text-error font-semibold">
                                <strong>Rejection Reason:</strong> {selectedApp.rejectionReason}
                            </div>
                        )}
                        <button onClick={() => setSelectedApp(null)} className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow transition-colors duration-200">Close</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AppliedInternships; 