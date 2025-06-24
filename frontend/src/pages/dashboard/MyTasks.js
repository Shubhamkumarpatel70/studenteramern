import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
                const res = await axios.get('/api/assigned-tasks/my-tasks', config);
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
                        <div key={task._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        {getStatusIcon(task.status)}
                                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                                            {getStatusText(task.status)}
                                        </span>
                                    </div>
                                    {isOverdue(task.dueDate) && task.status !== 'completed' && (
                                        <span className="text-xs text-red-600 font-medium">OVERDUE</span>
                                    )}
                                </div>
                                
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Briefcase className="h-4 w-4 mr-2" />
                                        <span>{task.internship.title}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span>Domain: {task.domain}</span>
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
