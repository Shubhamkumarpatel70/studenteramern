import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/api';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, Eye } from 'lucide-react';

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
        <div className="p-6 bg-gray-50 min-h-full">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Applied Internships</h1>

            {applications.length === 0 ? (
                <div className="text-center py-12 px-6 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-medium text-gray-700">You haven't applied for any internships yet.</h3>
                    <p className="text-gray-500 mt-2">Find your next opportunity on our main page.</p>
                    <Link to="/" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                        Browse Internships
                    </Link>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{app.internship?.title || 'Internship not available'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(app.dateApplied).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <Link to={`/internships/${app.internship?._id}`} className="text-indigo-600 hover:text-indigo-900">
                                            <Eye size={20} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AppliedInternships; 