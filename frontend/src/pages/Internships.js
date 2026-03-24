import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import Footer from '../components/Footer';
import { Loader2, AlertCircle, Briefcase, ArrowRight } from 'lucide-react';

const InternshipCard = ({ internship }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col hover:border-blue-300 transition-colors shadow-sm">
        <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                {internship.title}
            </h3>
            {internship.tag && (
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200 shrink-0 ml-3">
                    {internship.tag}
                </span>
            )}
        </div>
        <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3 leading-relaxed">
            {internship.shortDescription || internship.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Duration</p>
                <p className="text-sm font-semibold text-gray-900">{internship.duration}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Stipend</p>
                <p className="text-sm font-semibold text-gray-900">₹{internship.stipend}</p>
            </div>
        </div>

        {Array.isArray(internship.technologies) && (
            <div className="flex flex-wrap gap-1.5 mb-6">
                {internship.technologies.slice(0, 4).map((tech) => (
                    <span
                        key={tech}
                        className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded border border-gray-200"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        )}
        <div className="pt-4 border-t border-gray-100 mt-auto">
            <Link
                to={`/internships/${internship._id}`}
                className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
                View Full Details <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
        </div>
    </div>
);

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

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <div className="flex-1 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 mb-4 uppercase tracking-wider">
                            Enroll Today
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
                            Available Internships
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Discover structured internship programs to kickstart your career journey with verifiable hands-on execution.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
                            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                            <h2 className="text-lg font-bold text-red-700">{error}</h2>
                        </div>
                    ) : internships.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center max-w-2xl mx-auto shadow-sm">
                            <Briefcase className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Programs Available</h3>
                            <p className="text-gray-500">Check back later for new internship batches!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {internships.map(internship => (
                                <InternshipCard key={internship._id} internship={internship} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Internships;