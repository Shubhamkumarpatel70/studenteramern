import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import OTPModal from "../components/OTPModal";
import api from "../config/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, mobile, role } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Trigger registration (Backend sends OTP)
      await api.post("/auth/register", {
        name,
        email: email.toLowerCase(),
        password,
        mobile,
        role,
      });
      
      // Step 2: Show OTP Modal
      setShowOtpModal(true);
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      if (message.includes("already exists")) {
        setTimeout(() => navigate("/login"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        email: email.toLowerCase(),
        otp,
        type: "registration"
      });

      if (res.data.success) {
        setShowOtpModal(false);
        navigate("/login", { 
          state: { 
            message: "Account verified successfully! You can now login.",
            email: email.toLowerCase()
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/register", { ...formData, email: email.toLowerCase() });
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] font-[Inter,sans-serif] px-4 py-12">
      <div className="bg-[#F8F9FA] rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full border border-gray-100 relative">
        {/* Registration Form */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <UserPlus className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">
            Join Student Era today and start your journey.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="name"
                type="text"
                required
                value={name}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="mobile"
                type="tel"
                required
                value={mobile}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="9876543210"
                pattern="[6-9]{1}[0-9]{9}"
                maxLength="10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={onChange}
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? "Please wait..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPModal 
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={email}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        loading={loading}
      />
    </div>
  );
};

export default Register;
