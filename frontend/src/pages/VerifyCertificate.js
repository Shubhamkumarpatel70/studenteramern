import React, { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import { CheckCircle2, XCircle, Mail, Shield, Search } from "lucide-react";
import api from "../config/api";

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
      setError("Details not match. Please try again.");
    }
    setLoading(false);
    setTimeout(() => {
      setShowModal(true);
      setWaiting(false);
    }, 10000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 font-[Inter,sans-serif] bg-white overflow-x-hidden">
      {/* Card with glassmorphism effect */}
      <div className="backdrop-blur-lg bg-white/80 p-8 rounded-3xl shadow-2xl max-w-xl w-full mt-16 mb-12 border border-[#0A2463]/20 relative">
        {/* Logo/Brand placeholder */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#0A2463] flex items-center justify-center shadow-lg mb-3">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-2 text-[#0A2463] tracking-tight drop-shadow-sm">
            Certificate Verification
          </h1>
          <p className="text-[#212529] font-medium text-base">
            Enter your Certificate ID to verify its authenticity.
            <br />
            For help,{" "}
            <a
              href="/contact"
              className="text-[#28A745] underline hover:text-[#218838]"
            >
              contact us
            </a>
            .
          </p>
        </div>
        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A2463] w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#0A2463]/40 focus:outline-none focus:ring-2 focus:ring-[#28A745] text-lg bg-white/90 font-semibold shadow-sm transition"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#0A2463] text-white rounded-xl shadow-lg font-bold hover:bg-[#1C1C1E] transition text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || waiting}
          >
            <Shield className="w-5 h-5" />
            {loading || waiting ? "Verifying..." : "Verify Certificate"}
          </button>
        </form>
        {waiting && (
          <div className="mt-8 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-14 h-14 border-4 border-[#0A2463] border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
            <div className="w-full max-w-xs mb-2">
              <div className="h-3 bg-[#E9ECEF] rounded-full overflow-hidden">
                <div
                  className="h-3 bg-[#28A745] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-center mt-1 text-[#0A2463] font-semibold">
                {progress}%
              </div>
            </div>
            <div className="text-lg font-semibold text-[#0A2463] text-center">
              Please wait, checking data...
              <br />
              {showAlmostComplete && <span>Almost complete...</span>}
            </div>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 animate-fade-in">
            <div className="bg-white/95 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative border border-[#0A2463]/20 animate-fade-in-up">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-[#6C757D] hover:text-[#212529] text-2xl font-bold transition"
              >
                &times;
              </button>
              {error ? (
                <>
                  <XCircle
                    className="mx-auto text-[#DC3545] mb-2 animate-pop"
                    size={48}
                  />
                  <div className="text-2xl font-bold text-[#DC3545] mb-2">
                    Verification Failed
                  </div>
                  <div className="text-lg text-[#212529] mb-4">{error}</div>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A2463] text-white rounded hover:bg-[#1C1C1E] transition"
                  >
                    <Mail size={18} /> Contact Support
                  </a>
                </>
              ) : (
                <>
                  <CheckCircle2
                    className="mx-auto text-[#28A745] mb-2 animate-pop"
                    size={48}
                  />
                  <div className="text-2xl font-bold text-[#28A745] mb-2">
                    Certificate is valid!
                  </div>
                  <div className="text-[#212529] mt-4 text-left space-y-2">
                    <div>
                      <span className="font-semibold">Name:</span> {result.name}
                    </div>
                    <div>
                      <span className="font-semibold">Internship:</span>{" "}
                      {result.internshipTitle}
                    </div>
                    <div>
                      <span className="font-semibold">Duration:</span>{" "}
                      {result.duration}
                    </div>
                    <div>
                      <span className="font-semibold">Completion Date:</span>{" "}
                      {result.completionDate
                        ? new Date(result.completionDate).toLocaleDateString()
                        : "-"}
                    </div>
                    <div>
                      <span className="font-semibold">Certificate ID:</span>{" "}
                      {result.certificateId}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
      {/* Animations for fade-in and pop */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        .animate-fade-in-up { animation: fadeInUp 0.7s; }
        .animate-pop { animation: popIn 0.4s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default VerifyCertificate;
