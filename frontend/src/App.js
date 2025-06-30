import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import api from './config/api';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OTPVerify from "./pages/OTPVerify";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CoAdminDashboard from "./pages/CoAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Refund from "./pages/Refund";
import Privacy from "./pages/Privacy";
import VerifyCertificate from "./pages/VerifyCertificate";
import DashboardHome from "./pages/dashboard/DashboardHome";
import AppliedInternships from "./pages/dashboard/AppliedInternships";
import Meetings from "./pages/dashboard/Meetings";
import Notifications from "./pages/dashboard/Notifications";
import Transactions from "./pages/dashboard/Transactions";
import Profile from "./pages/dashboard/Profile";
import Certificates from "./pages/dashboard/Certificates";
import OfferLetters from "./pages/dashboard/OfferLetters";
import UploadTask from "./pages/dashboard/UploadTask";
import MyTasks from "./pages/dashboard/MyTasks";
import PaymentPage from './pages/PaymentPage';
import Apply from './pages/Apply';
import InternshipDetails from './pages/InternshipDetails';
import Internships from './pages/Internships';
import Help from "./pages/dashboard/Help";
import HelpQueries from "./pages/admin/HelpQueries";

// Admin Pages
import AdminHome from "./pages/admin/AdminHome";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageMeetings from "./pages/admin/ManageMeetings";
import SendNotification from "./pages/admin/SendNotification";
import GenerateCertificate from "./pages/admin/GenerateCertificate";
import GenerateOfferLetter from "./pages/admin/GenerateOfferLetter";
import AddInternship from "./pages/admin/AddInternship";
import InternshipRegistrations from "./pages/admin/InternshipRegistrations";
import ManageTestimonials from './pages/admin/ManageTestimonials';
import PostAnnouncement from './pages/admin/PostAnnouncement';
import ManageTasks from './pages/admin/ManageTasks';
import AssignTasks from './pages/admin/AssignTasks';
import Queries from "./pages/admin/Queries";


// Co-Admin Pages
import CoAdminHome from "./pages/coadmin/CoAdminHome";
import ManageStudents from "./pages/coadmin/ManageStudents";
import ViewMeetings from "./pages/coadmin/ViewMeetings";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AuthContext, { AuthProvider } from './context/AuthContext';
import ProfileCompletionModal from './components/ProfileCompletionModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Error Pages
import NotFound from './pages/NotFound';
import NoInternet from './pages/NoInternet';
import ServerError from './pages/ServerError';

// A wrapper component to access context
const AppContent = () => {
  const { showProfileModal } = useContext(AuthContext);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Axios interceptor for server errors
    const responseInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (!error.response) {
          // Network error (server is down, CORS, etc.)
          setServerError(true);
        } else if (error.response.status >= 500) {
          // Server-side error (500, 502, 503, etc.)
          setServerError(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (serverError) {
    return <ServerError />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      {showProfileModal && <ProfileCompletionModal />}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/otp-verify" element={<OTPVerify />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/apply/:internshipId" element={<ProtectedRoute roles={['user']}><Apply /></ProtectedRoute>} />
          <Route path="/payment" element={<PaymentPage />} />
          
          {/* Protected User Dashboard */}
          <Route element={<ProtectedRoute roles={['user']} />}>
            <Route path="/dashboard" element={<UserDashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="overview" element={<DashboardHome />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="profile" element={<Profile />} />
              <Route path="applied-internships" element={<AppliedInternships />} />
              <Route path="meetings" element={<Meetings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="offer-letters" element={<OfferLetters />} />
              <Route path="upload-task" element={<UploadTask />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Route>
          
          {/* Protected Admin Dashboard */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route index element={<AdminHome />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="add-internship" element={<AddInternship />} />
              <Route path="internship-registrations" element={<InternshipRegistrations />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
              <Route path="assign-tasks" element={<AssignTasks />} />
              <Route path="manage-testimonials" element={<ManageTestimonials />} />
              <Route path="post-announcement" element={<PostAnnouncement />} />
              <Route path="manage-meetings" element={<ManageMeetings />} />
              <Route path="send-notification" element={<SendNotification />} />
              <Route path="generate-certificate" element={<GenerateCertificate />} />
              <Route path="generate-offer-letter" element={<GenerateOfferLetter />} />
              <Route path="queries" element={<Queries />} />
              <Route path="help-queries" element={<HelpQueries />} />
            </Route>
          </Route>
          
          {/* Protected Co-Admin Dashboard */}
          <Route element={<ProtectedRoute roles={['co-admin']} />}>
            <Route path="/co-admin-dashboard" element={<CoAdminDashboard />}>
              <Route index element={<CoAdminHome />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="meetings" element={<ViewMeetings />} />
            </Route>
          </Route>

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;