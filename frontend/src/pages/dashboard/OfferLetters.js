import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import { FileText, Loader2, Inbox, Download, Calendar, Building2 } from 'lucide-react';

const OfferLetters = ({ isTab = false }) => {
    const [offerLetters, setOfferLetters] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                const [lettersRes, appsRes] = await Promise.all([
                    api.get('/offer-letters/my-offer-letters', config),
                    api.get('/applications/my-applications', config)
                ]);

                setOfferLetters(lettersRes.data.data);
                setApplications(appsRes.data.data);

            } catch (err) {
                setError('Could not fetch your data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Loading offer letters...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            );
        }

        // Case 1: User has no applications at all
        if (applications.length === 0) {
            return (
                <div className="text-center bg-white p-8 sm:p-12 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                    <div className="flex justify-center mb-4">
                        <Inbox className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Applications Found</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Apply for an internship first to be eligible for an offer letter.</p>
                    <Link to="/internships" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg font-medium transition-colors text-sm shadow-sm">
                        Browse Programs
                    </Link>
                </div>
            );
        }

        // Case 2: User has applications, but no offer letters yet
        if (offerLetters.length === 0) {
            return (
                <div className="text-center bg-white p-8 sm:p-12 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                    <div className="flex justify-center mb-4">
                        <Inbox className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Offer Letters Yet</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">You have not received any offer letters yet. Keep an eye on this space.</p>
                </div>
            );
        }

        // Case 3: User has offer letters
        return (
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    Your Letters ({offerLetters.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {offerLetters.map(letter => {
                        let issuedDate = '-';
                        if (letter.issueDate && !isNaN(new Date(letter.issueDate))) {
                            issuedDate = new Date(letter.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        } else if (letter.issuedAt && !isNaN(new Date(letter.issuedAt))) {
                            issuedDate = new Date(letter.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        }

                        return (
                            <div key={letter._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between transition-colors hover:border-blue-200">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-blue-50 text-blue-600 rounded-lg p-3">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        {letter.fileUrl && (
                                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-green-50 text-green-700 border border-green-200">Available</span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{letter.title}</h3>
                                    {letter.company && (
                                        <p className="text-sm text-gray-700 mb-2 flex items-center gap-1.5 font-medium">
                                            <Building2 className="h-4 w-4 text-gray-400" />
                                            {letter.company}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Issued: {issuedDate}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    {letter.fileUrl ? (
                                        <a
                                            href={letter.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors text-sm shadow-sm"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download PDF
                                        </a>
                                    ) : (
                                        <button className="w-full bg-gray-50 border border-gray-200 text-gray-400 py-2.5 px-4 rounded-lg font-medium cursor-not-allowed text-sm" disabled>
                                            PDF Not Available
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={isTab ? "w-full" : "p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50"}>
            <div className="max-w-7xl mx-auto w-full">
                {!isTab && (
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Offer Letters</h1>
                        <p className="text-gray-500 text-sm sm:text-base">View and download your official offer letters.</p>
                    </div>
                )}
                {renderContent()}
            </div>
        </div>
    );
};

export default OfferLetters;