import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../config/api';
import { AlertCircle } from 'lucide-react';

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border-2 border-orange-200 text-center">
          <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-600 mb-4">Account Deletion Requested</h1>
          <p className="text-sm sm:text-base text-gray-700 mb-6">Your account deletion request is <b>pending</b> and you have been logged out. An admin will review your request soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border-2 border-red-200">
        <div className="text-center mb-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-red-600 mb-2">Delete Account</h1>
          <p className="text-sm sm:text-base text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
        </div>
        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for deletion <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px] resize-none"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
              placeholder="Please let us know why you are leaving..."
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl p-3">
              {error}
            </div>
          )}
          <div className="flex gap-3 sm:gap-4 pt-4">
            <button 
              type="button" 
              className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-colors duration-200" 
              onClick={() => navigate(-1)}
            >
              No, Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold shadow-lg transition-all duration-200"
            >
              Yes, Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount; 