import React, { useEffect, useState } from 'react';
import api from '../config/api';

const AccountantManageTransactions = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/applications');
            setApplications(res.data.data);
        } catch (err) {
            setError('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await api.put(`/applications/${id}/status`, { status: 'Approved' });
            fetchApplications();
        } catch (err) {
            setError('Failed to approve application');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Enter rejection reason:');
        if (!reason) return;
        setActionLoading(id);
        try {
            await api.put(`/applications/${id}/status`, { status: 'Rejected', rejectionReason: reason });
            fetchApplications();
        } catch (err) {
            setError('Failed to reject application');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Manage Transactions</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">User</th>
                                <th className="px-4 py-2">Internship</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Transaction ID</th>
                                <th className="px-4 py-2">UTR</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Payment Screenshot</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td className="px-4 py-2">
                                        {app.user?.name}<br/>
                                        <span className="text-xs text-gray-500">{app.user?.email}</span>
                                    </td>
                                    <td className="px-4 py-2">{app.internship?.title}</td>
                                    <td className="px-4 py-2">₹{app.amount}</td>
                                    <td className="px-4 py-2">{app.status}</td>
                                    <td className="px-4 py-2">{app.transactionId}</td>
                                    <td className="px-4 py-2">{app.utr}</td>
                                    <td className="px-4 py-2">{app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : ''}</td>
                                    <td className="px-4 py-2">
                                        {app.paymentScreenshot && (
                                            <a href={app.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {(app.status === 'Applied' || app.status === 'Under Review') && (
                                            <>
                                                <button onClick={() => handleApprove(app._id)} disabled={actionLoading === app._id} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                                                    {actionLoading === app._id ? 'Processing...' : 'Approve'}
                                                </button>
                                                <button onClick={() => handleReject(app._id)} disabled={actionLoading === app._id} className="bg-red-500 text-white px-3 py-1 rounded">
                                                    {actionLoading === app._id ? 'Processing...' : 'Reject'}
                                                </button>
                                            </>
                                        )}
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

export default AccountantManageTransactions; 