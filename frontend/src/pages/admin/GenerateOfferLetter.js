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
            const res = await api.post('/offer-letters', formData);
            alert('Offer letter generated successfully!');
            setGeneratedLetter(res.data.data);
            setFormData({ user: '', candidateName: '', internId: '', title: '', company: 'Student Era', issueDate: '', startDate: '', techPartner: 'Student Era', stipend: '', hrName: '' });
            setSelectedUserDisplay('');
            setSelectedJobTitleDisplay('');
            setSelectedHR('');
            setSearchTerm('');
            setJobTitleSearchTerm('');
            setShowPreview(false);
            fetchAllLetters();
        } catch (err) {
            console.error('Failed to generate offer letter', err.response?.data);
            alert(`Error: ${err.response?.data?.message || 'Failed to generate offer letter'}`);
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
    const offerLetterHTML = `
    <!DOCTYPE html>
    <html><head><meta charset='utf-8'>
    <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; background: #f4f4f4; }
    .container { background: #fff; margin: 40px auto; padding: 56px 64px 48px 64px; border-radius: 16px; max-width: 950px; box-shadow: 0 4px 32px rgba(44,62,80,0.10); border: 2.5px solid #4f46e5; position: relative; min-height: 1100px; }
    .header { display: flex; justify-content: flex-start; align-items: flex-start; border-bottom: none; margin-bottom: 0; }
    .logo { height: 110px; margin: 0 24px 0 0; }
    .company-info { margin-top: 10px; }
    .company-name { font-size: 2.1rem; font-weight: bold; color: #4f46e5; letter-spacing: 2px; }
    .address-block { font-size: 1.05rem; color: #444; line-height: 1.6; }
    .line { height: 4px; background: #4f46e5; border: none; margin: 0 0 32px 0; }
    .ref-date-row { display: flex; justify-content: space-between; margin: 24px 0 12px 0; font-size: 1.13rem; }
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
        <img src='/logo.png' alt='Company Logo' class='logo' />
        <div class='company-info'>
          <div class='company-name'>${company || 'Student Era'}</div>
          <div class='address-block'>D-107, 91Springboard, Vyapar Marg, Sector-2, Noida, UP 201301<br />info@studentera.com | www.studentera.com</div>
        </div>
      </div>
      <div class='line'></div>
      <div class='ref-date-row'>
        <div>REF: SE/INTERNSHIP/OFFER</div>
        <div><span class='highlight'>Dated:</span> ${formatDate(issueDate)}</div>
      </div>
      <div class='subject-row'>
        <div class='subject'>LETTER OF OFFER</div>
      </div>
      <div class='content'>
        <p>Dear <span class='highlight'>${candidateName || 'Candidate Name'}</span>,<br />Intern ID: <span class='highlight'>${internId && internId.trim() !== '' ? internId : '__________'}</span></p>
        <p>Congratulations!!</p>
        <div class='confidential'>STRICTLY PRIVATE &amp; CONFIDENTIAL</div>
        <p>We are pleased to offer you a Summer Internship with <span class='highlight'>${company || 'Student Era'}</span>, based on your application and the interview &amp; discussions you had with us. Details of the terms &amp; conditions of offer are as under:</p>
        ${stipend && stipend > 0 ? `<p style='font-weight: bold; color: #1976d2; font-size: 1.15rem; margin: 20px 0;'>Stipend: ₹${stipend} /month</p>` : ''}
        <ol class='terms'>
          <li>You must always maintain utmost secrecy and confidentiality of your offer, its terms, and of any information about the company, and shall not disclose any such details to outsiders.</li>
          <li>You will be designated as <span class='highlight'>${title || 'MERN Developer'}</span>.</li>
          <li>Your date of commencement of internship will be from <span class='highlight'>${startDate && startDate.trim() !== '' ? formatDate(startDate) : '__________'}</span> in WFH mode.</li>
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
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Generate a New Offer Letter</h1>
            {offerLetterExists && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-semibold">⚠️ An offer letter already exists for this student and job title. Only one offer letter per job title is allowed per student.</p>
                </div>
            )}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <form onSubmit={onSubmit} className="space-y-4">
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
                                placeholder="Enter HR Name" 
                            />
                        )}
                        {selectedHR && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedHR('');
                                    setFormData(prev => ({ ...prev, hrName: '' }));
                                }}
                                className="mt-2 text-xs text-red-600 hover:text-red-800"
                            >
                                Clear auto-selected HR
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button 
                            type="button" 
                            onClick={() => setShowPreview(!showPreview)} 
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            {showPreview ? 'Hide' : 'Preview'}
                        </button>
                        <button 
                            type="submit" 
                            disabled={offerLetterExists}
                            className={`px-4 py-2 rounded-md text-white flex-1 ${
                                offerLetterExists 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            Generate Offer Letter
                        </button>
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
                <div className="mt-6 sm:mt-10">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">All Generated Offer Letters</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate Name</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PDF</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allLetters.map(letter => (
                                    <tr key={letter._id} className="hover:bg-gray-50">
                                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{letter.candidateName || '-'}</td>
                                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{letter.title}</td>
                                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{new Date(letter.issueDate).toLocaleDateString()}</td>
                                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                            {letter.fileUrl ? (
                                                <a href={letter.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-bold text-sm">View PDF</a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not Available</span>
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                            <button onClick={() => deleteOfferLetter(letter._id)} className="text-red-600 hover:text-red-800 font-bold text-sm">Delete</button>
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