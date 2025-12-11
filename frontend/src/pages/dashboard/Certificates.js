import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Award, Clock, Loader2, Inbox, Download, FileText } from 'lucide-react';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [genLoading, setGenLoading] = useState({});
    const [genError, setGenError] = useState({});
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                const [certsRes, tasksRes] = await Promise.all([
                    api.get('/certificates/my-certificates', config),
                    api.get('/assigned-tasks/my-tasks', config)
                ]);
                
                setCertificates(certsRes.data.data);
                const completed = tasksRes.data.data.filter(task => task.status === 'completed');
                setCompletedTasks(completed);

            } catch (err) {
                setError('Could not fetch your data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchAllTasks = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const res = await api.get('/assigned-tasks/my-tasks', config);
                setAllTasks(res.data.data);
            } catch (err) {
                // ignore
            }
        };
        fetchAllTasks();
    }, []);

    // Filter out completed tasks that already have a certificate
    const pendingCertificates = completedTasks.filter(task => 
        !certificates.some(cert => cert.internshipTitle === task.internship.title)
    );

    // Group tasks by internship
    const internshipTaskStatus = {};
    allTasks.forEach(task => {
        const id = task.internship._id;
        if (!internshipTaskStatus[id]) internshipTaskStatus[id] = [];
        internshipTaskStatus[id].push(task.status);
    });

    const handleGenerate = async (internshipId) => {
        setGenLoading(prev => ({ ...prev, [internshipId]: true }));
        setGenError(prev => ({ ...prev, [internshipId]: '' }));
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await api.post('/certificates/generate-self', { internshipId }, config);
            // Refresh certificates
            const certsRes = await api.get('/certificates/my-certificates', config);
            setCertificates(certsRes.data.data);
        } catch (err) {
            setGenError(prev => ({ ...prev, [internshipId]: err.response?.data?.message || 'Failed to generate certificate.' }));
        }
        setGenLoading(prev => ({ ...prev, [internshipId]: false }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading certificates...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto text-center bg-red-50 border border-red-200 rounded-2xl p-6">
                    <p className="text-red-800 font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            <div className="w-full max-w-6xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2">My Certificates</h1>
                    <p className="text-sm sm:text-base text-gray-600">View and download your earned certificates</p>
                </div>
                {(certificates.length === 0 && Object.keys(internshipTaskStatus).length === 0) ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100/50 p-8 sm:p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-6">
                                <Inbox className="h-16 w-16 text-indigo-600" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Certificates Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">You have not been issued any certificates yet. Complete your tasks to earn certificates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Render issued certificates */}
                        {certificates.map(cert => (
                            <div key={cert._id} className="bg-white border border-blue-100/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-3">
                                            <Award className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                                        </div>
                                        {cert.fileUrl && (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2">{cert.internshipTitle || cert.course}</h3>
                                    <div className="space-y-1 mb-4">
                                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            Issued: {cert.completionDate ? new Date(cert.completionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                        </p>
                                        {cert.certificateId && (
                                            <p className="text-xs text-gray-500">ID: {cert.certificateId?.split('-').slice(-1)[0]}</p>
                                        )}
                                    </div>
                                </div>
                                <a
                                    href={cert.fileUrl || `/verify-certificate/${cert.certificateId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition-all duration-200 font-semibold text-sm sm:text-base group-hover:shadow-lg"
                                >
                                    {cert.fileUrl ? (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Download PDF
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4" />
                                            View Certificate
                                        </>
                                    )}
                                </a>
                            </div>
                        ))}

                        {/* Render pending certificates */}
                        {Object.entries(internshipTaskStatus).map(([internshipId, statuses]) => {
                            const internship = allTasks.find(t => t.internship._id === internshipId)?.internship;
                            const allCompleted = statuses.length > 0 && statuses.every(s => s === 'completed');
                            const alreadyHasCert = certificates.some(cert => cert.internshipTitle === internship?.title);
                            if (alreadyHasCert) return null;
                            const completedCount = statuses.filter(s => s === 'completed').length;
                            const totalCount = statuses.length;
                            return (
                                <div key={internshipId} className="bg-white border-2 border-dashed border-blue-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-3">
                                                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                                            </div>
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                {completedCount}/{totalCount} Tasks
                                            </span>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-2 line-clamp-2">{internship?.title || 'Internship'}</h3>
                                        {!allCompleted ? (
                                            <>
                                                <p className="text-xs sm:text-sm text-indigo-600 mt-2 mb-3">Complete all tasks and upload your work to generate your certificate.</p>
                                                <div className="space-y-1">
                                                    {statuses.map((s, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                                            {s === 'completed' ? (
                                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                            ) : (
                                                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                                            )}
                                                            <span>{s === 'completed' ? 'Task completed' : 'Task pending'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-2 mb-4">You are eligible to generate your certificate.</p>
                                                <button
                                                    className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md transition-all duration-200 font-semibold text-sm sm:text-base disabled:opacity-60 flex items-center justify-center gap-2"
                                                    onClick={() => handleGenerate(internshipId)}
                                                    disabled={genLoading[internshipId]}
                                                >
                                                    {genLoading[internshipId] ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Award className="h-4 w-4" />
                                                            Generate Certificate
                                                        </>
                                                    )}
                                                </button>
                                                {genError[internshipId] && (
                                                    <div className="mt-2 text-xs sm:text-sm text-red-500 bg-red-50 p-2 rounded-lg">{genError[internshipId]}</div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificates; 