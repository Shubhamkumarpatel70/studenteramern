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
        <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-primary-light via-background to-accent-light min-h-screen font-sans font-medium">
            <div className="w-full max-w-3xl mx-auto font-sans font-medium">
                <h1 className="text-3xl font-extrabold mb-6 text-primary-dark font-sans">My Transactions</h1>
                {loading ? (
                    <div className="text-center py-8">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-primary-dark/70 bg-card rounded-2xl shadow-lg">You have no transaction history.</div>
                ) : (
                    <div className="bg-card rounded-2xl shadow-lg overflow-x-auto border border-primary-light/30">
                        <table className="min-w-full divide-y divide-primary-light/30 text-sm sm:text-base">
                            <thead className="bg-gradient-to-r from-primary-light/40 to-accent-light/40">
                                <tr>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Date</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Amount</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Status</th>
                                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-light/20">
                                {transactions.map(txn => (
                                    <tr key={txn._id} className="hover:bg-primary-light/10 transition-colors duration-200">
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