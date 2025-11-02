import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { CreditCard, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const ManagePayments = () => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    upiId: '',
    qrCodeUrl: '',
    instructions: '',
    isActive: true
  });

  const fetchPaymentOptions = async () => {
    try {
      const res = await api.get('/payment-options');
      setPaymentOptions(res.data.data);
    } catch (err) {
      setError('Failed to fetch payment options');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingOption) {
        await api.put(`/payment-options/${editingOption._id}`, formData);
        setSuccess('Payment option updated successfully');
      } else {
        await api.post('/payment-options', formData);
        setSuccess('Payment option created successfully');
      }
      setShowModal(false);
      setEditingOption(null);
      setFormData({ displayName: '', upiId: '', qrCodeUrl: '', instructions: '', isActive: true });
      fetchPaymentOptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save payment option');
    }
  };

  const handleEdit = (option) => {
    setEditingOption(option);
    setFormData({
      displayName: option.displayName,
      upiId: option.upiId,
      qrCodeUrl: option.qrCodeUrl || '',
      instructions: option.instructions || '',
      isActive: option.isActive !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment option?')) return;

    try {
      await api.delete(`/payment-options/${id}`);
      setSuccess('Payment option deleted successfully');
      fetchPaymentOptions();
    } catch (err) {
      setError('Failed to delete payment option');
    }
  };

  const toggleActive = async (option) => {
    try {
      await api.put(`/payment-options/${option._id}`, {
        ...option,
        isActive: !option.isActive
      });
      setSuccess(`Payment option ${!option.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchPaymentOptions();
    } catch (err) {
      setError('Failed to update payment option status');
    }
  };

  const resetForm = () => {
    setFormData({ displayName: '', upiId: '', qrCodeUrl: '', instructions: '', isActive: true });
    setEditingOption(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-[#F2F2F7] font-[Inter,sans-serif] flex justify-center items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-[#F2F2F7] font-[Inter,sans-serif]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#0A84FF]">Manage Payment Options</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#007AFF] transition-colors"
          >
            <Plus className="mr-2" size={18} />
            Add Payment Option
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#E5E5EA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1C1C1E] uppercase tracking-wider">
                    Display Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1C1C1E] uppercase tracking-wider">
                    UPI ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1C1C1E] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#1C1C1E] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentOptions.map((option) => (
                  <tr key={option._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="mr-3 text-[#0A84FF]" size={20} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {option.displayName}
                          </div>
                          {option.instructions && (
                            <div className="text-sm text-gray-500">
                              {option.instructions}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {option.upiId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        option.isActive !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {option.isActive !== false ? (
                          <><CheckCircle className="mr-1" size={12} /> Active</>
                        ) : (
                          <><XCircle className="mr-1" size={12} /> Inactive</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleActive(option)}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          option.isActive !== false
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {option.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(option)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(option._id)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paymentOptions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No payment options found. Click "Add Payment Option" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingOption ? 'Edit Payment Option' : 'Add Payment Option'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID *
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                      placeholder="example@upi"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      QR Code URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.qrCodeUrl}
                      onChange={(e) => setFormData({...formData, qrCodeUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                      placeholder="https://example.com/qr.png"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions (optional)
                    </label>
                    <textarea
                      value={formData.instructions}
                      onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                      rows="3"
                      placeholder="Payment instructions for users"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-[#0A84FF] focus:ring-[#0A84FF] border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active (available for payments)
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0A84FF] text-white rounded-md hover:bg-[#007AFF]"
                    >
                      {editingOption ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;
