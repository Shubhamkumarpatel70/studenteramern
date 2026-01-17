import React, { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import setAuthToken from "../../utils/setAuthToken";
import { Trash2, Eye, Edit2, X, Search } from "lucide-react";

const GenerateCertificate = () => {
  const [formData, setFormData] = useState({
    user: "",
    candidateName: "",
    internshipTitle: "",
    duration: "",
    completionDate: "",
    certificateId: "",
    signatureName: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUserDisplay, setSelectedUserDisplay] = useState("");
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [internships, setInternships] = useState([]);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [internshipSearchTerm, setInternshipSearchTerm] = useState("");
  const [showInternshipDropdown, setShowInternshipDropdown] = useState(false);
  const [selectedInternshipDisplay, setSelectedInternshipDisplay] =
    useState("");
  const internshipSearchInputRef = useRef(null);
  const internshipDropdownRef = useRef(null);
  const [hrs, setHrs] = useState([]);
  const [selectedHR, setSelectedHR] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    user,
    candidateName,
    internshipTitle,
    duration,
    completionDate,
    certificateId,
    signatureName,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const checkExistingCertificate = async () => {
    if (!user || !internshipTitle) return false;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/certificates", config);
      const existing = res.data.data.find((cert) => {
        const certUserId =
          cert.user?._id ||
          cert.user ||
          (typeof cert.user === "string" ? cert.user : null);
        const formUserId = user;
        return (
          certUserId &&
          formUserId &&
          certUserId.toString() === formUserId.toString() &&
          cert.internshipTitle === internshipTitle &&
          cert._id !== editingId
        );
      });
      return !!existing;
    } catch (err) {
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate that a user is selected
    if (!user) {
      alert("Please select a student from the search results.");
      return;
    }

    if (localStorage.token) setAuthToken(localStorage.token);

    setIsGenerating(true);
    try {
      // Auto-generate certificateId if not provided
      let certId = certificateId;
      if (!certId) {
        certId = `${internshipTitle.replace(/\s+/g, "-")}-${user}`;
      }

      const payload = {
        user,
        candidateName,
        internshipTitle,
        duration,
        completionDate,
        certificateId: certId,
        signatureName,
      };

      if (editingId) {
        // Update existing certificate
        const res = await api.put(`/certificates/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSuccessMessage(
          `Certificate updated successfully! Certificate ID: ${res.data.data.certificateId}`
        );
        setShowSuccessModal(true);
        setEditingId(null);
      } else {
        // Create new certificate
        const res = await api.post("/certificates", payload);
        setSuccessMessage(
          `Certificate generated successfully! Certificate ID: ${res.data.data.certificateId}`
        );
        setShowSuccessModal(true);
      }

      setFormData({
        user: "",
        candidateName: "",
        internshipTitle: "",
        duration: "",
        completionDate: "",
        certificateId: "",
        signatureName: "",
      });
      setSelectedUserDisplay("");
      setSelectedInternshipDisplay("");
      setSelectedHR("");
      fetchCertificates();
    } catch (err) {
      console.error(
        "Failed to generate/update certificate",
        err.response?.data
      );
      alert(
        `Error: ${
          err.response?.data?.message || "Failed to process certificate"
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async (certId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get(`/certificates/${certId}`, config);
      const cert = res.data.data;

      // Get internId from populated user data or find in users list
      let userInternId = "";
      if (cert.user?.internId) {
        // User is populated and has internId
        userInternId = cert.user.internId;
      } else if (cert.user?._id || cert.user) {
        // User ID exists, find in users list
        const userId = cert.user?._id || cert.user;
        const userObj = users.find((u) => {
          const uId = u._id?.toString();
          const certUId = userId?.toString();
          return uId === certUId;
        });
        if (userObj && userObj.internId) {
          userInternId = userObj.internId;
        }
      }

      // Find the user object to set display
      const userObj =
        users.find((u) => u.internId === userInternId) ||
        (cert.user?.internId
          ? {
              internId: cert.user.internId,
              name: cert.user.name,
              email: cert.user.email,
            }
          : null);

      // Find internship to set display
      const internshipObj = internships.find(
        (i) => i.title === cert.internshipTitle
      );

      setFormData({
        user: userInternId,
        candidateName: cert.candidateName || "",
        internshipTitle: cert.internshipTitle || "",
        duration: cert.duration || "",
        completionDate: cert.completionDate
          ? new Date(cert.completionDate).toISOString().split("T")[0]
          : "",
        certificateId: cert.certificateId || "",
        signatureName: cert.signatureName || "",
      });

      if (userObj) {
        setSelectedUserDisplay(
          `${userObj.internId} - ${userObj.name}${
            userObj.email ? ` (${userObj.email})` : ""
          }`
        );
      }

      if (internshipObj) {
        setSelectedInternshipDisplay(internshipObj.title);
        // Find matching HR
        const matchingHR = hrs.find(
          (hr) =>
            internshipObj.title
              .toLowerCase()
              .includes(hr.internshipCategory.toLowerCase()) ||
            hr.internshipCategory
              .toLowerCase()
              .includes(internshipObj.title.toLowerCase())
        );
        if (matchingHR && matchingHR.name === cert.signatureName) {
          setSelectedHR(matchingHR.name);
        }
      }
      setEditingId(certId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Failed to load certificate for editing");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      user: "",
      candidateName: "",
      internshipTitle: "",
      duration: "",
      completionDate: "",
      certificateId: "",
      signatureName: "",
    });
    setSelectedUserDisplay("");
    setSearchTerm("");
    setShowUserDropdown(false);
  };

  useEffect(() => {
    fetchCertificates();
    fetchUsers();
    fetchInternships();
    fetchHRs();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/users", config);
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchInternships = async () => {
    setLoadingInternships(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/internships", config);
      setInternships(res.data.data);
    } catch (err) {
      console.error("Failed to fetch internships", err);
    } finally {
      setLoadingInternships(false);
    }
  };

  const fetchHRs = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/hr", config);
      setHrs(res.data.data);
    } catch (err) {
      console.error("Failed to fetch HRs", err);
    }
  };

  const handleUserSelect = (selectedUser) => {
    if (selectedUser && selectedUser.internId) {
      setFormData((prev) => ({
        ...prev,
        user: selectedUser.internId,
        candidateName: selectedUser.name || "",
      }));
      setSelectedUserDisplay(
        `${selectedUser.internId} - ${selectedUser.name}${
          selectedUser.email ? ` (${selectedUser.email})` : ""
        }`
      );
      setSearchTerm("");
      setShowUserDropdown(false);
    }
  };

  const filteredUsers = users.filter((u) => {
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

    // If clearing search, also clear selected user
    if (!value) {
      setFormData((prev) => ({ ...prev, user: "", candidateName: "" }));
      setSelectedUserDisplay("");
    }
  };

  const handleInternshipSelect = (selectedInternship) => {
    if (selectedInternship) {
      setFormData((prev) => ({
        ...prev,
        internshipTitle: selectedInternship.title,
        duration: selectedInternship.duration || prev.duration,
      }));
      setSelectedInternshipDisplay(selectedInternship.title);
      setInternshipSearchTerm("");
      setShowInternshipDropdown(false);

      // Auto-select HR based on internship title
      const matchingHR = hrs.find((hr) => {
        if (!hr.isActive) return false;
        const titleLower = selectedInternship.title.toLowerCase();
        const categoryLower = hr.internshipCategory.toLowerCase();
        // Check if title contains category or category contains title keywords
        return (
          titleLower.includes(categoryLower) ||
          categoryLower.includes(titleLower) ||
          titleLower.split(" ").some((word) => categoryLower.includes(word)) ||
          categoryLower.split(" ").some((word) => titleLower.includes(word))
        );
      });
      if (matchingHR) {
        setFormData((prev) => ({ ...prev, signatureName: matchingHR.name }));
        setSelectedHR(matchingHR.name);
      }
    }
  };

  const filteredInternships = internships.filter((internship) => {
    if (!internship.title) return false;
    const searchLower = internshipSearchTerm.toLowerCase();
    return internship.title.toLowerCase().includes(searchLower);
  });

  const handleInternshipSearchChange = (e) => {
    const value = e.target.value;
    setInternshipSearchTerm(value);
    setShowInternshipDropdown(true);

    if (!value) {
      setFormData((prev) => ({ ...prev, internshipTitle: "", duration: "" }));
      setSelectedInternshipDisplay("");
      setSelectedHR("");
      setFormData((prev) => ({ ...prev, signatureName: "" }));
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
        internshipDropdownRef.current &&
        !internshipDropdownRef.current.contains(event.target) &&
        internshipSearchInputRef.current &&
        !internshipSearchInputRef.current.contains(event.target)
      ) {
        setShowInternshipDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/certificates", config);
      setCertificates(res.data.data);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/certificates/${id}`, config);
      setCertificates(certificates.filter((cert) => cert._id !== id));
    } catch (err) {
      alert("Failed to delete certificate.");
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
      <div class='name'>${candidateName || "Shubham Kumar"}</div>
      <div class='desc'>has successfully completed the internship in</div>
      <div class='internship'>${
        internshipTitle || "MERN Stack Development"
      }</div>
      <div class='info'>Duration: ${duration || "4 Weeks"}</div>
      <div class='info'>Completion Date: ${completionDate || "2024-06-01"}</div>
      <div class='cert-id'>Certificate ID: ${
        certificateId || "SE-CERT-123456"
      }</div>
      <div class='signature'>
        _________________________<br>
        ${signatureName || "Authorized Signature"}
      </div>
      <div class='for'>
        For Student Era
        <img src='/stamp.png' alt='Stamp' style='display:inline-block;vertical-align:middle;width:80px;margin-left:16px;' />
      </div>
    </div>
    </body></html>
    `;

  const [certificateExists, setCertificateExists] = useState(false);

  useEffect(() => {
    const checkCert = async () => {
      if (user && internshipTitle && !editingId) {
        const exists = await checkExistingCertificate();
        setCertificateExists(exists);
      } else {
        setCertificateExists(false);
      }
    };
    checkCert();
  }, [user, internshipTitle, editingId]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        {editingId ? "Edit Certificate" : "Generate a New Certificate"}
      </h1>
      {editingId && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-semibold">
            You are editing an existing certificate. Changes will update the
            certificate and notify the user.
          </p>
        </div>
      )}
      {certificateExists && !editingId && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-semibold">
            ⚠️ A certificate already exists for this student and internship
            title. Please edit the existing certificate instead.
          </p>
        </div>
      )}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student ID (internId)
            </label>
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
                    placeholder={
                      selectedUserDisplay ||
                      "Search by Student ID, Name, or Email..."
                    }
                    className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {/* Hidden input for form validation */}
                  <input type="hidden" name="user" value={user} required />
                  {selectedUserDisplay && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          user: "",
                          candidateName: "",
                        }));
                        setSelectedUserDisplay("");
                        setSearchTerm("");
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
                    {filteredUsers.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => handleUserSelect(u)}
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-semibold text-indigo-600">
                          {u.internId}
                        </div>
                        <div className="text-sm text-gray-700">{u.name}</div>
                        {u.email && (
                          <div className="text-xs text-gray-500">{u.email}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {showUserDropdown &&
                  searchTerm &&
                  filteredUsers.length === 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
                      No students found
                    </div>
                  )}

                <p className="mt-1 text-xs text-gray-500">
                  {selectedUserDisplay
                    ? "Student selected. Click X to clear."
                    : "Type to search for a student by ID, name, or email"}
                </p>
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Candidate Name
            </label>
            <input
              type="text"
              name="candidateName"
              value={candidateName}
              onChange={onChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internship Title
            </label>
            {loadingInternships ? (
              <div className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500">
                Loading internships...
              </div>
            ) : (
              <>
                <div className="relative" ref={internshipSearchInputRef}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={selectedInternshipDisplay || internshipSearchTerm}
                    onChange={handleInternshipSearchChange}
                    onFocus={() => {
                      if (!selectedInternshipDisplay) {
                        setShowInternshipDropdown(true);
                      }
                    }}
                    placeholder={
                      selectedInternshipDisplay ||
                      "Search by Internship Title..."
                    }
                    className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {selectedInternshipDisplay && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          internshipTitle: "",
                          duration: "",
                        }));
                        setSelectedInternshipDisplay("");
                        setInternshipSearchTerm("");
                        setShowInternshipDropdown(false);
                        setSelectedHR("");
                        setFormData((prev) => ({ ...prev, signatureName: "" }));
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {showInternshipDropdown &&
                  internshipSearchTerm &&
                  filteredInternships.length > 0 && (
                    <div
                      ref={internshipDropdownRef}
                      className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {filteredInternships.map((internship) => (
                        <div
                          key={internship._id}
                          onClick={() => handleInternshipSelect(internship)}
                          className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-semibold text-indigo-600">
                            {internship.title}
                          </div>
                          {internship.company && (
                            <div className="text-sm text-gray-700">
                              {internship.company}
                            </div>
                          )}
                          {internship.duration && (
                            <div className="text-xs text-gray-500">
                              Duration: {internship.duration}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {showInternshipDropdown &&
                  internshipSearchTerm &&
                  filteredInternships.length === 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
                      No internships found
                    </div>
                  )}

                <p className="mt-1 text-xs text-gray-500">
                  {selectedInternshipDisplay
                    ? "Internship selected. Click X to clear."
                    : "Type to search for an internship"}
                </p>
                <input
                  type="hidden"
                  name="internshipTitle"
                  value={internshipTitle}
                  required
                />
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={duration}
              onChange={onChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              placeholder="e.g. 4 Weeks"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Completion Date
            </label>
            <input
              type="date"
              name="completionDate"
              value={completionDate}
              onChange={onChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Certificate ID (optional)
            </label>
            <input
              type="text"
              name="certificateId"
              value={certificateId}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              placeholder="Auto-generated if left blank"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Authorized Signature Name (HR)
            </label>
            {selectedHR ? (
              <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded-md">
                <span className="text-green-800 font-semibold">
                  {selectedHR}
                </span>
                <span className="text-xs text-green-600 ml-2">
                  (Auto-selected based on internship)
                </span>
              </div>
            ) : (
              <input
                type="text"
                name="signatureName"
                value={signatureName}
                onChange={onChange}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                placeholder="Enter signature name (e.g. HR Name)"
              />
            )}
            {selectedHR && (
              <button
                type="button"
                onClick={() => {
                  setSelectedHR("");
                  setFormData((prev) => ({ ...prev, signatureName: "" }));
                }}
                className="mt-2 text-xs text-red-600 hover:text-red-800"
              >
                Clear auto-selected HR
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center gap-2"
              >
                <X className="h-4 w-4" /> Cancel Edit
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              {showPreview ? "Hide" : "Preview"}
            </button>
            <button
              type="submit"
              disabled={(certificateExists && !editingId) || isGenerating}
              className={`px-4 py-2 rounded-md text-white flex-1 ${
                certificateExists && !editingId
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isGenerating
                ? "Processing..."
                : editingId
                ? "Update Certificate"
                : "Generate Certificate"}
            </button>
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
              style={{ border: "none", background: "transparent" }}
            />
          </div>
        )}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          All Generated Certificates
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading certificates...
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No certificates generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Candidate
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Internship
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Completion
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Certificate ID
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((cert) => (
                  <tr
                    key={cert._id}
                    className={editingId === cert._id ? "bg-blue-50" : ""}
                  >
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      {cert.candidateName}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      {cert.internshipTitle}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      {cert.duration}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      {cert.completionDate
                        ? new Date(cert.completionDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-sm">
                      {cert.certificateId}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      <div className="flex gap-2 justify-center items-center">
                        <a
                          href={
                            cert.fileUrl ||
                            `/verify-certificate/${cert.certificateId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Certificate"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleEdit(cert._id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit Certificate"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cert._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Certificate"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Success!
              </h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateCertificate;
