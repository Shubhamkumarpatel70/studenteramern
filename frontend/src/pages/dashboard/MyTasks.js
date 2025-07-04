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
        <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-primary-light via-background to-accent-light min-h-screen font-sans font-medium">
            <div className="w-full max-w-2xl mx-auto font-sans font-medium">
                <h1 className="text-3xl font-extrabold mb-6 text-primary-dark font-sans">My Tasks</h1>
                {loading ? (
                    <div className="text-center py-8">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-8 text-primary-dark/70 bg-card rounded-2xl shadow-lg">You have no tasks assigned.</div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task._id} className="bg-card rounded-2xl shadow p-4 flex flex-col gap-2 border border-primary-light/30 hover:shadow-2xl transition-shadow duration-200">
                                <div className="font-bold text-primary-dark text-lg flex items-center gap-2">{task.title}</div>
                                <div className="text-xs text-primary-dark/60">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                                <div className="text-sm text-primary-dark/80">{task.description}</div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border mt-2 ${getStatusColor(task.status)}`}>{getStatusIcon(task.status)} {getStatusText(task.status)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTasks;
