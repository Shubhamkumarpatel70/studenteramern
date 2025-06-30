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
        <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen font-sans font-medium">
            <div className="max-w-lg mx-auto font-sans font-medium">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Transactions</h1>
                {loading ? (
                    <div className="text-center py-8">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">You have no transaction history.</div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map(txn => (
                                    <tr key={txn._id}>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{new Date(txn.date).toLocaleDateString()}</td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">₹{txn.amount}</td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{txn.status}</td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{txn.transactionId}</td>
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