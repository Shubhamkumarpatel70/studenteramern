import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Loader2, Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, User, Briefcase } from 'lucide-react';

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
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Assigned Tasks</h1>
            
            {tasks.length === 0 ? (
                <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
                    <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold">No Tasks Assigned</h3>
                    <p className="mt-1">You don't have any tasks assigned to you yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <div key={task._id} className={`bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-lg border-l-4 ${task.status === 'completed' ? 'border-green-400' : task.status === 'in-progress' ? 'border-blue-400' : task.status === 'overdue' ? 'border-red-400' : 'border-yellow-400'} hover:shadow-2xl transition-transform duration-200 hover:scale-105 max-w-md mx-auto`}> 
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-600' : task.status === 'in-progress' ? 'bg-blue-100 text-blue-600' : task.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'} mr-2`}>
                                        {getStatusIcon(task.status)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)} shadow-sm`}>{getStatusText(task.status)}</span>
                                    {isOverdue(task.dueDate) && task.status !== 'completed' && (
                                        <span className="ml-3 text-xs text-red-600 font-bold animate-pulse">OVERDUE</span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{task.title}</h3>
                                <p className="text-gray-600 mb-4 text-base">{task.description}</p>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex items-center text-blue-600">
                                        <Briefcase className="h-4 w-4 mr-2" />
                                        {task.internship.title}
                                    </div>
                                    <div className="flex items-center text-purple-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-indigo-600">
                                        <Clock className="h-4 w-4 mr-2" />
                                        Domain: {task.domain}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTasks;
