import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { Loader2, AlertCircle, Briefcase, Calendar, MapPin, IndianRupee } from 'lucide-react';

const InternshipCard = ({ internship }) => {
    return (
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl overflow-hidden border border-indigo-100 group relative">
            {internship.image && (
                <div className="relative overflow-hidden">
                    <img src={internship.image} alt={internship.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                    {internship.tag && (
                        <span 
                            className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg z-10"
                            style={{ backgroundColor: internship.tagColor || '#3B82F6' }}
                        >
                            {internship.tag}
                        </span>
                    )}
                </div>
            )}
            {!internship.image && internship.tag && (
                <span 
                    className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg z-10"
                    style={{ backgroundColor: internship.tagColor || '#3B82F6' }}
                >
                    {internship.tag}
                </span>
            )}
            <div className="p-6">
                <h3 className="text-2xl font-extrabold mb-3 text-indigo-800 font-sans">{internship.title}</h3>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden font-sans leading-relaxed">{internship.shortDescription}</p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                        <IndianRupee className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <div>
                            <span className="text-sm text-gray-500">Stipend</span>
                            <p className="font-semibold">₹{internship.stipend}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <div>
                            <span className="text-sm text-gray-500">Duration</span>
                            <p className="font-semibold">{internship.duration}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <div>
                            <span className="text-sm text-gray-500">Location</span>
                            <p className="font-semibold">{internship.location}</p>
                        </div>
                    </div>
                </div>

                <Link to={`/internships/${internship._id}`} className="w-full text-center block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-sans">
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
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Loader2 className="animate-spin h-16 w-16 text-indigo-600" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600">{error}</h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-[Inter,sans-serif] py-8">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold mb-4 text-indigo-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Available Internships
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover exciting internship opportunities to kickstart your career journey with hands-on experience and professional growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {internships.map(internship => (
                        <InternshipCard key={internship._id} internship={internship} />
                    ))}
                </div>

                {internships.length === 0 && (
                    <div className="text-center py-16">
                        <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">No Internships Available</h3>
                        <p className="text-gray-500">Check back later for new opportunities!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Internships; 