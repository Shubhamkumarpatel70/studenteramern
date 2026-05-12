import React, { useState, useEffect, useRef } from 'react';
import api from '../../config/api';
import setAuthToken from '../../utils/setAuthToken';
import { Search, X } from 'lucide-react';

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
    const [offerLetterExists, setOfferLetterExists] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [selectedUserDisplay, setSelectedUserDisplay] = useState('');
    const searchInputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [internships, setInternships] = useState([]);
    const [loadingInternships, setLoadingInternships] = useState(false);
    const [jobTitleSearchTerm, setJobTitleSearchTerm] = useState('');
    const [showJobTitleDropdown, setShowJobTitleDropdown] = useState(false);
    const [selectedJobTitleDisplay, setSelectedJobTitleDisplay] = useState('');
    const jobTitleSearchInputRef = useRef(null);
    const jobTitleDropdownRef = useRef(null);
    const [hrs, setHrs] = useState([]);
    const [selectedHR, setSelectedHR] = useState('');
    const [editingId, setEditingId] = useState(null);

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
        fetchUsers();
        fetchInternships();
        fetchHRs();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/users', config);
            setUsers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchInternships = async () => {
        setLoadingInternships(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/internships', config);
            setInternships(res.data.data);
        } catch (err) {
            console.error('Failed to fetch internships', err);
        } finally {
            setLoadingInternships(false);
        }
    };

    const fetchHRs = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/hr', config);
            setHrs(res.data.data);
        } catch (err) {
            console.error('Failed to fetch HRs', err);
        }
    };

    const handleUserSelect = (selectedUser) => {
        if (selectedUser && selectedUser.internId) {
            setFormData(prev => ({
                ...prev,
                user: selectedUser.internId,
                candidateName: selectedUser.name || '',
                internId: selectedUser.internId || ''
            }));
            setSelectedUserDisplay(`${selectedUser.internId} - ${selectedUser.name}${selectedUser.email ? ` (${selectedUser.email})` : ''}`);
            setSearchTerm('');
            setShowUserDropdown(false);
        }
    };

    const filteredUsers = users.filter(u => {
        if (!u.internId) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            u.internId.toLowerCase().includes(searchLower) ||
            u.name?.toLowerCase().includes(searchLower) ||
            u.email?.toLowerCase().includes(searchLower)
        );
    });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowUserDropdown(true);

        if (!value) {
            setFormData(prev => ({ ...prev, user: '', candidateName: '', internId: '' }));
            setSelectedUserDisplay('');
        }
    };

    const handleJobTitleSelect = (selectedInternship) => {
        if (selectedInternship) {
            setFormData(prev => ({
                ...prev,
                title: selectedInternship.title,
                stipend: selectedInternship.stipend || prev.stipend
            }));
            setSelectedJobTitleDisplay(selectedInternship.title);
            setJobTitleSearchTerm('');
            setShowJobTitleDropdown(false);

            // Auto-select HR based on internship title
            const matchingHR = hrs.find(hr => {
                if (!hr.isActive) return false;
                const titleLower = selectedInternship.title.toLowerCase();
                const categoryLower = hr.internshipCategory.toLowerCase();
                // Check if title contains category or category contains title keywords
                return titleLower.includes(categoryLower) ||
                    categoryLower.includes(titleLower) ||
                    titleLower.split(' ').some(word => categoryLower.includes(word)) ||
                    categoryLower.split(' ').some(word => titleLower.includes(word));
            });
            if (matchingHR) {
                setFormData(prev => ({ ...prev, hrName: matchingHR.name }));
                setSelectedHR(matchingHR.name);
            }
        }
    };

    const filteredJobTitles = internships.filter(internship => {
        if (!internship.title) return false;
        const searchLower = jobTitleSearchTerm.toLowerCase();
        return internship.title.toLowerCase().includes(searchLower);
    });

    const handleJobTitleSearchChange = (e) => {
        const value = e.target.value;
        setJobTitleSearchTerm(value);
        setShowJobTitleDropdown(true);

        if (!value) {
            setFormData(prev => ({ ...prev, title: '', stipend: '' }));
            setSelectedJobTitleDisplay('');
            setSelectedHR('');
            setFormData(prev => ({ ...prev, hrName: '' }));
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)
            ) {
                setShowUserDropdown(false);
            }
            if (
                jobTitleDropdownRef.current &&
                !jobTitleDropdownRef.current.contains(event.target) &&
                jobTitleSearchInputRef.current &&
                !jobTitleSearchInputRef.current.contains(event.target)
            ) {
                setShowJobTitleDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const checkOfferLetter = () => {
            if (!formData.user || !formData.title) {
                setOfferLetterExists(false);
                return;
            }
            const existing = allLetters.find(letter => {
                const letterUserId = letter.user?._id || letter.user || (typeof letter.user === 'string' ? letter.user : null);
                const formUserId = formData.user;
                // Check if user matches (could be internId or _id)
                let userMatches = false;
                if (typeof formUserId === 'string') {
                    // Try to find user by internId
                    const userObj = users.find(u => u.internId === formUserId);
                    if (userObj) {
                        userMatches = (letterUserId && letterUserId.toString() === userObj._id.toString());
                    } else {
                        userMatches = (letterUserId && letterUserId.toString() === formUserId);
                    }
                }
                return userMatches && letter.title === formData.title;
            });
            setOfferLetterExists(!!existing);
        };
        checkOfferLetter();
    }, [formData.user, formData.title, allLetters, users]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        // Validate that a user is selected
        if (!user) {
            alert('Please select a student from the search results.');
            return;
        }

        if (localStorage.token) setAuthToken(localStorage.token);
        try {
            if (editingId) {
                // Update existing offer letter
                const res = await api.put(`/offer-letters/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                alert('Offer letter updated successfully!');
                setGeneratedLetter(res.data.data);
                setEditingId(null);
            } else {
                // Create new offer letter
                const res = await api.post('/offer-letters', formData);
                alert('Offer letter generated successfully!');
                setGeneratedLetter(res.data.data);
            }
            setFormData({ user: '', candidateName: '', internId: '', title: '', company: 'Student Era', issueDate: '', startDate: '', techPartner: 'Student Era', stipend: '', hrName: '' });
            setSelectedUserDisplay('');
            setSelectedJobTitleDisplay('');
            setSelectedHR('');
            setSearchTerm('');
            setJobTitleSearchTerm('');
            setShowPreview(false);
            fetchAllLetters();
        } catch (err) {
            console.error('Failed to generate/update offer letter', err.response?.data);
            alert(`Error: ${err.response?.data?.message || 'Failed to process offer letter'}`);
        }
    };

    const handleEdit = async (letterId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get(`/offer-letters/${letterId}`, config);
            const letter = res.data.data;

            // Get internId from populated user data or find in users list
            let userInternId = '';
            if (letter.user?.internId) {
                userInternId = letter.user.internId;
            } else if (letter.user?._id || letter.user) {
                const userId = letter.user?._id || letter.user;
                const userObj = users.find(u => {
                    const uId = u._id?.toString();
                    const letterUId = userId?.toString();
                    return uId === letterUId;
                });
                if (userObj && userObj.internId) {
                    userInternId = userObj.internId;
                }
            }

            // Find the user object to set display
            const userObj = users.find(u => u.internId === userInternId) ||
                (letter.user?.internId ? { internId: letter.user.internId, name: letter.user.name, email: letter.user.email } : null);

            // Find internship to set display
            const internshipObj = internships.find(i => i.title === letter.title);

            setFormData({
                user: userInternId,
                candidateName: letter.candidateName || '',
                internId: letter.internId || '',
                title: letter.title || '',
                company: letter.company || 'Student Era',
                issueDate: letter.issueDate ? new Date(letter.issueDate).toISOString().split('T')[0] : '',
                startDate: letter.startDate ? new Date(letter.startDate).toISOString().split('T')[0] : '',
                techPartner: letter.techPartner || 'Student Era',
                stipend: letter.stipend || '',
                hrName: letter.hrName || ''
            });

            if (userObj) {
                setSelectedUserDisplay(`${userObj.internId} - ${userObj.name}${userObj.email ? ` (${userObj.email})` : ''}`);
            }

            if (internshipObj) {
                setSelectedJobTitleDisplay(internshipObj.title);
                // Find matching HR
                const matchingHR = hrs.find(hr => {
                    if (!hr.isActive) return false;
                    const titleLower = internshipObj.title.toLowerCase();
                    const categoryLower = hr.internshipCategory.toLowerCase();
                    return titleLower.includes(categoryLower) ||
                        categoryLower.includes(titleLower) ||
                        titleLower.split(' ').some(word => categoryLower.includes(word)) ||
                        categoryLower.split(' ').some(word => titleLower.includes(word));
                });
                if (matchingHR && matchingHR.name === letter.hrName) {
                    setSelectedHR(matchingHR.name);
                } else if (letter.hrName) {
                    setSelectedHR(letter.hrName);
                }
            } else if (letter.title) {
                setSelectedJobTitleDisplay(letter.title);
            }

            setEditingId(letterId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            alert('Failed to load offer letter for editing');
            console.error(err);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ user: '', candidateName: '', internId: '', title: '', company: 'Student Era', issueDate: '', startDate: '', techPartner: 'Student Era', stipend: '', hrName: '' });
        setSelectedUserDisplay('');
        setSelectedJobTitleDisplay('');
        setSelectedHR('');
        setSearchTerm('');
        setJobTitleSearchTerm('');
        setShowUserDropdown(false);
        setShowJobTitleDropdown(false);
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

    const handleSendEmail = async (id) => {
        if (!window.confirm('Send this offer letter to the student via email?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.post(`/offer-letters/${id}/send-email`, {}, config);
            if (res.data.success) {
                alert('Offer letter sent to student email successfully!');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send offer letter email.');
        }
    };

    // Helper to format date
    const formatDate = (date) => {
        if (!date) return '__________';
        try {
            return new Date(date).toLocaleDateString();
        } catch {
            return date;
        }
    };

    // HTML/CSS Offer Letter Preview
    const formattedIssueDate = issueDate ? new Date(issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Month DD, YYYY";
    const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Month DD, YYYY";

    const offerLetterHTML = `
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='utf-8'>
        <title>Offer Letter - ${formData.company || 'Student Era'}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary-color: #0A2463;
                --secondary-color: #3E5C76;
                --accent-color: #28A745;
                --text-main: #1F2937;
                --text-muted: #6B7280;
                --border-color: #E5E7EB;
            }
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                line-height: 1.6; 
                color: var(--text-main); 
                background: #F3F4F6; 
                display: flex; 
                justify-content: center; 
                padding: 40px 20px; 
            }
            
            .container { 
                background: #FFFFFF; 
                width: 100%; 
                max-width: 850px; 
                padding: 70px 60px; 
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); 
                position: relative; 
                border-top: 10px solid var(--primary-color); 
                border-radius: 4px;
            }
            
            .header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 50px; 
                padding-bottom: 20px;
                border-bottom: 2px solid var(--border-color);
            }
            
            .logo-section { display: flex; align-items: center; gap: 15px; }
            .logo { height: 50px; width: auto; object-fit: contain; }
            
            .company-info { text-align: right; }
            .company-name { font-size: 20px; font-weight: 800; color: var(--primary-color); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
            .address-block { font-size: 11px; color: var(--text-muted); line-height: 1.5; font-weight: 500; }
            
            .meta-info { display: flex; justify-content: space-between; margin-bottom: 45px; font-size: 13px; color: var(--secondary-color); font-weight: 600; }
            .ref-no { color: var(--primary-color); }
            
            .subject-line { 
                text-align: center; 
                margin-bottom: 40px; 
            }
            .subject-line h1 { 
                font-size: 22px; 
                font-weight: 800; 
                color: var(--primary-color); 
                text-decoration: underline;
                text-underline-offset: 8px;
                text-decoration-thickness: 3px;
                display: inline-block;
            }
            
            .greeting { font-size: 15px; margin-bottom: 20px; font-weight: 500; }
            .candidate-name { font-weight: 700; color: var(--primary-color); }
            
            .id-badge { 
                display: inline-block;
                background: #EFF6FF;
                color: #1E40AF;
                padding: 4px 12px;
                border-radius: 9999px;
                font-size: 12px;
                font-weight: 700;
                margin-bottom: 30px;
                border: 1px solid #DBEAFE;
            }
            
            .announcement { 
                font-size: 16px; 
                font-weight: 700; 
                color: var(--primary-color); 
                margin-bottom: 25px; 
            }
            
            .confidential-tag { 
                text-align: center; 
                background: #FEF2F2;
                color: #B91C1C;
                font-size: 11px;
                font-weight: 800;
                padding: 6px;
                border-radius: 4px;
                letter-spacing: 2px;
                margin-bottom: 35px;
                border: 1px solid #FEE2E2;
            }
            
            .letter-content { font-size: 14px; line-height: 1.8; color: #374151; margin-bottom: 30px; }
            
            .stipend-highlight { 
                background: #F0FDF4;
                border: 1px solid #DCFCE7;
                padding: 15px 20px;
                border-radius: 8px;
                margin: 25px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .stipend-amount { font-weight: 800; color: #15803D; font-size: 16px; }
            
            .terms-list { margin-left: 20px; margin-bottom: 40px; }
            .terms-list li { margin-bottom: 12px; padding-left: 10px; }
            .bold-text { font-weight: 700; color: #111827; }
            
            .closing-section { margin-bottom: 50px; font-size: 14px; }
            
            .signature-grid { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-end; 
                margin-top: 60px;
                position: relative;
            }
            
            .sig-block { min-width: 200px; }
            .sig-title { font-weight: 800; font-size: 14px; color: var(--primary-color); margin-bottom: 20px; }
            .sig-img { height: 45px; margin-bottom: 5px; display: block; filter: contrast(150%); }
            .hr-info { font-size: 12px; color: var(--text-muted); font-weight: 600; }
            
            .official-stamp { 
                position: absolute; 
                left: 180px; 
                bottom: -10px; 
                opacity: 0.5; 
                mix-blend-mode: multiply;
                z-index: 10;
            }
            .official-stamp img { width: 90px; }
            
            .acceptance-section { 
                margin-top: 80px; 
                display: grid; 
                grid-template-columns: repeat(3, 1fr); 
                gap: 30px;
            }
            .accept-box { border-top: 2px solid var(--border-color); padding-top: 10px; text-align: center; }
            .accept-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
            
            .watermark { 
                position: absolute; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%, -50%) rotate(-35deg); 
                font-size: 120px; 
                font-weight: 900; 
                color: var(--primary-color); 
                opacity: 0.03; 
                pointer-events: none; 
                z-index: 0; 
                white-space: nowrap;
            }
            
            @media print {
                body { background: white; padding: 0; }
                .container { box-shadow: none; border-radius: 0; width: 100%; max-width: none; }
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='watermark'>${formData.company || 'Student Era'}</div>
            
            <header class='header'>
                <div class='logo-section'>
                    <img src='/logo512.png' alt='Logo' class='logo' onerror="this.style.display='none'" />
                </div>
                <div class='company-info'>
                    <div class='company-name'>${formData.company || 'Student Era'}</div>
                    <div class='address-block'>
                        Patna, Bihar India, BR 800002<br />
                        contact@studentera.online | www.studentera.online
                    </div>
                </div>
            </header>
            
            <div class='meta-info'>
                <div class='ref-no'>REF: SE/INTERNSHIP/OFFER/${userDoc.internId}</div>
                <div class='date'>Date: ${formattedIssueDate}</div>
            </div>
            
            <div class='subject-line'>
                <h1>LETTER OF OFFER</h1>
            </div>
            
            <div class='greeting'>Dear <span class='candidate-name'>${candidateName || 'Candidate Name'}</span>,</div>
            
            <div class='id-badge'>Intern ID: ${internId && internId.trim() !== '' ? internId : 'NOT ASSIGNED'}</div>
            
            <div class='announcement'>Congratulations! We are delighted to welcome you.</div>
            
            <div class='confidential-tag'>STRICTLY PRIVATE & CONFIDENTIAL</div>
            
            <div class='letter-content'>
                Following your recent application and successful interview for the internship position, we are pleased to offer you an internship with <span class='bold-text'>${formData.company || 'Student Era'}</span>. We were impressed with your credentials and believe you will be a valuable addition to our team.
            </div>
            
            ${stipend && stipend > 0 ? `
            <div class='stipend-highlight'>
                <span class='bold-text'>Stipend:</span>
                <span class='stipend-amount'>₹${stipend} / month</span>
            </div>
            ` : ''}
            
            <ol class='terms-list letter-content'>
                <li><span class='bold-text'>Position:</span> You will be designated as <span class='bold-text'>${title || 'Intern'}</span>.</li>
                <li><span class='bold-text'>Commencement:</span> Your internship will officially begin on <span class='bold-text'>${formattedStartDate}</span>.</li>
                <li><span class='bold-text'>Mode of Work:</span> The internship will be conducted in <span class='bold-text'>Work From Home (WFH)</span> mode, with occasional requirements for office coordination if necessary.</li>
                <li><span class='bold-text'>Technology Partner:</span> <span class='bold-text'>${techPartner || 'Student Era'}</span> shall be the official Technology Partner for this program.</li>
                <li><span class='bold-text'>Confidentiality:</span> You must maintain absolute confidentiality regarding company projects, intellectual property, and internal operations. Disclosure to any third party is strictly prohibited.</li>
                <li><span class='bold-text'>Responsibilities:</span> In addition to your core domain, you may be assigned cross-functional tasks to enhance your professional growth.</li>
                <li><span class='bold-text'>Withdrawal:</span> The company reserves the right to terminate or withdraw this offer at its discretion based on performance or organizational requirements.</li>
            </ol>
            
            <div class='closing-section letter-content'>
                Please signify your acceptance of this offer by signing and returning a copy of this letter. We look forward to a productive and mutually rewarding association.
            </div>
            
            <div class='signature-grid'>
                <div class='sig-block'>
                    <div class='sig-title'>For ${formData.company || 'Student Era'}</div>
                    <img src='' alt='' class='sig-img' onerror="this.style.display='none'" />
                    <div class='hr-info'>${hrName || 'HR Name'}<br>Human Resources Department</div>
                </div>
                
                <div class='official-stamp'>
                    <img src='/stamp.png' alt='Stamp' onerror="this.style.display='none'" />
                </div>
            </div>
            
            <div class='acceptance-section'>
                <div class='accept-box'>
                    <div class='accept-label'>Intern's Signature</div>
                </div>
                <div class='accept-box'>
                    <div class='accept-label'>Date of Acceptance</div>
                </div>
                <div class='accept-box'>
                    <div class='accept-label'>Institution / College</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">{editingId ? 'Edit Offer Letter' : 'Generate a New Offer Letter'}</h1>
            {offerLetterExists && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-semibold">⚠️ An offer letter already exists for this student and job title. Only one offer letter per job title is allowed per student.</p>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* Form Section */}
                <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Student ID (internId)</label>
                            {loadingUsers ? (
                                <div className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500">
                                    Loading users...
                                </div>
                            ) : (
                                <>
                                    <div className="relative" ref={searchInputRef}>
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={selectedUserDisplay || searchTerm}
                                            onChange={handleSearchChange}
                                            onFocus={() => {
                                                if (!selectedUserDisplay) {
                                                    setShowUserDropdown(true);
                                                }
                                            }}
                                            placeholder={selectedUserDisplay || "Search by Student ID, Name, or Email..."}
                                            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {selectedUserDisplay && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, user: '', candidateName: '', internId: '' }));
                                                    setSelectedUserDisplay('');
                                                    setSearchTerm('');
                                                    setShowUserDropdown(false);
                                                }}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {showUserDropdown && searchTerm && filteredUsers.length > 0 && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                                        >
                                            {filteredUsers.map(u => (
                                                <div
                                                    key={u._id}
                                                    onClick={() => handleUserSelect(u)}
                                                    className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                                >
                                                    <div className="font-semibold text-indigo-600">{u.internId}</div>
                                                    <div className="text-sm text-gray-700">{u.name}</div>
                                                    {u.email && (
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {showUserDropdown && searchTerm && filteredUsers.length === 0 && (
                                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
                                            No students found
                                        </div>
                                    )}

                                    <p className="mt-1 text-xs text-gray-500">
                                        {selectedUserDisplay ? 'Student selected. Click X to clear.' : 'Type to search for a student by ID, name, or email'}
                                    </p>
                                    <input type="hidden" name="user" value={user} required />
                                </>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
                            <input type="text" name="candidateName" value={candidateName} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Intern ID</label>
                            <input type="text" name="internId" value={internId} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" readOnly />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title (Internship Title)</label>
                            {loadingInternships ? (
                                <div className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500">
                                    Loading internships...
                                </div>
                            ) : (
                                <>
                                    <div className="relative" ref={jobTitleSearchInputRef}>
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={selectedJobTitleDisplay || jobTitleSearchTerm}
                                            onChange={handleJobTitleSearchChange}
                                            onFocus={() => {
                                                if (!selectedJobTitleDisplay) {
                                                    setShowJobTitleDropdown(true);
                                                }
                                            }}
                                            placeholder={selectedJobTitleDisplay || "Search by Internship Title..."}
                                            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {selectedJobTitleDisplay && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, title: '', stipend: '' }));
                                                    setSelectedJobTitleDisplay('');
                                                    setJobTitleSearchTerm('');
                                                    setShowJobTitleDropdown(false);
                                                    setSelectedHR('');
                                                    setFormData(prev => ({ ...prev, hrName: '' }));
                                                }}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {showJobTitleDropdown && jobTitleSearchTerm && filteredJobTitles.length > 0 && (
                                        <div
                                            ref={jobTitleDropdownRef}
                                            className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                                        >
                                            {filteredJobTitles.map(internship => (
                                                <div
                                                    key={internship._id}
                                                    onClick={() => handleJobTitleSelect(internship)}
                                                    className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                                >
                                                    <div className="font-semibold text-indigo-600">{internship.title}</div>
                                                    {internship.company && (
                                                        <div className="text-sm text-gray-700">{internship.company}</div>
                                                    )}
                                                    {internship.stipend > 0 && (
                                                        <div className="text-xs text-green-600 font-semibold">Stipend: ₹{internship.stipend}/{internship.stipendType || 'month'}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {showJobTitleDropdown && jobTitleSearchTerm && filteredJobTitles.length === 0 && (
                                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
                                            No internships found
                                        </div>
                                    )}

                                    <p className="mt-1 text-xs text-gray-500">
                                        {selectedJobTitleDisplay ? 'Job title selected. Stipend auto-filled. Click X to clear.' : 'Type to search for an internship title'}
                                    </p>
                                    <input type="hidden" name="title" value={title} required />
                                </>
                            )}
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
                            <label className="block text-sm font-medium text-gray-700">Stipend (per month) - ₹</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                                <input
                                    type="number"
                                    name="stipend"
                                    value={stipend}
                                    onChange={onChange}
                                    required
                                    className="mt-1 block w-full pl-8 pr-3 py-2 border rounded-md"
                                    placeholder="Auto-filled when job title is selected"
                                />
                            </div>
                            {stipend && (
                                <p className="mt-1 text-xs text-green-600">Stipend: ₹{stipend} /month (auto-filled from selected internship)</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">HR Name</label>
                            {selectedHR ? (
                                <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded-md">
                                    <span className="text-green-800 font-semibold">{selectedHR}</span>
                                    <span className="text-xs text-green-600 ml-2">(Auto-selected based on internship)</span>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    name="hrName"
                                    value={hrName}
                                    onChange={onChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                                    placeholder="HR Manager Name"
                                />
                            )}
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={offerLetterExists && !editingId}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:shadow-none"
                            >
                                {editingId ? 'Update Professional Offer Letter' : 'Generate Professional Offer Letter'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview / List Section */}
                <div className="lg:col-span-2 space-y-10">
                    {showPreview ? (
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-1 border border-gray-100 overflow-hidden sticky top-8">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Live Document Preview</h2>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-100 flex justify-center">
                                <div className="shadow-2xl origin-top scale-[0.6] md:scale-[0.8] lg:scale-[0.85] xl:scale-100 transition-transform">
                                    <iframe
                                        title="Offer Letter Preview"
                                        srcDoc={offerLetterHTML}
                                        className="w-[850px] h-[1100px] border-none bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Recently Generated</h2>
                                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {allLetters.length} Letters
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                            <th className="px-8 py-4">Candidate</th>
                                            <th className="px-8 py-4">Domain</th>
                                            <th className="px-8 py-4">Issued</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {allLetters.map(letter => (
                                            <tr key={letter._id} className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-gray-900">{letter.candidateName || '-'}</div>
                                                    <div className="text-xs text-gray-500">ID: {letter.user?.internId || 'N/A'}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600">
                                                        {letter.title}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-sm text-gray-500">
                                                    {new Date(letter.issueDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-5">
                                                    {letter.fileUrl ? (
                                                        <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                            Generated
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Pending</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {letter.fileUrl && (
                                                            <a
                                                                href={letter.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                                title="View PDF"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => handleSendEmail(letter._id)}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                            title="Send Email"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(letter._id)}
                                                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteOfferLetter(letter._id)}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {allLetters.length === 0 && (
                                    <div className="p-20 text-center text-gray-400">
                                        <div className="mb-4">
                                            <svg className="w-16 h-16 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </div>
                                        <p className="font-semibold">No offer letters generated yet.</p>
                                        <p className="text-sm">Letters you create will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateOfferLetter;