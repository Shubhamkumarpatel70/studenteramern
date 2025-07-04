import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Award, Clock, Loader2 } from 'lucide-react';

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
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <div className="text-center text-error bg-error/10 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-primary-light via-background to-accent-light min-h-screen font-sans font-medium">
            <div className="w-full max-w-5xl mx-auto font-sans font-medium">
                <h1 className="text-3xl font-extrabold mb-6 text-primary-dark font-sans">My Certificates</h1>
                {(certificates.length === 0 && pendingCertificates.length === 0) ? (
                     <div className="text-center text-primary-dark/70 bg-card p-8 rounded-2xl shadow-lg">You have not been issued any certificates yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Render issued certificates */}
                        {certificates.map(cert => (
                            <div key={cert._id} className="bg-card border border-primary-light/30 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-shadow hover:shadow-2xl duration-200">
                                 <div>
                                    <Award className="h-10 w-10 text-accent mb-2 animate-pulse" />
                                    <h3 className="text-lg font-bold text-primary-dark font-sans">{cert.internshipTitle || cert.course}</h3>
                                    <p className="text-sm text-primary-dark/70">Issued on: {cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : '-'}</p>
                                    <p className="text-xs text-primary-dark/40 mt-2">ID: {cert.certificateId?.split('-').slice(-1)[0]}</p>
                                </div>
                                <a 
                                    href={cert.fileUrl || `/verify-certificate/${cert.certificateId}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-4 text-center bg-primary hover:bg-primary-dark text-white py-2 rounded-lg shadow-md transition-colors duration-200 font-sans"
                                >
                                    {cert.fileUrl ? 'Download PDF' : 'View Certificate'}
                                </a>
                            </div>
                        ))}

                        {/* Render pending certificates */}
                        {Object.entries(internshipTaskStatus).map(([internshipId, statuses]) => {
                            const internship = allTasks.find(t => t.internship._id === internshipId)?.internship;
                            const allCompleted = statuses.length > 0 && statuses.every(s => s === 'completed');
                            const alreadyHasCert = certificates.some(cert => cert.internshipTitle === internship?.title);
                            if (alreadyHasCert) return null;
                            return (
                                <div key={internshipId} className="bg-background border border-dashed border-primary-light/30 rounded-2xl p-4 flex flex-col justify-between shadow-md">
                                    <div>
                                        <Clock className="h-10 w-10 text-primary-dark/30 mb-2 animate-pulse" />
                                        <h3 className="text-lg font-bold text-primary-dark/70 font-sans">{internship?.title || 'Internship'}</h3>
                                        {!allCompleted ? (
                                            <>
                                                <p className="text-sm text-accent mt-2">Complete all tasks and upload your work to generate your certificate.</p>
                                                <ul className="text-xs text-primary-dark/50 mt-1 list-disc ml-4">
                                                    {statuses.map((s, i) => <li key={i}>{s === 'completed' ? 'Task completed' : 'Task pending'}</li>)}
                                                </ul>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm text-primary-dark/70 mt-2">You are eligible to generate your certificate.</p>
                                                <button
                                                    className="mt-4 w-full py-2 px-4 bg-success hover:bg-primary-dark text-white rounded-lg shadow-md transition-colors duration-200 font-sans disabled:opacity-60"
                                                    onClick={() => handleGenerate(internshipId)}
                                                    disabled={genLoading[internshipId]}
                                                >
                                                    {genLoading[internshipId] ? 'Generating...' : 'Generate Certificate'}
                                                </button>
                                                {genError[internshipId] && (
                                                    <div className="mt-2 text-sm text-error">{genError[internshipId]}</div>
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