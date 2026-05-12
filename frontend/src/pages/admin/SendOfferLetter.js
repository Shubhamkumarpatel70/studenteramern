import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { 
  User, 
  Mail, 
  Briefcase, 
  IdCard, 
  Send, 
  Search, 
  FileCheck,
  Loader2,
  ExternalLink,
  AlertCircle,
  ChevronRight
} from "lucide-react";

const SendOfferLetter = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [offerLetters, setOfferLetters] = useState([]);
  const [selectedOfferLetter, setSelectedOfferLetter] = useState("");

  useEffect(() => {
    const fetchOfferLetters = async () => {
      try {
        const res = await api.get("/offer-letters");
        if (res.data.success) {
          setOfferLetters(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch offer letters");
      }
    };
    fetchOfferLetters();
  }, []);

  useEffect(() => {
    if (!selectedOfferLetter) return;
    const letter = offerLetters.find((l) => l._id === selectedOfferLetter);
    if (letter) {
      setId(letter.user?.internId || letter.user?._id || "");
      setName(letter.user?.name || letter.candidateName || "");
      setDomain(letter.title || "");
      setEmail(letter.user?.email || "");
    }
  }, [selectedOfferLetter, offerLetters]);

  const fetchDetails = async () => {
    if (!id) return;
    setFetching(true);
    setError("");
    setSuccess("");
    setPdfUrl("");
    try {
      const res = await api.get(`/users/admin/user-details/${id}`);
      if (res.data.success) {
        setName(res.data.data.name);
        setDomain(res.data.data.domain);
        setEmail(res.data.data.email);
        const found = offerLetters.find(
          (l) => l.user?.internId === id || l.user?._id === id,
        );
        if (found) {
          setSelectedOfferLetter(found._id);
        } else {
          setSelectedOfferLetter("");
        }
      } else {
        setError("No user found for this ID");
        setSelectedOfferLetter("");
      }
    } catch (err) {
      setError("Error fetching user details");
      setSelectedOfferLetter("");
    } finally {
      setFetching(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setPdfUrl("");
    try {
      const res = await api.post("/offer-letters/admin/send-offer-letter", {
        id,
        name,
        domain,
        email,
      });
      if (res.data.success) {
        setSuccess("Offer letter has been successfully dispatched to the candidate's email.");
        setPdfUrl(res.data.data.pdfUrl);
      } else {
        setError("Failed to process the request. Please verify the details.");
      }
    } catch (err) {
      setError("An unexpected error occurred while sending the offer letter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-[Inter]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4 shadow-sm">
                <Send className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dispatch Offer Letter</h1>
            <p className="mt-2 text-gray-600">Prepare and send digital offer letters to candidates with one click.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <form onSubmit={handleSend} className="space-y-6">
              {/* Offer Letter Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Template Selection</label>
                <div className="relative group">
                  <FileCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
                  <select
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-gray-700 font-medium appearance-none"
                    value={selectedOfferLetter}
                    onChange={(e) => setSelectedOfferLetter(e.target.value)}
                  >
                    <option value="">-- Choose from existing letters --</option>
                    {offerLetters.map((letter) => (
                      <option key={letter._id} value={letter._id}>
                        {letter.candidateName || letter.user?.name} | {letter.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                  </div>
                </div>
                {selectedOfferLetter && (
                    <div className="flex items-center gap-2 mt-2 ml-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-green-600">Template identified and loaded.</span>
                    </div>
                )}
              </div>

              {/* ID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Candidate Identifier</label>
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
                    <input
                      type="text"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      placeholder="Enter Intern ID or User ID"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchDetails}
                    disabled={fetching || !id}
                    className="bg-indigo-600 text-white px-6 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
                  >
                    {fetching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    <span>Fetch</span>
                  </button>
                </div>
              </div>

              {/* Auto-filled details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                    <input
                      type="text"
                      value={name}
                      readOnly
                      placeholder="Candidate Name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-gray-400 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Target Domain</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                    <input
                      type="text"
                      value={domain}
                      readOnly
                      placeholder="Internship Domain"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-gray-400 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Destination Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    readOnly
                    placeholder="candidate@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-gray-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || !name || !domain || !email}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Send Professional Offer Letter</span>
                    </>
                  )}
                </button>
              </div>

              {success && (
                <div className="mt-6 p-5 bg-green-50 border border-green-100 rounded-2xl flex flex-col items-center gap-3 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <p className="text-green-800 font-bold text-sm leading-relaxed">{success}</p>
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm group"
                    >
                      Verify Generated PDF 
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-6 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendOfferLetter;

