import React, { useEffect, useState } from "react";
import api from "../../config/api";

const ManageRefunds = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refundUtr, setRefundUtr] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/applications");
        setApplications(
          res.data.data.filter((app) => app.status === "Rejected"),
        );
      } catch (err) {
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const openRefundModal = (app) => {
    setSelectedApp(app);
    setRefundUtr("");
    setShowModal(true);
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (!refundUtr) return;
    setError("");
    setSuccess("");
    try {
      await api.put(`/applications/${selectedApp._id}/refund`, { refundUtr });
      setSuccess("Refund processed for application " + selectedApp._id);
      setShowModal(false);
      setSelectedApp(null);
      setRefundUtr("");
      // Refresh list
      const res = await api.get("/applications");
      setApplications(res.data.data.filter((app) => app.status === "Rejected"));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process refund");
    }
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">
        Refund Requests (Rejected Applications)
      </h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border-b text-left">Applicant</th>
              <th className="px-4 py-2 border-b text-left">Internship</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Applied On</th>
              <th className="px-4 py-2 border-b text-left">Application Fee</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  No rejected applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="border-b">
                  <td className="px-4 py-2">
                    {app.user?.name} <br />
                    <span className="text-xs text-gray-500">
                      {app.user?.email}
                    </span>
                  </td>
                  <td className="px-4 py-2">{app.internship?.title}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-600">
                      Rejected
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(app.dateApplied).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">₹{app.amount || 149}</td>
                  <td className="px-4 py-2">
                    {app.refundUtr ? (
                      <div>
                        <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 mb-1">
                          Refunded
                        </span>
                        <div className="text-xs text-gray-700">
                          UTR: {app.refundUtr}
                        </div>
                      </div>
                    ) : (
                      <button
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                        onClick={() => openRefundModal(app)}
                        disabled={!!app.refundUtr}
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Refund UTR Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Enter Refund UTR/ID</h2>
            <form onSubmit={handleRefundSubmit}>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                placeholder="Refund UTR/ID"
                value={refundUtr}
                onChange={(e) => setRefundUtr(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRefunds;
