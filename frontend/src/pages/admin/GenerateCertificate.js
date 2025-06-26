import React, { useState } from 'react';
import api from '../../config/api';
import setAuthToken from '../../utils/setAuthToken';

const GenerateCertificate = () => {
    const [formData, setFormData] = useState({
        user: '',
        candidateName: '',
        internshipTitle: '',
        duration: '',
        completionDate: '',
        certificateId: ''
    });

    const { user, candidateName, internshipTitle, duration, completionDate, certificateId } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (localStorage.token) setAuthToken(localStorage.token);

        // Auto-generate certificateId if not provided
        let certId = certificateId;
        if (!certId) {
            certId = `${internshipTitle.replace(/\s+/g, '-')}-${user}`;
        }

        try {
            const payload = {
                user,
                candidateName,
                internshipTitle,
                duration,
                completionDate,
                certificateId: certId
            };
            const res = await api.post('/certificates', payload);
            alert(`Certificate generated successfully! Certificate ID: ${res.data.data.certificateId}`);
            setFormData({ user: '', candidateName: '', internshipTitle: '', duration: '', completionDate: '', certificateId: '' }); // Clear form
        } catch (err) {
            console.error('Failed to generate certificate', err.response.data);
            alert(`Error: ${err.response.data.message}`);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Generate a New Certificate</h1>
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
                        <label className="block text-sm font-medium text-gray-700">Internship Title</label>
                        <input type="text" name="internshipTitle" value={internshipTitle} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <input type="text" name="duration" value={duration} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="e.g. 4 Weeks" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                        <input type="date" name="completionDate" value={completionDate} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Certificate ID (optional)</label>
                        <input type="text" name="certificateId" value={certificateId} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="Auto-generated if left blank" />
                    </div>
                    <div>
                        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Generate Certificate</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerateCertificate; 