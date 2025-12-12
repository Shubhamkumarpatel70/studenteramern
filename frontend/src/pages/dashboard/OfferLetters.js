import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import { FileText, Loader2, Inbox, Download, Calendar, Building2 } from 'lucide-react';

const OfferLetters = () => {
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
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading offer letters...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-6">
                    <p className="text-red-800 font-semibold">{error}</p>
                </div>
            );
        }

        // Case 1: User has no applications at all
        if (applications.length === 0) {
            return (
                <div className="text-center bg-white p-8 sm:p-12 rounded-2xl sm:rounded-3xl shadow-xl">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gray-100 rounded-full p-6">
                            <Inbox className="h-16 w-16 text-gray-600" />
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Applications Found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Apply for at least one internship to be eligible for an offer letter.</p>
                    <Link to="/internships" className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-200 font-semibold">
                        Browse Internships
                    </Link>
                </div>
            );
        }

        // Case 2: User has applications, but no offer letters yet
        if (offerLetters.length === 0) {
            return (
                <div className="text-center bg-white p-8 sm:p-12 rounded-2xl sm:rounded-3xl shadow-xl">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gray-100 rounded-full p-6">
                            <Inbox className="h-16 w-16 text-gray-600" />
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Offer Letters Yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">You have not received any offer letters. Keep an eye on this page after your application is approved.</p>
                </div>
            );
        }

        // Case 3: User has offer letters
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {offerLetters.map(letter => {
                    // Fix date: use letter.issueDate or letter.issuedAt, fallback to '-'
                    let issuedDate = '-';
                    if (letter.issueDate && !isNaN(new Date(letter.issueDate))) {
                        issuedDate = new Date(letter.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    } else if (letter.issuedAt && !isNaN(new Date(letter.issuedAt))) {
                        issuedDate = new Date(letter.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    }
                    return (
                        <div key={letter._id} className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="bg-gray-100 rounded-xl p-3">
                                        <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                                    </div>
                                    {letter.fileUrl && (
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                                    )}
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2">{letter.title}</h3>
                                {letter.company && (
                                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        {letter.company}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Issued: {issuedDate}
                                </p>
                            </div>
                            {letter.fileUrl ? (
                                <a 
                                    href={letter.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-4 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-2.5 sm:py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base shadow-md group-hover:shadow-lg"
                                >
                                    <Download className="h-4 w-4" />
                                    Download PDF
                                </a>
                            ) : (
                                <button className="mt-4 bg-gray-100 text-gray-400 py-2.5 sm:py-3 px-4 rounded-xl font-semibold cursor-not-allowed text-sm sm:text-base" disabled>
                                    PDF Not Available
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
            <div className="w-full">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2">My Offer Letters</h1>
                    <p className="text-sm sm:text-base text-gray-600">View and download your offer letters</p>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default OfferLetters;