import React, { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import { CheckCircle2, XCircle, Mail, Shield, Search } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center px-2 font-[Inter,sans-serif]">
      <div className="bg-[#F8F9FA] p-8 rounded-2xl shadow-2xl max-w-xl w-full mt-8 mb-8 border border-[#0A2463]">
        <div className="text-center mb-6">
          <Shield className="w-16 h-16 text-[#0A2463] mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold mb-2 text-[#0A2463]">Certificate Verification</h1>
          <p className="text-[#212529] font-semibold">Enter your Certificate ID to verify its authenticity. For help, <a href='/contact' className='text-[#28A745] underline hover:text-[#218838]'>contact us</a>.</p>
        </div>
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2463] w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#28A745] text-lg bg-[#FFFFFF] font-semibold"
              required
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-[#0A2463] text-[#FFFFFF] rounded-lg shadow-lg font-bold hover:bg-[#1C1C1E] transition text-lg flex items-center justify-center gap-2" disabled={loading || waiting}>
            <Shield className="w-5 h-5" />
            {loading || waiting ? "Verifying..." : "Verify Certificate"}
          </button>
        </form>
        {waiting && (
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#0A2463] border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
            <div className="w-full max-w-xs mb-2">
              <div className="h-3 bg-[#E9ECEF] rounded-full overflow-hidden">
                <div className="h-3 bg-[#28A745] rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="text-xs text-center mt-1 text-[#0A2463] font-semibold">{progress}%</div>
            </div>
            <div className="text-lg font-semibold text-[#0A2463] text-center">
              Please wait, checking data...<br />
              {showAlmostComplete && <span>Almost complete...</span>}
            </div>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative border border-[#0A2463] animate-fade-in">
              <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-[#6C757D] hover:text-[#212529] text-2xl">&times;</button>
              {error ? (
                <>
                  <XCircle className="mx-auto text-[#DC3545] mb-2" size={48} />
                  <div className="text-2xl font-bold text-[#DC3545] mb-2">Verification Failed</div>
                  <div className="text-lg text-[#212529] mb-4">{error}</div>
                  <a href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A2463] text-[#FFFFFF] rounded hover:bg-[#1C1C1E] transition">
                    <Mail size={18}/> Contact Support
                  </a>
                </>
              ) : (
                <>
                  <CheckCircle2 className="mx-auto text-[#28A745] mb-2" size={48} />
                  <div className="text-2xl font-bold text-[#28A745] mb-2">Certificate is valid!</div>
                  <div className="text-[#212529] mt-4 text-left">
                    <div className="mb-2"><span className="font-semibold">Name:</span> {result.name}</div>
                    <div className="mb-2"><span className="font-semibold">Internship:</span> {result.internshipTitle}</div>
                    <div className="mb-2"><span className="font-semibold">Duration:</span> {result.duration}</div>
                    <div className="mb-2"><span className="font-semibold">Completion Date:</span> {result.completionDate ? new Date(result.completionDate).toLocaleDateString() : "-"}</div>
                    <div className="mb-2"><span className="font-semibold">Certificate ID:</span> {result.certificateId}</div>
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