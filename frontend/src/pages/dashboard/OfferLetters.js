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
            return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
        }

        if (error) {
            return <div className="text-center text-error bg-error/10 p-4 rounded-md">{error}</div>;
        }

        // Case 1: User has no applications at all
        if (applications.length === 0) {
            return (
                <div className="text-center text-primary-dark/70 bg-card p-8 rounded-2xl shadow-lg">
                    <Inbox size={48} className="mx-auto text-primary-dark/30 mb-4" />
                    <h3 className="text-lg font-semibold">No Applications Found</h3>
                    <p className="mt-1">Apply for at least one internship to be eligible for an offer letter.</p>
                    <Link to="/internships" className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg shadow transition-colors duration-200">
                        Browse Internships
                    </Link>
                </div>
            );
        }

        // Case 2: User has applications, but no offer letters yet
        if (offerLetters.length === 0) {
            return (
                 <div className="text-center text-primary-dark/70 bg-card p-8 rounded-2xl shadow-lg">
                    <Inbox size={48} className="mx-auto text-primary-dark/30 mb-4" />
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
                        <div key={letter._id} className="bg-card rounded-2xl shadow-lg p-4 flex flex-col justify-between transition-transform hover:scale-[1.02] border border-primary-light/30">
                            <div>
                                <FileText className="h-10 w-10 text-primary mb-2" />
                                <h3 className="text-lg font-bold text-primary-dark mb-1">{letter.title}</h3>
                                {letter.company && <p className="text-sm text-primary-dark/70 mb-1">{letter.company}</p>}
                                <p className="text-xs text-primary-dark/40 mb-2">Issued on: {issuedDate}</p>
                            </div>
                            {letter.fileUrl ? (
                                <a href={letter.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-center bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-semibold transition-colors duration-200 block shadow">
                                    View / Download PDF
                                </a>
                            ) : (
                                <button className="mt-2 text-center bg-background text-primary-dark/40 py-2 rounded-lg font-semibold cursor-not-allowed block shadow" disabled>
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
        <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-primary-light via-background to-accent-light min-h-screen font-sans font-medium">
            <div className="max-w-2xl mx-auto font-sans font-medium">
                <h1 className="text-3xl font-extrabold mb-6 text-primary-dark font-sans">My Offer Letters</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default OfferLetters;