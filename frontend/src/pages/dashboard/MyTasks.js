import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Loader2, Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, User, Briefcase, Globe } from 'lucide-react';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await api.get('/assigned-tasks/my-tasks', config);
                setTasks(res.data.data);
            } catch (err) {
                setError('Could not fetch your tasks.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'in-progress': return <PlayCircle className="h-5 w-5 text-blue-500" />;
            case 'overdue': return <AlertCircle className="h-5 w-5 text-red-500" />;
            default: return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in-progress': return 'In Progress';
            case 'overdue': return 'Overdue';
            default: return 'Assigned';
        }
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date() && new Date(dueDate).getTime() !== new Date().setHours(0, 0, 0, 0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-error bg-error/10 p-4 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
            <div className="w-full max-w-4xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2">My Tasks</h1>
                    <p className="text-sm sm:text-base text-gray-600">Track and manage your assigned tasks</p>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center min-h-[40vh]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                            <p className="text-gray-600">Loading tasks...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <p className="text-red-800 font-semibold">{error}</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-green-100/50 p-8 sm:p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-6">
                                <CheckCircle className="h-16 w-16 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Tasks Assigned</h3>
                        <p className="text-gray-600">You have no tasks assigned at the moment. Check back later!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {tasks.map(task => (
                            <div key={task._id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-green-100/50 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2">{task.title}</h3>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusColor(task.status)}`}>
                                        {getStatusIcon(task.status)}
                                        <span className="hidden sm:inline">{getStatusText(task.status)}</span>
                                    </div>
                                </div>
                                {task.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                                )}
                                <div className="space-y-2 text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span>Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    {task.assignedDate && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                            <span>Assigned: {new Date(task.assignedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    )}
                                    {task.internship && (task.internship.title || task.internship.name) && (
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                            <span className="truncate">{task.internship.title || task.internship.name}</span>
                                        </div>
                                    )}
                                    {task.domain && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                                            <span>{task.domain}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTasks;
