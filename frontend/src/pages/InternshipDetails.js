import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import { Loader2, AlertCircle, Calendar, MapPin, Code, IndianRupee } from 'lucide-react';

const InternshipDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const { data } = await api.get(`/internships/public/${id}`);
                setInternship(data.data);
            } catch (err) {
                setError('Could not load internship details. It might be closed or invalid.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternship();
    }, [id]);

    const handleApplyClick = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/internships/${id}` } });
            return;
        }
        navigate(`/payment?internshipId=${id}`);
    };
    
    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin h-16 w-16 text-indigo-600" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <Link to="/" className="text-indigo-600 hover:underline">Go back to Home</Link>
        </div>
    );

    if (!internship) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
                    {internship.image && (
                        <img src={internship.image} alt={internship.title} className="w-full h-64 object-cover" />
                    )}
                    <div className="p-8">
                        <h1 className="text-4xl font-extrabold text-indigo-800 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{internship.title}</h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{internship.shortDescription}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl">
                                <IndianRupee className="h-8 w-8 text-indigo-600" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Stipend</p>
                                    <p className="font-bold text-lg text-indigo-800">
                                        {internship.stipend > 0 ? `₹${internship.stipend} /${internship.stipendType || 'month'}` : 'Unpaid'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl">
                                <Calendar className="h-8 w-8 text-indigo-600" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Duration</p>
                                    <p className="font-bold text-lg text-indigo-800">{internship.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl">
                                <MapPin className="h-8 w-8 text-indigo-600" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Location</p>
                                    <p className="font-bold text-lg text-indigo-800">{internship.location}</p>
                                </div>
                            </div>
                        </div>

                        {typeof internship.totalPositions === 'number' && (
                            <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                                <p className="text-lg text-indigo-800 font-semibold">
                                    Positions Remaining: <span className="text-2xl font-bold">{Math.max(0, internship.totalPositions - (internship.currentRegistrations || 0))}</span> / {internship.totalPositions}
                                </p>
                            </div>
                        )}

                        {internship.technologies && Array.isArray(internship.technologies) && internship.technologies.length > 0 && (
                            <div className="mb-8">
                                 <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-3">
                                     <Code className="h-6 w-6" />
                                     Technologies Used
                                 </h3>
                                 <div className="flex flex-wrap gap-3">
                                    {internship.technologies.map(tech => (
                                        <span key={tech} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full border border-indigo-200">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-indigo-800 mb-4">Full Description</h3>
                            <div className="prose max-w-none text-gray-700 mb-6 leading-relaxed text-lg">
                                {internship.description}
                            </div>
                            {internship.features && internship.features.length > 0 && (
                                <div className="mt-8">
                                    <h4 className="text-xl font-semibold text-indigo-800 mb-4">Key Features</h4>
                                    <ul className="space-y-3">
                                        {internship.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                                <span className="mt-1 w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0"></span>
                                                <span className="text-gray-700 leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 text-center">
                            {(internship.isAccepting && (internship.totalPositions - (internship.currentRegistrations || 0)) > 0) ? (
                                <button
                                    onClick={handleApplyClick}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Apply Now
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl bg-gray-300 text-gray-500 cursor-not-allowed"
                                >
                                    {((internship.totalPositions - (internship.currentRegistrations || 0)) <= 0) ? 'All seats are filled' : 'Application Closed'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetails; 