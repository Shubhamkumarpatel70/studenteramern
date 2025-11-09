import React, { useState, useEffect } from "react";
import api from "../../config/api";
import {
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Trash2,
  RefreshCw,
} from "lucide-react";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/tasks/admin", config);
      setTasks(res.data.data);
    } catch (err) {
      setError("Could not fetch tasks.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/tasks/${id}/status`, { status }, config);
      // Refresh the tasks list to show the updated status
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task status", err);
      // You might want to show an error to the user
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/tasks/${id}`, config);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
      setError("Failed to delete task.");
    }
  };

  const StatusBadge = ({ status }) => {
    const baseClass =
      "px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center";
    switch (status) {
      case "approved":
        return (
          <span className={`${baseClass} bg-green-100 text-green-800`}>
            <CheckCircle size={12} className="mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClass} bg-red-100 text-red-800`}>
            <XCircle size={12} className="mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>
            <Loader2 size={12} className="mr-1 animate-spin" /> Pending
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
        {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Uploaded Tasks
        </h1>
        <button
          onClick={fetchTasks}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Internship
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Submitted Work
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.user?.internId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.internship?.title || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {task.fileLinks &&
                      task.fileLinks.map((link, index) => (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={index}
                          className="flex items-center text-blue-600 hover:underline mb-1"
                        >
                          <ExternalLink size={16} className="mr-2" /> Link{" "}
                          {index + 1}
                        </a>
                      ))}
                    {task.filePath && (
                      <a
                        href={`https://studenteramernbackend.onrender.com/${task.filePath.replace(
                          "backend/",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <FileText size={16} className="mr-2" /> Download Project
                        File
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      {task.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(task._id, "approved")
                            }
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(task._id, "rejected")
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No tasks have been submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTasks;
