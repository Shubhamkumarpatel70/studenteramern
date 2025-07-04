import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { Loader2, AlertCircle } from 'lucide-react';

const InternshipCard = ({ internship }) => {
    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-indigo-100 dark:border-gray-800 group">
            {internship.image && (
                 <img src={internship.image} alt={internship.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            )}
            <div className="p-6">
                <h3 className="text-2xl font-extrabold mb-2 text-indigo-700 font-sans">{internship.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 h-20 overflow-hidden font-sans">{internship.shortDescription}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4 font-sans">
                    <span>Stipend: ₹{internship.stipend}</span>
                    <span>Duration: {internship.duration}</span>
                </div>
                <Link to={`/internships/${internship._id}`} className="w-full text-center block bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:from-indigo-600 hover:to-pink-600 transition-all font-sans">
                    View Details
                </Link>
            </div>
        </div>
    );
};

const Internships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const { data } = await api.get('/internships/public');
                setInternships(data.data);
            } catch (err) {
                setError('Failed to load internships.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin h-16 w-16 text-indigo-600" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600">{error}</h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 font-sans transition-all duration-300">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-indigo-700 drop-shadow font-sans">Available Internships</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...internships].reverse().map(internship => (
                        <InternshipCard key={internship._id} internship={internship} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Internships; 