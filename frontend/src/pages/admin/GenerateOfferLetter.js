import React, { useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const GenerateOfferLetter = () => {
    const [formData, setFormData] = useState({
        user: '',
        candidateName: '',
        internId: '',
        title: '',
        company: 'Student Era',
        issueDate: '',
        startDate: '',
        techPartner: '',
        stipend: ''
    });
    const [showPreview, setShowPreview] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState(null);
    const [allLetters, setAllLetters] = useState([]);

    const { user, candidateName, internId, title, company, issueDate, startDate, techPartner, stipend } = formData;

    const fetchAllLetters = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('http://localhost:5000/api/offer-letters', config);
            setAllLetters(res.data.data);
        } catch (err) {
            setAllLetters([]);
        }
    };

    useEffect(() => {
        fetchAllLetters();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (localStorage.token) setAuthToken(localStorage.token);
        try {
            const res = await axios.post('http://localhost:5000/api/offer-letters', formData);
            alert('Offer letter generated successfully!');
            setGeneratedLetter(res.data.data);
            setFormData({ user: '', candidateName: '', internId: '', title: '', company: 'Student Era', issueDate: '', startDate: '', techPartner: '', stipend: '' });
            setShowPreview(false);
            fetchAllLetters();
        } catch (err) {
            console.error('Failed to generate offer letter', err.response.data);
            alert(`Error: ${err.response.data.message}`);
        }
    };

    const deleteOfferLetter = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer letter?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/offer-letters/${id}`, config);
            fetchAllLetters();
        } catch (err) {
            alert('Failed to delete offer letter.');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Generate a New Offer Letter</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student ID (internId) or User ID</label>
                        <input type="text" name="user" value={user} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
                        <input type="text" name="candidateName" value={candidateName} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Intern ID</label>
                        <input type="text" name="internId" value={internId} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Title</label>
                        <input type="text" name="title" value={title} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input type="text" name="company" value={company} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                        <input type="date" name="issueDate" value={issueDate} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Internship Start Date</label>
                        <input type="date" name="startDate" value={startDate} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tech Partner</label>
                        <input type="text" name="techPartner" value={techPartner} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="Bridge4Engineers.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stipend (per month)</label>
                        <input type="number" name="stipend" value={stipend} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setShowPreview(!showPreview)} className="w-1/2 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{showPreview ? 'Hide' : 'Preview'}</button>
                        <button type="submit" className="w-1/2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Generate Offer Letter</button>
                    </div>
                </form>
                {showPreview && (
                    <div className="mt-8 p-4 border rounded bg-gray-50">
                        <h2 className="text-xl font-bold mb-2">Offer Letter Preview</h2>
                        <div><b>Candidate Name:</b> {candidateName}</div>
                        <div><b>Intern ID:</b> {internId}</div>
                        <div><b>Title:</b> {title}</div>
                        <div><b>Company:</b> {company}</div>
                        <div><b>Issue Date:</b> {issueDate}</div>
                        <div><b>Start Date:</b> {startDate}</div>
                        <div><b>Tech Partner:</b> {techPartner}</div>
                        <div><b>Stipend:</b> {stipend}</div>
                    </div>
                )}
                {generatedLetter && generatedLetter.fileUrl && (
                    <div className="mt-8 p-4 border rounded bg-green-50 text-center">
                        <h2 className="text-lg font-semibold mb-2 text-green-700">Offer Letter Generated!</h2>
                        <a href={generatedLetter.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-bold">View / Download Offer Letter PDF</a>
                    </div>
                )}
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4">All Generated Offer Letters</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PDF</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allLetters.map(letter => (
                                    <tr key={letter._id}>
                                        <td className="px-4 py-2 whitespace-nowrap">{letter.candidateName || '-'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{letter.title}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{new Date(letter.issueDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {letter.fileUrl ? (
                                                <a href={letter.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-bold">View PDF</a>
                                            ) : (
                                                <span className="text-gray-400">Not Available</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <button onClick={() => deleteOfferLetter(letter._id)} className="text-red-600 hover:text-red-800 font-bold">Delete</button>
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

export default GenerateOfferLetter; 