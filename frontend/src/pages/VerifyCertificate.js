import React, { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import { CheckCircle2, XCircle, Mail } from 'lucide-react';
import api from '../config/api';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAlmostComplete, setShowAlmostComplete] = useState(false);
  const progressRef = useRef();

  useEffect(() => {
    let interval;
    if (waiting) {
      setProgress(0);
      setShowAlmostComplete(false);
      let start = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        let percent = Math.min(100, Math.round((elapsed / 10000) * 100));
        setProgress(percent);
        if (elapsed >= 5000 && !showAlmostComplete) {
          setShowAlmostComplete(true);
        }
        if (percent >= 100) {
          clearInterval(interval);
        }
      }, 100);
    } else {
      setProgress(0);
      setShowAlmostComplete(false);
      if (interval) clearInterval(interval);
    }
    return () => interval && clearInterval(interval);
  }, [waiting]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    setShowModal(false);
    setWaiting(true);
    setLoading(true);
    try {
      const res = await api.get(`/certificates/verify/${certificateId}`);
      const data = res.data;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center px-2 font-sans">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-xl w-full mt-8 mb-8 border border-indigo-100">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-indigo-700 tracking-tight drop-shadow">Certificate Verification</h1>
        <p className="text-center text-gray-600 mb-6">Enter your Certificate ID to verify its authenticity. For help, <a href='/contact' className='text-blue-600 underline'>contact us</a>.</p>
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white/90"
            required
          />
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-lg shadow-lg font-semibold hover:scale-105 transition text-lg" disabled={loading || waiting}>
            {loading || waiting ? "Verifying..." : "Verify Certificate"}
          </button>
        </form>
        {waiting && (
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
            <div className="w-full max-w-xs mb-2">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="text-xs text-center mt-1 text-blue-700 font-semibold">{progress}%</div>
            </div>
            <div className="text-lg font-semibold text-blue-700 text-center">
              Please wait, checking data...<br />
              {showAlmostComplete && <span>Almost complete...</span>}
            </div>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative border border-indigo-100 animate-fade-in">
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