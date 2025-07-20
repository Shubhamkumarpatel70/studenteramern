import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../config/api';

const DeleteAccount = () => {
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('confirm'); // confirm | pending | error
  const [error, setError] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/profile/request-deletion', { reason });
      setStatus('pending');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request account deletion.');
    }
  };

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1C1C1E] font-[Inter,sans-serif]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[#0A84FF] text-center">
          <h1 className="text-2xl font-extrabold text-[#0A84FF] mb-4">Account Deletion Requested</h1>
          <p className="text-lg text-gray-700 mb-4">Your account deletion request is <b>pending</b> and you have been logged out. An admin will review your request soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1C1C1E] font-[Inter,sans-serif]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[#0A84FF]">
        <h1 className="text-2xl font-extrabold text-[#0A84FF] mb-4 text-center">Delete Account</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">Are you sure you want to delete your account? This action cannot be undone.</p>
        <form onSubmit={handleDelete} className="flex flex-col gap-4">
          <label className="font-semibold text-gray-800">Reason for deletion <span className="text-red-500">*</span></label>
          <textarea
            className="border border-gray-300 rounded-md p-2 min-h-[80px]"
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            placeholder="Please let us know why you are leaving..."
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-4 mt-4">
            <button type="button" className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" onClick={() => navigate(-1)}>No, Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded bg-[#FF9F0A] text-white font-bold hover:bg-[#FFB800]">Yes, Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount; 