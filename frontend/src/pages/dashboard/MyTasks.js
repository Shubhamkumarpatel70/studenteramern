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
        <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen font-sans font-medium">
            <div className="max-w-lg mx-auto font-sans font-medium">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Tasks</h1>
                {loading ? (
                    <div className="text-center py-8">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">You have no tasks assigned.</div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task._id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                                <div className="font-semibold text-gray-800">{task.title}</div>
                                <div className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-600">{task.description}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTasks;
