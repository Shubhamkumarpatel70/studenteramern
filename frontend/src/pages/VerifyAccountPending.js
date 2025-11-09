import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, Clock, RefreshCw } from "lucide-react";
import api from "../config/api";

const VerifyAccountPending = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const checkVerificationStatus = async () => {
    if (!email) return;

    setChecking(true);
    setError("");
    try {
      const res = await api.get(
        `/auth/check-verification?email=${encodeURIComponent(
          email.toLowerCase()
        )}`
      );
      if (res.data.success) {
        setIsVerified(res.data.isVerified);
      }
    } catch (err) {
      setError("Failed to check verification status. Please try again.");
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  if (!email) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 font-[Inter,sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <Mail className="w-16 h-16 text-[#0A2463] mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-[#0A2463]">
            Verify Your Account
          </h2>
          <p className="mt-2 text-sm text-[#212529]">
            We have sent a verification link to your email address.
          </p>
          <p className="mt-2 text-sm text-[#6C757D]">
            Please check your email and click the link to verify your account.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#F8F9FA] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#0A2463]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isVerified ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-semibold text-green-600">
                    Account Verified!
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-6 h-6 text-[#0A2463]" />
                  <span className="text-lg font-semibold text-[#0A2463]">
                    Verification Pending
                  </span>
                </>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={checkVerificationStatus}
                disabled={checking}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#FFFFFF] bg-[#0A2463] hover:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28A745] transition duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${checking ? "animate-spin" : ""}`}
                />
                {checking ? "Checking..." : "Check Verification Status"}
              </button>

              {isVerified && (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full flex justify-center py-3 px-4 border border-[#28A745] rounded-lg shadow-sm text-sm font-medium text-[#28A745] bg-[#FFFFFF] hover:bg-[#28A745] hover:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28A745] transition duration-200"
                >
                  Proceed to Login
                </button>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#6C757D]">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-medium text-[#28A745] hover:text-[#218838] underline"
                >
                  try registering again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPending;
