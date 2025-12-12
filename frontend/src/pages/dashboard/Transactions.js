import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import setAuthToken from '../../utils/setAuthToken';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Loader2 } from 'lucide-react';

const Transactions = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
            }
            try {
                const appRes = await api.get('/applications/my-applications');
                setApplications(appRes.data.data);
            } catch (err) {
                console.error('Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
            <div className="w-full space-y-6">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2">My Transactions</h1>
                    <p className="text-sm sm:text-base text-gray-600">View your application status</p>
                </div>
                
                {/* Applications Section */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                            My Applied Internships
                        </h2>
                        {applications.length > 0 && (
                            <Link 
                                to="/dashboard/applied-internships" 
                                className="flex items-center gap-1 text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                            >
                                View All <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                    {loading ? (
                        <div className="text-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2" />
                            <p className="text-gray-600">Loading applications...</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-12 rounded-xl">
                            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">You haven't applied for any internships yet.</p>
                            <Link 
                                to="/internships" 
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                            >
                                Browse Internships
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="block md:hidden space-y-3">
                                {applications.slice(0, 5).map(app => (
                                    <div key={app._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-sm font-bold text-gray-800 flex-1 line-clamp-2">{app.internship?.title || 'Internship not available'}</h3>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                                                app.status === 'Approved' || app.status === 'Offered' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : app.status === 'Rejected' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                                            <span>{new Date(app.dateApplied).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                            <span className="font-semibold text-gray-800">₹{app.amount || 0}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Internship</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applied On</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {applications.slice(0, 5).map(app => (
                                            <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-gray-800">{app.internship?.title || 'Internship not available'}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-gray-600">{new Date(app.dateApplied).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        app.status === 'Approved' || app.status === 'Offered' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : app.status === 'Rejected' 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-800">₹{app.amount || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {applications.length > 5 && (
                                <div className="mt-4 text-center">
                                    <Link 
                                        to="/dashboard/applied-internships" 
                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                    >
                                        View all {applications.length} applications <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions; 