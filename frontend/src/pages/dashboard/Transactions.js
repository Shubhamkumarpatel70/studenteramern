import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import setAuthToken from '../../utils/setAuthToken';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
            }
            try {
                const res = await api.get('/transactions/my-transactions');
                setTransactions(res.data.data);
            } catch (err) {
                console.error('Failed to fetch transactions', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen font-sans font-medium">
            <div className="w-full max-w-3xl mx-auto font-sans font-medium">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-800 font-sans">My Transactions</h1>
                {loading ? (
                    <div className="text-center py-8">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 bg-white rounded-3xl shadow-xl border border-blue-100/50">You have no transaction history.</div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl overflow-x-auto border border-blue-100/50">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions; 