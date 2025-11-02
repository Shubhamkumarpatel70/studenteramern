import React, { useEffect, useState } from 'react';
import api from '../../config/api';

const DeletionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/account-deletion-requests');
      setRequests(res.data.data);
    } catch (err) {
      setError('Failed to fetch deletion requests.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request) => {
    setActionError('');
    setActionSuccess('');
    try {
      await api.put(`/account-deletion-requests/${request._id}/approve`);
      setActionSuccess('Account deletion request approved and user account deleted.');
      fetchRequests();
    } catch (err) {
      setActionError('Failed to approve deletion request.');
    }
  };

  const handleReject = async (request) => {
    setActionError('');
    setActionSuccess('');
    try {
      await api.put(`/account-deletion-requests/${request._id}/reject`);
      setActionSuccess('Account deletion request rejected.');
      fetchRequests();
    } catch (err) {
      setActionError('Failed to reject deletion request.');
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#F2F2F7] font-[Inter,sans-serif]">
      <h1 className="text-3xl font-extrabold text-[#0A84FF] mb-6">Account Deletion Requests</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {actionSuccess && <div className="text-green-600 mb-4">{actionSuccess}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-[#E5E5EA] text-[#1C1C1E]">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Reason</th>
              <th className="py-2 px-4">Requested At</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request._id} className="border-b">
                <td className="py-2 px-4 font-semibold">{request.userName}</td>
                <td className="py-2 px-4">{request.userEmail}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{request.reason}</td>
                <td className="py-2 px-4 text-xs text-gray-500">{new Date(request.requestedAt).toLocaleString()}</td>
                <td className="py-2 px-4">
                  {request.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold hover:bg-green-700 transition"
                        onClick={() => handleApprove(request)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm font-bold hover:bg-red-700 transition"
                        onClick={() => handleReject(request)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && !loading && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No pending deletion requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center relative">
            <h2 className="text-xl font-bold mb-4 text-[#FF3B30]">Confirm Permanent Deletion</h2>
            <p className="mb-4">Are you sure you want to permanently delete <b>{selectedUser.name}</b>? This action cannot be undone.</p>
            {actionError && <div className="text-red-600 mb-2">{actionError}</div>}
            <div className="flex gap-4 justify-center mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded font-semibold" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-[#FF3B30] text-white rounded font-bold hover:bg-[#FF453A]" onClick={handleDelete}>Yes, Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletionRequests; 