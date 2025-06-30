import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { Loader2, AlertCircle, Lock } from 'lucide-react';

const InternshipCard = ({ internship }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            <div className="relative">
                {internship.image && (
                    <img src={internship.image} alt={internship.title} className="w-full h-44 object-cover" />
                )}
                {!internship.isAccepting && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Closed</span>
                )}
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-1">{internship.title}</h3>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2 min-h-[40px]">{internship.shortDescription}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>Stipend: <span className="font-semibold">₹{internship.stipend}</span></span>
                    <span>Duration: <span className="font-semibold">{internship.duration}</span></span>
                </div>
                <Link to={`/internships/${internship._id}`} className="w-full mt-auto">
                    <button
                        className={`w-full py-2 rounded-lg font-bold transition-colors duration-200 text-white ${internship.isAccepting ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!internship.isAccepting}
                        title={internship.isAccepting ? 'Apply for this internship' : 'Applications are closed'}
                    >
                        {internship.isAccepting ? 'View Details' : <span className="flex items-center justify-center gap-2"><Lock size={16}/> View Details</span>}
                    </button>
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
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 min-h-screen">
            <div className="container mx-auto px-2 sm:px-4">
                <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 drop-shadow">Available Internships</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {internships.filter(i => i.isAccepting).map(internship => (
                        <InternshipCard key={internship._id} internship={internship} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Internships; 