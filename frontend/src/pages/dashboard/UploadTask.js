import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Upload, Loader2, PlusCircle, XCircle, File, Edit, Trash2 } from 'lucide-react';

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

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-primary-light via-background to-accent-light min-h-screen font-sans font-medium">
            <div className="w-full max-w-2xl mx-auto font-sans font-medium">
                <div className="bg-card rounded-2xl shadow-lg p-4 sm:p-8 mb-8 font-sans font-medium border border-primary-light/30">
                    <h1 className="text-3xl font-extrabold mb-6 text-primary-dark font-sans">Upload Task Submission</h1>
                    {assignedTasks.length === 0 ? (
                        <div className="text-center text-primary-dark/70">
                            <p>You have no active tasks to submit.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="task" className="block text-sm font-medium text-primary-dark">Select Task to Submit For</label>
                                <select id="task" value={formData.assignedTask} onChange={handleTaskSelection} required className="mt-1 block w-full rounded-lg border border-primary-light focus:ring-primary focus:border-primary">
                                    <option value="">-- Choose an assigned task --</option>
                                    {assignedTasks.map(task => (
                                        <option key={task._id} value={task._id}>{task.title} ({task.internship.title})</option>
                                    ))}
                                </select>
                            </div>
                            {/* File Links */}
                            <div>
                                <label className="block text-sm font-medium text-primary-dark">File/Work Links (e.g., GitHub, Google Drive)</label>
                                 {fileLinks.map((link, index) => (
                                    <div key={index} className="flex items-center gap-2 mt-2">
                                        <input type="url" value={link} onChange={(e) => handleLinkChange(index, e.target.value)} className="block w-full rounded-lg border border-primary-light focus:ring-primary focus:border-primary" placeholder="https://..."/>
                                        {fileLinks.length > 1 && <XCircle onClick={() => removeLinkField(index)} className="cursor-pointer text-error"/>}
                                    </div>
                                ))}
                                {fileLinks.length < 5 && <button type="button" onClick={addLinkField} className="mt-2 text-sm text-primary flex items-center gap-1"><PlusCircle size={16}/> Add another link</button>}
                            </div>
                            {/* Project Folder Upload */}
                            <div>
                                 <label className="block text-sm font-medium text-primary-dark">Project File (as .zip, .rar, .7z)</label>
                                 <div className="mt-2 flex items-center justify-center w-full">
                                    <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-primary-light/10 hover:border-primary-light/50 rounded-lg transition">
                                        <div className="flex flex-col items-center justify-center pt-7">
                                            <File className="w-8 h-8 text-primary-dark/30"/>
                                            <p className="pt-1 text-sm tracking-wider text-primary-dark/40 group-hover:text-primary-dark">
                                                {projectFile ? projectFile.name : 'Select a file'}
                                            </p>
                                        </div>
                                        <input type="file" onChange={handleFileChange} className="opacity-0" accept=".zip,.rar,.7z,application/zip,application/x-rar-compressed,application/x-7z-compressed"/>
                                    </label>
                                 </div>
                            </div>
                            {error && <div className="text-error text-center p-2 bg-error/10 rounded-md">{error}</div>}
                            {success && <div className="text-success text-center p-2 bg-success/10 rounded-md">{success}</div>}
                            <button type="submit" className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow transition-colors duration-200 disabled:opacity-60" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Task'}</button>
                        </form>
                    )}
                </div>
                {/* Uploaded Tasks List */}
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Manage Uploaded Tasks</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Links</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {uploadedTasks.map(task => (
                                    <tr key={task._id}>
                                        <td className="px-4 py-2 whitespace-nowrap">{task.title}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{(task.fileLinks || []).map((link, i) => <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mr-2">Link {i+1}</a>)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{task.projectFile ? <a href={task.projectFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">File</a> : '-'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                                            <button onClick={() => handleEdit(task)} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><Edit size={16}/>Edit</button>
                                            <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1"><Trash2 size={16}/>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadTask;