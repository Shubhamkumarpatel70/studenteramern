import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { Loader2, AlertCircle } from 'lucide-react';

const InternshipCard = ({ internship }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            {internship.image && (
                 <img src={internship.image} alt={internship.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{internship.title}</h3>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden">{internship.shortDescription}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Stipend: ₹{internship.stipend}</span>
                    <span>Duration: {internship.duration}</span>
                </div>
                <Link to={`/internships/${internship._id}`} className="w-full text-center block bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors">
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
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Available Internships</h1>
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