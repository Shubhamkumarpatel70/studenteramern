import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
                    axios.get('/api/offer-letters/my-offer-letters', config),
                    axios.get('/api/applications/my-applications', config)
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offerLetters.map(letter => (
                    <div key={letter._id} className="bg-white border rounded-lg p-4 flex flex-col justify-between shadow-sm transition-shadow hover:shadow-lg">
                        <div>
                            <FileText className="h-10 w-10 text-blue-500 mb-2" />
                            <h3 className="text-lg font-semibold text-gray-800">{letter.title}</h3>
                            <p className="text-sm text-gray-600">{letter.company}</p>
                            <p className="text-xs text-gray-500 mt-2">Issued on: {new Date(letter.issueDate).toLocaleDateString()}</p>
                        </div>
                        {letter.fileUrl ? (
                            <a href={letter.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-4 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition block">
                                View / Download PDF
                            </a>
                        ) : (
                            <button className="mt-4 text-center bg-blue-600 text-white py-2 rounded-md opacity-50 cursor-not-allowed" disabled>
                                PDF Not Available
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Offer Letters</h1>
            {renderContent()}
        </div>
    );
};

export default OfferLetters;