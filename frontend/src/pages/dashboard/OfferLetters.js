import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import { FileText, Loader2, Inbox } from 'lucide-react';

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
            return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
        }

        if (error) {
            return <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
        }

        // Case 1: User has no applications at all
        if (applications.length === 0) {
            return (
                <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
                    <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold">No Applications Found</h3>
                    <p className="mt-1">Apply for at least one internship to be eligible for an offer letter.</p>
                    <Link to="/internships" className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition">
                        Browse Internships
                    </Link>
                </div>
            );
        }

        // Case 2: User has applications, but no offer letters yet
        if (offerLetters.length === 0) {
            return (
                 <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
                    <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold">No Offer Letters Yet</h3>
                    <p className="mt-1">You have not received any offer letters. Keep an eye on this page after your application is approved.</p>
                </div>
            );
        }

        // Case 3: User has offer letters
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {offerLetters.map(letter => {
                    // Fix date: use letter.issueDate or letter.issuedAt, fallback to '-'
                    let issuedDate = '-';
                    if (letter.issueDate && !isNaN(new Date(letter.issueDate))) {
                        issuedDate = new Date(letter.issueDate).toLocaleDateString();
                    } else if (letter.issuedAt && !isNaN(new Date(letter.issuedAt))) {
                        issuedDate = new Date(letter.issuedAt).toLocaleDateString();
                    }
                    return (
                        <div key={letter._id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between transition-transform hover:scale-[1.02] border border-blue-100">
                            <div>
                                <FileText className="h-10 w-10 text-blue-500 mb-2" />
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{letter.title}</h3>
                                {letter.company && <p className="text-sm text-gray-600 mb-1">{letter.company}</p>}
                                <p className="text-xs text-gray-500 mb-2">Issued on: {issuedDate}</p>
                            </div>
                            {letter.fileUrl ? (
                                <a href={letter.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-center bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-600 transition block shadow">
                                    View / Download PDF
                                </a>
                            ) : (
                                <button className="mt-2 text-center bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold cursor-not-allowed block shadow" disabled>
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
        <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen font-sans font-medium">
            <div className="max-w-2xl mx-auto font-sans font-medium">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Offer Letters</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default OfferLetters;