import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import { Loader2, AlertCircle, Briefcase, Calendar, MapPin, Code, IndianRupee } from 'lucide-react';

const InternshipDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);
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
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                    {internship.image && (
                        <img src={internship.image} alt={internship.title} className="w-full h-64 object-cover" />
                    )}
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{internship.title}</h1>
                        <p className="text-md text-gray-600 mb-6">{internship.shortDescription}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-6 w-6 text-indigo-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Stipend</p>
                                    <p className="font-semibold">
                                        {internship.stipend > 0 ? `₹${internship.stipend} /${internship.stipendType || 'month'}` : 'Unpaid'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-indigo-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Duration</p>
                                    <p className="font-semibold">{internship.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-6 w-6 text-indigo-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-semibold">{internship.location}</p>
                                </div>
                            </div>
                        </div>

                        {internship.technologies && Array.isArray(internship.technologies) && internship.technologies.length > 0 && (
                            <div className="mb-6">
                                 <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2"><Code /> Technologies Used</h3>
                                 <div className="flex flex-wrap gap-2">
                                    {internship.technologies.map(tech => (
                                        <span key={tech} className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Full Description</h3>
                            <div className="prose max-w-none text-gray-600 mb-4">
                                {internship.description}
                            </div>
                            {internship.features && internship.features.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-md font-semibold text-gray-700 mb-2">Key Features</h4>
                                    <ul className="list-disc ml-6 space-y-1 text-gray-700">
                                        {internship.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="mt-0.5">•</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 text-center">
                            {internship.isAccepting ? (
                                <button 
                                    onClick={handleApplyClick}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Apply Now
                                </button>
                            ) : (
                                <button 
                                    disabled
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md bg-gray-300 text-gray-500 cursor-not-allowed"
                                >
                                    Application Closed
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