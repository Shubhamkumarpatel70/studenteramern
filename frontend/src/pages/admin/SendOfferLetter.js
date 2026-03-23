import React, { useState, useEffect } from "react";
import api from "../../config/api";

const SendOfferLetter = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [offerLetters, setOfferLetters] = useState([]);
  const [selectedOfferLetter, setSelectedOfferLetter] = useState("");
  // Fetch all offer letters for dropdown
  useEffect(() => {
    const fetchOfferLetters = async () => {
      try {
        const res = await api.get("/offer-letters");
        if (res.data.success) {
          setOfferLetters(res.data.data);
        }
      } catch (err) {
        // ignore error for dropdown
      }
    };
    fetchOfferLetters();
  }, []);
  // Auto-fill form when offer letter is selected
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

  // Fetch student/intern details by ID
  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setPdfUrl("");
    try {
      const res = await api.get(`/users/admin/user-details/${id}`);
      if (res.data.success) {
        setName(res.data.data.name);
        setDomain(res.data.data.domain);
        setEmail(res.data.data.email);
        // Auto-select offer letter if exists for this internId
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
      setLoading(false);
    }
  };

  // Generate and send offer letter
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
        setSuccess("Offer letter sent successfully!");
        setPdfUrl(res.data.data.pdfUrl);
      } else {
        setError("Failed to send offer letter");
      }
    } catch (err) {
      setError("Error sending offer letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-[#0A2463]">
        Send Offer Letter
      </h2>
      <form onSubmit={handleSend} className="space-y-4">
        {/* PDF selection status */}
        <div className="mt-2">
          {selectedOfferLetter ? (
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
              Offer Letter Selected
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
              No Offer Letter Selected
            </span>
          )}
        </div>
        {/* Offer letter sent date */}
        {selectedOfferLetter &&
          (() => {
            const letter = offerLetters.find(
              (l) => l._id === selectedOfferLetter,
            );
            if (!letter) return null;
            let date = letter.issueDate || letter.createdAt;
            let formatted = date ? new Date(date).toLocaleString() : "-";
            return (
              <div className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Offer Letter Sent Date:</span>{" "}
                {formatted}
              </div>
            );
          })()}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Existing Offer Letter
          </label>
          <select
            className="border rounded-lg px-3 py-2 w-full bg-gray-50"
            value={selectedOfferLetter}
            onChange={(e) => setSelectedOfferLetter(e.target.value)}
          >
            <option value="">-- Select Offer Letter --</option>
            {offerLetters.map((letter) => (
              <option key={letter._id} value={letter._id}>
                {letter.user?.name || letter.candidateName || "No Name"} |{" "}
                {letter.title} | {letter.user?.internId || letter.user?._id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Student/Intern ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
            <button
              type="button"
              onClick={fetchDetails}
              className="bg-[#0A2463] text-white px-4 py-2 rounded-lg hover:bg-[#1C1C1E]"
            >
              Fetch
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            readOnly
            className="border rounded-lg px-3 py-2 w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Domain</label>
          <input
            type="text"
            value={domain}
            readOnly
            className="border rounded-lg px-3 py-2 w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="border rounded-lg px-3 py-2 w-full bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#28A745] text-white py-2 rounded-lg font-semibold hover:bg-[#218838]"
          disabled={loading || !name || !domain || !email}
        >
          {loading ? "Processing..." : "Generate & Send Offer Letter"}
        </button>
        {success && (
          <p className="text-green-600 text-center mt-2">
            {success}{" "}
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-2"
              >
                View PDF
              </a>
            )}
          </p>
        )}
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default SendOfferLetter;
