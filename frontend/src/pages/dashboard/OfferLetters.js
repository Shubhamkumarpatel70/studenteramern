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
            <div className="space-y-4">
                {offerLetters.map(letter => (
                    <div key={letter._id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                        <div className="font-semibold text-gray-800">{letter.title}</div>
                        <div className="text-xs text-gray-500">{new Date(letter.issuedAt).toLocaleDateString()}</div>
                        <a href={letter.offerLetterUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">View Offer Letter</a>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Offer Letters</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default OfferLetters;