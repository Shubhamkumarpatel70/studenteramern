import React, { useState } from "react";
import Footer from "../components/Footer";
import { CheckCircle2, XCircle, Mail } from 'lucide-react';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    setShowModal(false);
    setWaiting(true);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/certificates/verify/${certificateId}`
      );
      const data = await res.json();
      if (data.success && data.valid) {
        setResult(data.data);
        setError("");
      } else {
        setResult(null);
        setError(data.message || "Certificate not found.");
      }
    } catch (err) {
      setResult(null);
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
    setTimeout(() => {
      setShowModal(true);
      setWaiting(false);
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center px-2">
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-xl w-full mt-8 mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-indigo-700 tracking-tight">Certificate Verification</h1>
        <p className="text-center text-gray-600 mb-6">Enter your Certificate ID to verify its authenticity. For help, <a href='/contact' className='text-blue-600 underline'>contact us</a>.</p>
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            required
          />
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-lg shadow-lg font-semibold hover:scale-105 transition text-lg" disabled={loading || waiting}>
            {loading || waiting ? "Verifying..." : "Verify Certificate"}
          </button>
        </form>
        {waiting && (
          <div className="mt-6 text-lg font-semibold text-blue-700 animate-pulse text-center">
            Please wait, checking data...<br />Almost complete...
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center relative">
              <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              {error ? (
                <>
                  <XCircle className="mx-auto text-red-500 mb-2" size={48} />
                  <div className="text-2xl font-bold text-red-600 mb-2">Verification Failed</div>
                  <div className="text-lg text-gray-700 mb-4">{error}</div>
                  <a href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"><Mail size={18}/> Contact Support</a>
                </>
              ) : (
                <>
                  <CheckCircle2 className="mx-auto text-green-600 mb-2" size={48} />
                  <div className="text-2xl font-bold text-green-700 mb-2">Certificate is valid!</div>
                  <div className="text-gray-800 mt-4 text-left">
                    <div><span className="font-semibold">Name:</span> {result.name}</div>
                    <div><span className="font-semibold">Internship:</span> {result.internshipTitle}</div>
                    <div><span className="font-semibold">Duration:</span> {result.duration}</div>
                    <div><span className="font-semibold">Completion Date:</span> {result.completionDate ? new Date(result.completionDate).toLocaleDateString() : "-"}</div>
                    <div><span className="font-semibold">Certificate ID:</span> {result.certificateId}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VerifyCertificate; 