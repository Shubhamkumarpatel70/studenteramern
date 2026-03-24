import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { Link } from "react-router-dom";
import { Award, Clock, Loader2, FileText } from "lucide-react";

const Certificates = ({ isTab = false }) => {
  const [certificates, setCertificates] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [certsRes, tasksRes] = await Promise.all([
          api.get("/certificates/my-certificates", config),
          api.get("/assigned-tasks/my-tasks", config),
        ]);

        setCertificates(certsRes.data.data || []);
        const completed = tasksRes.data.data.filter(
          (task) => task.status === "completed",
        );
        setCompletedTasks(completed);
      } catch (err) {
        setError("Could not fetch your data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingCertificates = completedTasks.filter(
    (task) =>
      !certificates.some(
        (cert) => cert.internshipTitle === task.internship.title,
      ),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={isTab ? "w-full" : "p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50"}>
      <div className="max-w-7xl mx-auto">
        {!isTab && (
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Certificates & Completion
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              View your completion certificates and track pending internship tasks
            </p>
          </div>
        )}

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        ) : (
          <>
            {/* Certificates Section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-gray-400" />
                Your Certificates ({certificates.length})
              </h2>
              {certificates.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No Certificates Yet
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Complete your internships and tasks to receive your completion certificates.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {certificates.map((cert) => (
                    <div
                      key={cert._id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-start w-full transition-colors hover:border-gray-300"
                    >
                      <div className="flex items-start gap-4 flex-1 w-full mb-5">
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600 flex-shrink-0">
                          <Award className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                            {cert.internshipTitle}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            Issued: <span className="font-medium text-gray-700">{new Date(cert.createdAt).toLocaleDateString()}</span>
                          </p>
                          {cert.internshipDuration && (
                            <p className="text-xs text-gray-500">
                              Duration: {cert.internshipDuration}
                            </p>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/dashboard/certificates/${cert._id}`}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors shadow-sm"
                      >
                        <FileText className="h-4 w-4" />
                        View Certificate
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Completion */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                Pending Completion ({pendingCertificates.length})
              </h2>
              {pendingCertificates.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Up to Date
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    All your tasks are completed and certificates issued.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {pendingCertificates.map((task) => (
                    <div
                      key={task._id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col transition-colors hover:border-gray-300"
                    >
                      <div className="flex items-start gap-4 mb-5 flex-1">
                        <div className="bg-amber-50 p-3 rounded-lg text-amber-600 flex-shrink-0">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                            {task.internship.title}
                          </h3>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            Task: {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Status: Completed, pending review
                          </p>
                        </div>
                      </div>
                      <button
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-500 border border-gray-200 py-2.5 px-4 rounded-lg font-medium text-sm cursor-not-allowed shadow-sm"
                        disabled
                      >
                        Certificate under generation
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CheckCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Certificates;
