import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Upload, Loader2, PlusCircle, XCircle, File, Edit, Trash2, FileText } from 'lucide-react';

const UploadTask = () => {
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [formData, setFormData] = useState({
        assignedTask: '',
        internship: '',
        title: ''
    });
    const [fileLinks, setFileLinks] = useState(['']);
    const [projectFile, setProjectFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadedTasks, setUploadedTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const fetchAssignedTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await api.get('/assigned-tasks/my-tasks', config);
                const activeTasks = res.data.data.filter(task => task.status !== 'completed');
                setAssignedTasks(activeTasks);
            } catch (err) {
                setError('Could not fetch your assigned tasks.');
            } finally {
                setLoading(false);
            }
        };
        const fetchUploadedTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await api.get('/tasks/my-uploads', config);
                setUploadedTasks(res.data.data);
            } catch (err) {
                // ignore
            }
        };
        fetchAssignedTasks();
        fetchUploadedTasks();
    }, []);

    const handleTaskSelection = (e) => {
        const taskId = e.target.value;
        const selected = assignedTasks.find(t => t._id === taskId);
        if (selected) {
            setFormData({
                assignedTask: selected._id,
                internship: selected.internship._id,
                title: selected.title
            });
        } else {
            setFormData({ assignedTask: '', internship: '', title: '' });
        }
    };
    
    const handleLinkChange = (index, value) => {
        const newLinks = [...fileLinks];
        newLinks[index] = value;
        setFileLinks(newLinks);
    };

    const addLinkField = () => {
        if (fileLinks.length < 5) setFileLinks([...fileLinks, '']);
    };

    const removeLinkField = (index) => {
        setFileLinks(fileLinks.filter((_, i) => i !== index));
    };

    const handleFileChange = (e) => {
        setProjectFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        if (!formData.assignedTask || (!fileLinks[0] && !projectFile)) {
            setError('Please select a task and provide at least one link or a project file.');
            setSubmitting(false);
            return;
        }

        const submissionData = new FormData();
        submissionData.append('assignedTask', formData.assignedTask);
        submissionData.append('internship', formData.internship);
        submissionData.append('title', formData.title);
        fileLinks.forEach(link => {
            if(link) submissionData.append('fileLinks', link);
        });
        if (projectFile) {
            submissionData.append('projectFile', projectFile);
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            };
            await api.post('/tasks', submissionData, config);
            setSuccess('Your task has been submitted successfully!');
            // Reset form
            setFormData({ assignedTask: '', internship: '', title: '' });
            setFileLinks(['']);
            setProjectFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit task. Check file type and size.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        // Populate formData, fileLinks, etc. with task data for editing
        setFormData({
            assignedTask: task.assignedTask,
            internship: task.internship,
            title: task.title
        });
        setFileLinks(task.fileLinks || ['']);
        setProjectFile(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this uploaded task?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.delete(`/tasks/${id}`, config);
            setUploadedTasks(uploadedTasks.filter(t => t._id !== id));
        } catch (err) {
            alert('Failed to delete uploaded task.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
            <div className="w-full space-y-6 sm:space-y-8">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-purple-100/50">
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2">Upload Task Submission</h1>
                        <p className="text-sm sm:text-base text-gray-600">Submit your completed tasks for review</p>
                    </div>
                    {assignedTasks.length === 0 ? (
                        <div className="text-center py-12 rounded-xl">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gray-100 rounded-full p-6">
                                    <FileText className="h-16 w-16 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Tasks</h3>
                            <p className="text-gray-600">You have no active tasks to submit at the moment.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                            <div>
                                <label htmlFor="task" className="block text-sm font-semibold text-gray-700 mb-2">Select Task to Submit For <span className="text-red-500">*</span></label>
                                <select 
                                    id="task" 
                                    value={formData.assignedTask} 
                                    onChange={handleTaskSelection} 
                                    required 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800"
                                >
                                    <option value="">-- Choose an assigned task --</option>
                                    {assignedTasks.map(task => (
                                        <option key={task._id} value={task._id}>{task.title} ({task.internship.title})</option>
                                    ))}
                                </select>
                            </div>
                            {/* File Links */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">File/Work Links (e.g., GitHub, Google Drive)</label>
                                {fileLinks.map((link, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <input 
                                            type="url" 
                                            value={link} 
                                            onChange={(e) => handleLinkChange(index, e.target.value)} 
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800" 
                                            placeholder="https://github.com/..."
                                        />
                                        {fileLinks.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => removeLinkField(index)} 
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <XCircle className="h-5 w-5"/>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {fileLinks.length < 5 && (
                                    <button 
                                        type="button" 
                                        onClick={addLinkField} 
                                        className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 transition-colors"
                                    >
                                        <PlusCircle size={16}/> Add another link
                                    </button>
                                )}
                            </div>
                            {/* Project Folder Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Project File (as .zip, .rar, .7z)</label>
                                <div className="mt-2">
                                    <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-all duration-200">
                                        <div className="flex flex-col items-center justify-center pt-7">
                                            <File className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="text-sm text-gray-600 font-medium">
                                                {projectFile ? projectFile.name : 'Click to select a file'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">.zip, .rar, or .7z files only</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                            accept=".zip,.rar,.7z,application/zip,application/x-rar-compressed,application/x-7z-compressed"
                                        />
                                    </label>
                                </div>
                            </div>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl p-4">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl p-4">
                                    {success}
                                </div>
                            )}
                            <button 
                                type="submit" 
                                className="w-full py-3.5 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5" />
                                        Submit Task
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
                {/* Uploaded Tasks List */}
                {uploadedTasks.length > 0 && (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Manage Uploaded Tasks</h2>
                        {/* Mobile Card View */}
                        <div className="block md:hidden space-y-4">
                            {uploadedTasks.map(task => (
                                    <div key={task._id} className="bg-white rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-base font-bold text-gray-800 flex-1">{task.title}</h3>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(task)} 
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(task._id)} 
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                    {(task.fileLinks && task.fileLinks.length > 0) && (
                                        <div className="mb-2">
                                            <div className="text-xs text-gray-500 mb-1">Links:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {(task.fileLinks || []).map((link, i) => (
                                                    <a 
                                                        key={i} 
                                                        href={link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                                                    >
                                                        Link {i+1}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {task.projectFile && (
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">File:</div>
                                            <a 
                                                href={task.projectFile} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-sm text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                                            >
                                                <File className="h-4 w-4" />
                                                Download File
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Title</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Links</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">File</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {uploadedTasks.map(task => (
                                        <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-800">{task.title}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {(task.fileLinks || []).map((link, i) => (
                                                        <a 
                                                            key={i} 
                                                            href={link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                                                        >
                                                            Link {i+1}
                                                        </a>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {task.projectFile ? (
                                                    <a 
                                                        href={task.projectFile} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-sm text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                                                    >
                                                        <File className="h-4 w-4" />
                                                        Download
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleEdit(task)} 
                                                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold text-sm transition-colors"
                                                    >
                                                        <Edit size={16}/>Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(task._id)} 
                                                        className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm transition-colors"
                                                    >
                                                        <Trash2 size={16}/>Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadTask;