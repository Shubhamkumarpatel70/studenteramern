import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader, Mail, User } from "lucide-react";
import api from "../config/api";

const VerifyEmailToken = () => {
  const [status, setStatus] = useState("loading"); // loading, ready, verifying, success, error
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. Missing token.");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const res = await api.get(`/auth/verify-email-token/${token}`);
        setUserData(res.data.data);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Invalid or expired verification link."
        );
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleVerify = async () => {
    setStatus("verifying");
    try {
      const res = await api.post("/auth/verify-email-token", {
        token: userData.token,
      });
      setStatus("success");
      setMessage("Email verified successfully! You can now log in.");
      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-[Inter,sans-serif]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0A2463] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A2463] mb-2">
            Email Verification
          </h2>
          <p className="text-[#6C757D] text-sm">
            Please verify your email address to complete registration
          </p>
        </div>

        {status === "loading" && (
          <div className="text-center">
            <Loader className="w-12 h-12 text-[#0A2463] mx-auto mb-4 animate-spin" />
            <p className="text-[#212529]">Loading verification details...</p>
          </div>
        )}

        {status === "ready" && userData && (
          <div className="space-y-6">
            <div className="bg-[#f8f9fa] rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-[#0A2463]" />
                <div className="text-left">
                  <p className="text-xs text-[#6C757D] uppercase tracking-wide">
                    Name
                  </p>
                  <p className="text-[#212529] font-medium">{userData.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#0A2463]" />
                <div className="text-left">
                  <p className="text-xs text-[#6C757D] uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-[#212529] font-medium">{userData.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleVerify}
              className="w-full bg-[#0A2463] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02]"
            >
              Verify Email
            </button>
          </div>
        )}

        {status === "verifying" && (
          <div className="text-center">
            <Loader className="w-12 h-12 text-[#0A2463] mx-auto mb-4 animate-spin" />
            <p className="text-[#212529]">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#0A2463] mb-2">
              Email Verified!
            </h3>
            <p className="text-[#212529] mb-4">{message}</p>
            <p className="text-sm text-[#6C757D]">
              Redirecting to login page...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#0A2463] mb-2">
              Verification Failed
            </h3>
            <p className="text-[#212529] mb-6">{message}</p>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-[#0A2463] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:ring-offset-2 transition duration-200"
            >
              Register Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailToken;
