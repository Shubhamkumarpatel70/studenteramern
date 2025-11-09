import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import api from "../config/api";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Missing token or email.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.post("/auth/verify-email-token", {
          email,
          token,
        });
        setStatus("success");
        setMessage("Email verified successfully! You can now log in.");
        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may be expired or invalid."
        );
      }
    };

    verifyEmail();
  }, [token, email, navigate]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 font-[Inter,sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          {status === "verifying" && (
            <>
              <Loader className="w-16 h-16 text-[#0A2463] mx-auto mb-4 animate-spin" />
              <h2 className="text-3xl font-extrabold text-[#0A2463]">
                Verifying Email
              </h2>
              <p className="mt-2 text-sm text-[#212529]">
                Please wait while we verify your email...
              </p>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-[#0A2463]">
                Email Verified!
              </h2>
              <p className="mt-2 text-sm text-[#212529]">{message}</p>
              <p className="mt-4 text-sm text-[#6C757D]">
                Redirecting to login page...
              </p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-[#0A2463]">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-[#212529]">{message}</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#FFFFFF] bg-[#0A2463] hover:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28A745] transition duration-200"
                >
                  Register Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
