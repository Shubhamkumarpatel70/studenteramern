import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import setAuthToken from '../../utils/setAuthToken';
import { Trash2, Eye } from 'lucide-react';

const GenerateCertificate = () => {
    const [formData, setFormData] = useState({
        user: '',
        candidateName: '',
        internshipTitle: '',
        duration: '',
        completionDate: '',
        certificateId: '',
        signatureName: ''
    });
    const [showPreview, setShowPreview] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, candidateName, internshipTitle, duration, completionDate, certificateId, signatureName } = formData;

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
                certificateId: certId,
                signatureName
            };
            const res = await api.post('/certificates', payload);
            alert(`Certificate generated successfully! Certificate ID: ${res.data.data.certificateId}`);
            setFormData({ user: '', candidateName: '', internshipTitle: '', duration: '', completionDate: '', certificateId: '', signatureName: '' }); // Clear form
        } catch (err) {
            console.error('Failed to generate certificate', err.response.data);
            alert(`Error: ${err.response.data.message}`);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/certificates', config);
            setCertificates(res.data.data);
        } catch (err) {
            // Optionally handle error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.delete(`/certificates/${id}`, config);
            setCertificates(certificates.filter(cert => cert._id !== id));
        } catch (err) {
            alert('Failed to delete certificate.');
        }
    };

    // HTML/CSS Certificate Preview
    const certHTML = `
    <!DOCTYPE html>
    <html><head><meta charset='utf-8'>
    <style>
    body { background: #f4f4f4; margin: 0; }
    .certificate {
      background: #fff;
      margin: 40px auto;
      padding: 40px 60px;
      border-radius: 16px;
      max-width: 1100px;
      min-height: 600px;
      box-shadow: 0 4px 32px rgba(44,62,80,0.10);
      border: 3px solid #1e293b;
      position: relative;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .watermark {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 6rem;
      color: #4f46e5;
      opacity: 0.08;
      pointer-events: none;
      user-select: none;
      z-index: 0;
    }
    .logo {
      display: block;
      margin: 40px auto 0 auto;
      height: 120px;
      max-width: 300px;
      object-fit: contain;
    }
    .title { text-align: center; font-size: 2.8rem; font-weight: bold; color: #1e293b; margin: 48px 0 12px 0; }
    .subtitle { text-align: center; font-size: 1.2rem; color: #333; margin-bottom: 24px; }
    .name { text-align: center; font-size: 2.2rem; font-weight: bold; color: #0e7490; margin-bottom: 8px; }
    .desc { text-align: center; font-size: 1.1rem; color: #222; margin-bottom: 8px; }
    .internship { text-align: center; font-size: 1.5rem; font-weight: bold; color: #1e293b; margin-bottom: 8px; }
    .info { text-align: center; font-size: 1.1rem; color: #444; margin-bottom: 4px; }
    .cert-id { text-align: center; font-size: 1rem; color: #666; margin-bottom: 24px; }
    .signature { position: absolute; left: 60px; bottom: 60px; font-size: 1.1rem; color: #222; }
    .for { position: absolute; right: 60px; bottom: 60px; font-size: 1.1rem; color: #222; }
    </style></head><body>
    <div class='certificate'>
      <div class='watermark'>Student Era</div>
      <!-- For React app: -->
      <img src='/logo.png' alt='Logo' class='logo' />
      <!-- For static HTML: <img src='../../../public/logo.png' alt='Logo' class='logo' /> -->
      <div class='title'>Certificate of Completion</div>
      <div class='subtitle'>This is to certify that</div>
      <div class='name'>${candidateName || 'Shubham Kumar'}</div>
      <div class='desc'>has successfully completed the internship in</div>
      <div class='internship'>${internshipTitle || 'MERN Stack Development'}</div>
      <div class='info'>Duration: ${duration || '4 Weeks'}</div>
      <div class='info'>Completion Date: ${completionDate || '2024-06-01'}</div>
      <div class='cert-id'>Certificate ID: ${certificateId || 'SE-CERT-123456'}</div>
      <div class='signature'>
        _________________________<br>
        ${signatureName || 'Authorized Signature'}
      </div>
      <div class='for'>
        For Student Era
        <img src='/stamp.png' alt='Stamp' style='display:inline-block;vertical-align:middle;width:80px;margin-left:16px;' />
      </div>
    </div>
    </body></html>
    `;

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
                        <label className="block text-sm font-medium text-gray-700">Authorized Signature Name</label>
                        <input type="text" name="signatureName" value={signatureName} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="Enter signature name (e.g. HR Name)" />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setShowPreview(!showPreview)} className="w-1/2 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{showPreview ? 'Hide' : 'Preview'}</button>
                        <button type="submit" className="w-1/2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Generate Certificate</button>
                    </div>
                </form>
                {showPreview && (
                    <div className="mt-8 p-4 border rounded bg-gray-50">
                        <h2 className="text-xl font-bold mb-2">Certificate Preview</h2>
                        <iframe
                            title="Certificate Preview"
                            srcDoc={certHTML}
                            width="1100"
                            height="800"
                            style={{ border: 'none', background: 'transparent' }}
                        />
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-bold mb-4">All Generated Certificates</h2>
                {loading ? (
                    <div>Loading certificates...</div>
                ) : certificates.length === 0 ? (
                    <div className="text-gray-500">No certificates generated yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Internship</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {certificates.map(cert => (
                                    <tr key={cert._id}>
                                        <td className="px-4 py-2 whitespace-nowrap">{cert.candidateName}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{cert.internshipTitle}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{cert.duration}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : '-'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{cert.certificateId}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center flex gap-2 justify-center">
                                            <a href={cert.fileUrl || `/verify-certificate/${cert.certificateId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900"><Eye size={20} /></a>
                                            <button onClick={() => handleDelete(cert._id)} className="text-red-600 hover:text-red-900"><Trash2 size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateCertificate; 