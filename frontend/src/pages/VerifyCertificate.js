import React, { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import { CheckCircle2, XCircle, Mail, Shield, Search, ArrowRight } from "lucide-react";
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
      } else {
        setError(data.message || "Certificate not found.");
      }
    } catch (err) {
      setError("Details not match. Please try again.");
    }
    setLoading(false);

    // Simulate complex blockchain/server validation delay for visual effect
    setTimeout(() => {
      setShowModal(true);
      setWaiting(false);
    }, 10000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-200 w-full max-w-xl">

          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 mb-5">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Certificate Verification
            </h1>
            <p className="text-gray-500 font-medium">
              Validate the authenticity of any Student Era credential by entering the unique Certificate ID below.
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. SE-12345)"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white shadow-sm transition-all"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-6 py-4 bg-blue-600 text-white rounded-xl shadow-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={loading || waiting || !certificateId.trim()}
            >
              {loading || waiting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" /> Validate Credential
                </>
              )}
            </button>
          </form>

          {waiting && (
            <div className="mt-10 flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-full max-w-xs mb-3">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  <span>Cryptographic Check</span>
                  <span className="text-blue-600">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 text-center h-5">
                {showAlmostComplete ? "Finalizing validation..." : "Querying database records..."}
              </p>
            </div>
          )}
        </div>

        {/* Results Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative border border-gray-200 animate-[fadeInUp_0.4s_ease-out]">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <XCircle className="w-6 h-6" />
              </button>

              {error ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-gray-500 mb-8">{error}</p>
                  {/* <a
                    href="/contact"
                    className="w-full flex justify-center items-center gap-2 py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Contact Support
                  </a> */}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-green-50">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Official Credential
                  </h3>
                  <p className="text-gray-500 mb-8 text-sm">This certificate has been verified as authentic and valid.</p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3 mb-8">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 text-sm">Issued To</span>
                      <span className="font-bold text-gray-900 text-sm text-right">{result.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 text-sm">Program</span>
                      <span className="font-semibold text-gray-900 text-sm text-right ml-4 line-clamp-1">{result.internshipTitle}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 text-sm">Duration</span>
                      <span className="font-semibold text-gray-900 text-sm text-right">{result.duration}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 text-sm">Completed On</span>
                      <span className="font-semibold text-gray-900 text-sm text-right">
                        {result.completionDate ? new Date(result.completionDate).toLocaleDateString() : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-500 text-sm mt-0.5">Cert ID</span>
                      <span className="font-mono font-bold text-blue-600 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{result.certificateId}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn { 
            from { opacity: 0; } 
            to { opacity: 1; } 
        }
        @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(20px);} 
            to { opacity: 1; transform: translateY(0);} 
        }
      `}</style>
    </div>
  );
};

export default VerifyCertificate;
