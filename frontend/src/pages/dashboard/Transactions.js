import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import setAuthToken from '../../utils/setAuthToken';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    const statusClasses = {
        'Completed': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Failed': 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
            }
            try {
                const [txnRes, appRes] = await Promise.all([
                    api.get('/transactions/my-transactions'),
                    api.get('/applications/my-applications')
                ]);
                setTransactions(txnRes.data.data);
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
        <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen font-sans font-medium">
            <div className="w-full max-w-6xl mx-auto font-sans font-medium space-y-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 font-sans">My Transactions</h1>
                
                {/* Applications Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-blue-100/50 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                            My Applied Internships
                        </h2>
                        <Link 
                            to="/dashboard/applied-internships" 
                            className="flex items-center gap-1 text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                        >
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading applications...</div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-xl">
                            <p className="mb-4">You haven't applied for any internships yet.</p>
                            <Link 
                                to="/" 
                                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Browse Internships
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-blue-100/30 text-sm sm:text-base">
                                <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                                    <tr>
                                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Internship</th>
                                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applied On</th>
                                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-50">
                                    {applications.slice(0, 5).map(app => (
                                        <tr key={app._id} className="hover:bg-blue-50/50 transition-colors duration-200">
                                            <td className="px-2 sm:px-4 py-4 text-gray-800">
                                                <div className="font-semibold">{app.internship?.title || 'Internship not available'}</div>
                                            </td>
                                            <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-gray-800">{new Date(app.dateApplied).toLocaleDateString()}</td>
                                            <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
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
                                            <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-gray-800">₹{app.amount || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {applications.length > 5 && (
                                <div className="mt-4 text-center">
                                    <Link 
                                        to="/dashboard/applied-internships" 
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                    >
                                        View all {applications.length} applications →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Transactions Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-x-auto border border-blue-100/50">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 p-4 sm:p-6 pb-2 text-gray-800">Transaction History</h2>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">You have no transaction history.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-blue-100/30 text-sm sm:text-base">
                            <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                                <tr>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {transactions.map(txn => (
                                    <tr key={txn._id} className="hover:bg-blue-50/50 transition-colors duration-200">
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-gray-800">{new Date(txn.date).toLocaleDateString()}</td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-gray-800">₹{txn.amount}</td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap"><StatusBadge status={txn.status} /></td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-gray-800">{txn.transactionId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions; 