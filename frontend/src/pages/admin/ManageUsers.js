import React, { useState, useEffect } from "react";
import api from "../../config/api";
import EditUserModal from "../../components/admin/EditUserModal";
import { Trash, Edit, ChevronLeft, ChevronRight } from "lucide-react";

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_URL || "";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleLoading, setRoleLoading] = useState(null);
  const [roleError, setRoleError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&limit=10`);
      const usersData = res.data.data || [];
      setUsers(usersData);
      setTotalPages(res.data.totalPages || 1);
      setTotalUsers(res.data.totalUsers || 0);
      setCurrentPage(res.data.currentPage || page);
    } catch (err) {
      console.error("Failed to fetch users", err);
      alert("Could not fetch users. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This cannot be undone."
      )
    ) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(currentPage); // Refresh user list on current page
      } catch (err) {
        console.error("Failed to delete user", err);
        alert("Could not delete user.");
      }
    }
  };

  const handleModalSave = async (updatedUser) => {
    try {
      await api.put(`/users/${updatedUser._id}`, updatedUser);
      setIsModalOpen(false);
      setSelectedUser(null);
      fetchUsers(currentPage); // Refresh user list on current page
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Could not update user.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setRoleLoading(userId);
    setRoleError("");
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers(currentPage);
    } catch (err) {
      setRoleError("Failed to change role");
    } finally {
      setRoleLoading(null);
    }
  };


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage Users</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Profile
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student ID
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Registered
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Verified
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Password
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Profile %
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <img
                        src={
                          user.profilePicture
                            ? user.profilePicture.startsWith("http")
                              ? user.profilePicture
                              : `${IMAGE_BASE_URL}/${user.profilePicture}`
                            : "/default-avatar.png"
                        }
                        alt={user.name}
                        className="w-10 h-10 rounded-full border object-cover shadow"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      {user.internId}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                        disabled={roleLoading === user._id}
                      >
                        <option value="user">User</option>
                        <option value="co-admin">Co-Admin</option>
                        <option value="accountant">Accountant</option>
                        <option value="admin">Admin</option>
                      </select>
                      {roleLoading === user._id && (
                        <span className="ml-2 text-xs text-gray-500">
                          Saving...
                        </span>
                      )}
                      {roleError && (
                        <div className="text-xs text-red-500">{roleError}</div>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      {user.plainPasswordForAdmin ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-mono font-semibold break-all max-w-xs inline-block" title={user.plainPasswordForAdmin}>
                          {user.plainPasswordForAdmin}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic" title="Password not available for users created before this feature was added">
                          Not available
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {user.profileCompleteness || 0}%
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{(currentPage - 1) * 10 + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * 10, totalUsers)}
              </span>{" "}
              of <span className="font-semibold">{totalUsers}</span> users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default ManageUsers;
