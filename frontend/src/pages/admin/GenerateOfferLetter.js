import React, { useState, useEffect } from 'react';
import api from '../../config/api';
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
        techPartner: 'Student Era',
        stipend: '',
        hrName: ''
    });
    const [showPreview, setShowPreview] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState(null);
    const [allLetters, setAllLetters] = useState([]);

    const { user, candidateName, internId, title, company, issueDate, startDate, techPartner, stipend, hrName } = formData;

    const fetchAllLetters = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/offer-letters', config);
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
            const res = await api.post('/offer-letters', formData);
            alert('Offer letter generated successfully!');
            setGeneratedLetter(res.data.data);
            setFormData({ user: '', candidateName: '', internId: '', title: '', company: 'Student Era', issueDate: '', startDate: '', techPartner: 'Student Era', stipend: '', hrName: '' });
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
            await api.delete(`/offer-letters/${id}`, config);
            fetchAllLetters();
        } catch (err) {
            alert('Failed to delete offer letter.');
        }
    };

    // HTML/CSS Offer Letter Preview
    const offerLetterHTML = `
    <!DOCTYPE html>
    <html><head><meta charset='utf-8'>
    <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; background: #f4f4f4; }
    .container { background: #fff; margin: 40px auto; padding: 56px 64px 48px 64px; border-radius: 16px; max-width: 950px; box-shadow: 0 4px 32px rgba(44,62,80,0.10); border: 2.5px solid #4f46e5; position: relative; min-height: 1100px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #6366f1; padding-bottom: 24px; margin-bottom: 44px; }
    .logo-block { display: flex; align-items: center; gap: 24px; }
    .logo { height: 290px; margin-bottom: 2px; margin-top: -120px; margin-left: -70px; }
    .company-name { font-size: 2.4rem; font-weight: bold; color: #4f46e5; letter-spacing: 2px; margin-left: 0; }
    .address-block { text-align: right; font-size: 1.13rem; color: #444; line-height: 1.6; margin-top: 8px; }
    .ref-date-row { display: flex; justify-content: space-between; margin: 44px 0 18px 0; font-size: 1.13rem; }
    .subject-row { display: flex; justify-content: center; align-items: center; margin-bottom: 24px; }
    .subject { font-weight: bold; text-decoration: underline; font-size: 1.5rem; color: #4f46e5; letter-spacing: 1px; }
    .content { font-size: 1.18rem; color: #222; line-height: 1.8; margin-top: 36px; }
    .highlight { font-weight: bold; color: #4f46e5; }
    .confidential { font-weight: bold; text-align: center; margin: 28px 0 14px 0; text-decoration: underline; color: #b91c1c; }
    .terms { margin: 0 0 28px 0; }
    .terms li { margin-bottom: 12px; }
    .footer { margin-top: 56px; font-size: 1.13rem; color: #555; position: relative; min-height: 120px; }
    .footer .stamp-img { display:inline-block;vertical-align:middle;width:90px;margin-left:18px;opacity:0.55;position:relative;top:8px; }
    .signatures { width: 100%; display: flex; justify-content: space-between; margin-top: 64px; font-size: 1.08rem; }
    .sign-col { text-align: center; width: 24%; }
    .watermark { position: absolute; top: 44%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 5.5rem; color: #6366f1; opacity: 0.09; pointer-events: none; z-index: 0; user-select: none; }
    </style></head><body>
    <div class='container'>
      <div class='watermark'>Student Era</div>
      <div class='header'>
        <div class='logo-block'>
          <img src='/logo.png' alt='Company Logo' class='logo' />
          <div class='company-name'>${company || 'Student Era'}</div>
        </div>
        <div class='address-block'>Bihar, India<br />contact.studentera@gmail.com<br />www.studentera.live</div>
      </div>
      <div class='ref-date-row'>
        <div>REF: ${internId || 'SE12345'}</div>
        <div><span class='highlight'>Dated:</span> ${issueDate || '2024-06-01'}</div>
      </div>
      <div class='subject-row'>
        <div class='subject'>LETTER OF OFFER</div>
      </div>
      <div class='content'>
        <p>Dear <span class='highlight'>${candidateName || 'Candidate Name'}</span>,<br />Intern ID <span class='highlight'>${internId || 'SE1750975236268'}</span></p>
        <p>Congratulations!!</p>
        <div class='confidential'>STRICTLY PRIVATE &amp; CONFIDENTIAL</div>
        <p>We are pleased to offer you a Summer Internship with <span class='highlight'>${company || 'Student Era'}</span>, based on your application and the interview &amp; discussions you had with us. Details of the terms &amp; conditions of offer are as under:</p>
        <ol class='terms'>
          <li>You must always maintain utmost secrecy and confidentiality of your offer, its terms, and of any information about the company, and shall not disclose any such details to outsiders.</li>
          <li>You will be designated as <span class='highlight'>${title || 'MERN Developer'}</span>.</li>
          <li>Your date of commencement of internship will be from <span class='highlight'>${startDate || '2024-06-10'}</span> in WFH mode.</li>
          <li>You will be entitled to receive compensation and benefits as discussed at the time of interview.</li>
          <li>You agree to work in both work environments i.e., WFH, Work from office.</li>
          <li>${techPartner || 'Tech Partner'} shall be the official Technology Partner for this internship.</li>
          <li>The company reserves all rights to withdraw this internship offer at any time without giving any reasons.</li>
          <li>In addition to core responsibilities of this internship, the company may assign additional tasks or projects based on operational needs and availability. The intern is expected to contribute effectively to such assignments as per the company's discretion.</li>
        </ol>
        <p>Kindly sign and return a copy of this letter as a token of your acceptance of the offer.</p>
        <p>Looking forward to a long and mutually beneficial career with us</p>
        <div class='footer'>Yours truly,<br />For ${company || 'Student Era'}
        <img src='/stamp.png' alt='Stamp' class='stamp-img' />
        <br />${hrName || 'HR Name'} (HR)</div>
        <div class='signatures'>
          <div class='sign-col'>${hrName || 'HR Name'}<br /><span style='font-size:0.95em;'>(HR)</span></div>
          <div class='sign-col'>Applicant Sign</div>
          <div class='sign-col'>College</div>
          <div class='sign-col'>Location</div>
        </div>
      </div>
    </div>
    </body></html>
    `;

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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">HR Name</label>
                        <input type="text" name="hrName" value={hrName} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="Enter HR Name" />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setShowPreview(!showPreview)} className="w-1/2 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{showPreview ? 'Hide' : 'Preview'}</button>
                        <button type="submit" className="w-1/2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Generate Offer Letter</button>
                    </div>
                </form>
                {showPreview && (
                    <div className="mt-8 p-4 border rounded bg-gray-50">
                        <h2 className="text-xl font-bold mb-2">Offer Letter Preview</h2>
                        <iframe
                            title="Offer Letter Preview"
                            srcDoc={offerLetterHTML}
                            width="900"
                            height="1200"
                            style={{ border: 'none', background: 'transparent' }}
                        />
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