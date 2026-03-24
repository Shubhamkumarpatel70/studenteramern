import React, { useEffect, useState, useContext } from "react";
import api from "../../config/api";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {
  Loader2,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowRight,
  Upload,
  PlayCircle,
  MessageCircle,
  CalendarDays,
  FolderOpen,
  LayoutGrid
} from "lucide-react";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [internships, setInternships] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const appsRes = await api.get("/applications/my-applications", config);
        const approvedInternships = appsRes.data.data.filter(
          (app) => app.status === "Approved" && app.internship,
        );
        setInternships(approvedInternships.map((app) => app.internship));

        const tasksRes = await api.get("/assigned-tasks/my-tasks", config);
        setTasks(tasksRes.data.data);

        setError("");
      } catch (err) {
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchWhatsAppLink();
    fetchData();
  }, []);

  const fetchWhatsAppLink = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await api.get("/social-links", config);
      const links = res.data.data;
      const whatsapp = links.find((link) => link.platform === "whatsapp" && link.isActive);
      if (whatsapp) {
        setWhatsappLink(whatsapp.url);
      }
    } catch (err) {
      console.error("Failed to fetch WhatsApp link", err);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <p className="text-gray-500 font-medium">Loading workspace...</p>
      </div>
    );
  }

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const pendingTasks = tasks.filter((t) => t.status !== "completed").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans tracking-tight">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <Clock className="h-5 w-5 text-red-500" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <>
          {/* Minimalist Hero Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-medium">
                <CalendarDays className="h-4 w-4" />
                {currentDate}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {greeting}, {user.name.split(' ')[0]}
              </h1>
              <p className="text-gray-500 mt-1 max-w-lg text-sm sm:text-base">
                Here is a summary of your workspace today. You have {pendingTasks} pending tasks requiring your attention.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 min-w-[120px] text-center">
                <p className="text-sm font-medium text-gray-500 mb-1">Active Programs</p>
                <p className="text-3xl font-bold text-gray-900">{internships.length}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 min-w-[120px] text-center">
                <p className="text-sm font-medium text-gray-500 mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-blue-600">{pendingTasks}</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Content Area (Left Column) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Internships Section */}
              <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gray-400" /> Current Enrollments
                  </h2>
                  <Link to="/internships" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    Explore Internships &rarr;
                  </Link>
                </div>

                <div className="p-6">
                  {internships.length === 0 ? (
                    <div className="text-center py-8">
                      <FolderOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-900 font-medium">No active programs</p>
                      <p className="text-gray-500 text-sm mt-1">Start by applying to open roles.</p>
                      <Link to="/internships" className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm shadow-sm">
                        Apply Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {internships.map((internship) => {
                        const internshipTasks = tasks.filter((t) => t.internship && t.internship._id === internship._id);
                        const completed = internshipTasks.filter((t) => t.status === "completed").length;
                        const total = internshipTasks.length;
                        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                        const nextTask = internshipTasks.find((t) => t.status !== "completed");

                        return (
                          <div key={internship._id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-200 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {internship.title || internship.name}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1 font-medium flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  {internship.company || "Student Era Program"}
                                </p>
                              </div>

                              <div className="w-full md:w-48 flex flex-col gap-1.5">
                                <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                                  <span>Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                              {nextTask ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <PlayCircle className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-semibold text-gray-700">Next Task: <span className="font-normal text-gray-600">{nextTask.title}</span></span>
                                  </div>
                                  <Link
                                    to={`/dashboard/my-tasks`}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm shadow-sm"
                                  >
                                    Continue <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                                  <CheckCircle className="h-4 w-4 text-green-600" /> Program track complete.
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* Tasks Section */}
              <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-gray-400" />
                  <h2 className="text-lg font-bold text-gray-900">Action Items</h2>
                </div>

                <div className="p-6">
                  {tasks.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">No tasks assigned currently.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tasks.map((task) => (
                        <div key={task._id} className="border border-gray-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-sm transition-shadow bg-white">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">
                                {task.title}
                              </h3>
                              <div className="flex-shrink-0">
                                {task.status === "completed" && <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Done</span>}
                                {task.status === "in-progress" && <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">In Progress</span>}
                                {task.status === "assigned" && <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Assigned</span>}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-5 mt-3">
                              <Clock className="h-3.5 w-3.5" />
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {task.status !== "completed" && (
                              <Link
                                to={`/dashboard/upload-task`}
                                className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-xs hover:bg-blue-700 transition-colors shadow-sm"
                              >
                                <Upload className="h-3.5 w-3.5" /> Submit Work
                              </Link>
                            )}
                            <Link
                              to={`/dashboard/my-tasks`}
                              className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium text-xs hover:bg-gray-100 border border-gray-200 transition-colors"
                            >
                              <ArrowRight className="h-3.5 w-3.5" /> View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

            </div>

            {/* Right Column (Sidebar Quick Actions) */}
            <div className="space-y-6 lg:pl-2">
              <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                  <h2 className="text-base font-bold text-gray-900">Shortcuts</h2>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <Link to="/dashboard/applied-internships" className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group">
                    <div className="bg-gray-100 p-2.5 rounded-md group-hover:bg-white group-hover:border-gray-200 border border-transparent transition-colors">
                      <Briefcase className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">My Applications</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Track application statuses.</p>
                    </div>
                  </Link>

                  {whatsappLink && (
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-lg border border-green-100 bg-green-50/50 hover:bg-green-50 transition-colors group">
                      <div className="bg-green-100 p-2.5 rounded-md text-green-700 border border-transparent group-hover:border-green-200 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-green-900">Community Hub</h3>
                        <p className="text-xs text-green-700/80 mt-0.5">Join WhatsApp group for support.</p>
                      </div>
                    </a>
                  )}

                  <div className="p-4 rounded-lg border border-gray-100 bg-gray-50 mt-2">
                    <h3 className="font-bold text-sm text-gray-900 mb-1">Need Assistance?</h3>
                    <p className="text-xs text-gray-500 mb-3">Reach out to your coordinator.</p>
                    <button className="w-full py-2 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors text-xs shadow-sm">
                      Contact Support
                    </button>
                  </div>
                </div>
              </section>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
