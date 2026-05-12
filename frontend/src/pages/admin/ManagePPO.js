import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { FileText, Plus, Search, Trash, Download, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const ManagePPO = () => {
  const [ppos, setPpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    userId: "",
    jobTitle: "",
    department: "",
    ctc: "",
    joiningDate: "",
    workLocation: "Remote / Office",
    probationPeriod: "6 Months",
    hrName: "HR Team",
    referenceNo: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPPOs();
  }, []);

  const fetchPPOs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ppo");
      setPpos(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch PPOs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/ppo/issue", formData);
      toast.success("PPO Issued Successfully!");
      setIsModalOpen(false);
      setFormData({
        userId: "",
        jobTitle: "",
        department: "",
        ctc: "",
        joiningDate: "",
        workLocation: "Remote / Office",
        probationPeriod: "6 Months",
        hrName: "HR Team",
        referenceNo: ""
      });
      fetchPPOs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to issue PPO");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePPO = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PPO? This will remove it from the student's dashboard as well.")) return;
    
    try {
      await api.delete(`/ppo/${id}`);
      toast.success("PPO Deleted Successfully");
      fetchPPOs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete PPO");
    }
  };

  const filteredPPOs = ppos.filter(ppo => 
    ppo.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ppo.internId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ppo.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pre-Placement Offers (PPO)</h1>
          <p className="text-gray-500 mt-1">Issue and manage professional career offers for top interns.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Issue New PPO
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Issued</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{ppos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Accepted</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{ppos.filter(p => p.status === 'Accepted').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">{ppos.filter(p => p.status === 'Issued').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-indigo-500" />
            <p className="mt-4 text-gray-500">Loading PPOs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">CTC</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Issue Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPPOs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      No PPOs found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredPPOs.map((ppo) => (
                    <tr key={ppo._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{ppo.candidateName}</span>
                          <span className="text-xs text-gray-500 font-mono">{ppo.internId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">{ppo.jobTitle}</span>
                          <span className="text-xs text-gray-500">{ppo.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                        ₹{ppo.ctc}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ppo.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                          ppo.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                          ppo.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ppo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={ppo.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded"
                          >
                            <Download size={14} />
                            View
                          </a>
                          <button
                            onClick={() => handleDeletePPO(ppo._id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 bg-red-50 px-2 py-1 rounded"
                          >
                            <Trash size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue PPO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText size={24} />
                Issue Pre-Placement Offer
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">User ID / Student ID</label>
                  <input
                    type="text"
                    name="userId"
                    required
                    value={formData.userId}
                    onChange={handleInputChange}
                    placeholder="Enter Mongo ID or Intern ID"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">User must be registered in the system.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Engineer"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Engineering"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">CTC (Annual Salary)</label>
                  <input
                    type="text"
                    name="ctc"
                    required
                    value={formData.ctc}
                    onChange={handleInputChange}
                    placeholder="e.g. 12,00,000"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    required
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Work Location</label>
                  <input
                    type="text"
                    name="workLocation"
                    value={formData.workLocation}
                    onChange={handleInputChange}
                    placeholder="Remote / Office"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Probation Period</label>
                  <input
                    type="text"
                    name="probationPeriod"
                    value={formData.probationPeriod}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">HR Name (For Signature)</label>
                  <input
                    type="text"
                    name="hrName"
                    required
                    value={formData.hrName}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Reference No (Optional)</label>
                  <input
                    type="text"
                    name="referenceNo"
                    value={formData.referenceNo}
                    onChange={handleInputChange}
                    placeholder="Auto-generated if empty"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2.5"
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                  Issue PPO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePPO;
