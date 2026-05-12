import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FileText, Loader2, Inbox, Download, Calendar, Building2, BadgeCheck, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const PPOs = ({ isTab = false }) => {
    const [ppos, setPpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPPOs = async () => {
            setLoading(true);
            try {
                const res = await api.get('/ppo/my');
                setPpos(res.data.data);
            } catch (err) {
                setError('Could not fetch your Pre-Placement Offers. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPPOs();
    }, []);

    const handleStatusUpdate = async (ppoId, status) => {
        try {
            await api.put(`/ppo/${ppoId}/status`, { status });
            toast.success(`PPO ${status} successfully!`);
            setPpos(ppos.map(ppo => ppo._id === ppoId ? { ...ppo, status } : ppo));
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Fetching your career offers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-2xl mx-auto">
                <p className="text-red-700 font-semibold">{error}</p>
            </div>
        );
    }

    if (ppos.length === 0) {
        return (
            <div className="text-center bg-white p-12 rounded-2xl border border-gray-100 shadow-xl max-w-2xl mx-auto">
                <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Inbox className="h-10 w-10 text-indigo-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No PPOs Yet</h3>
                <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
                    Keep excelling in your internship! Pre-Placement Offers are awarded to top-performing interns.
                </p>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <p className="text-amber-800 text-sm font-medium">
                        💡 Tip: Complete your tasks on time and engage in meetings to increase your chances!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={isTab ? "w-full" : "p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50"}>
            <div className="max-w-7xl mx-auto w-full">
                {!isTab && (
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pre-Placement Offers</h1>
                        <p className="text-gray-500 mt-2 text-lg">Congratulations on your achievements! Manage your full-time career offers here.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ppos.map(ppo => (
                        <div key={ppo._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 flex flex-col transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-6">
                                <div className="bg-indigo-600 text-white rounded-xl p-4 shadow-lg shadow-indigo-200">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${
                                    ppo.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                    ppo.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                    {ppo.status}
                                </span>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {ppo.jobTitle}
                                </h3>
                                <div className="space-y-3 mb-6">
                                    <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                        {ppo.company}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        Joining: {new Date(ppo.joiningDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Annual CTC</p>
                                        <p className="text-lg font-black text-indigo-700">₹{ppo.ctc}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                {ppo.fileUrl && (
                                    <a
                                        href={ppo.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-md active:scale-95"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Offer Letter
                                    </a>
                                )}

                                {ppo.status === 'Issued' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(ppo._id, 'Accepted')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm"
                                        >
                                            <BadgeCheck className="h-4 w-4" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(ppo._id, 'Rejected')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 py-2.5 px-3 rounded-xl font-bold transition-all active:scale-95 text-sm"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PPOs;
