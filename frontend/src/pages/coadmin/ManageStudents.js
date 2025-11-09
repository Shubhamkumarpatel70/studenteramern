import React, { useEffect, useState } from "react";
import api from "../../config/api";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    tagline: "",
    skills: "",
    college: "",
    linkedin: "",
    github: "",
    website: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStudents(res.data.data);
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setEditForm({
      name: student.name || "",
      email: student.email || "",
      mobile: student.mobile || "",
      role: student.role || "",
      tagline: student.tagline || "",
      skills: student.skills ? student.skills.join(", ") : "",
      college: student.college || "",
      linkedin: student.linkedin || "",
      github: student.github || "",
      website: student.website || "",
    });
    setShowModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const updateData = {
        ...editForm,
        skills: editForm.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
      };

      const res = await api.put(`/users/${selectedStudent._id}`, updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Update the student in the list
      setStudents(
        students.map((student) =>
          student._id === selectedStudent._id ? res.data.data : student
        )
      );

      setShowModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update student");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.role}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {student.isVerified ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(student)}
                      className="text-teal-600 hover:text-teal-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for editing student details */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Student Details
              </h3>
              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile
                    </label>
                    <input
                      type="text"
                      value={editForm.mobile}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mobile: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      disabled={selectedStudent.role === "admin"}
                    >
                      <option value="student">Student</option>
                      <option value="co-admin">Co-Admin</option>
                      {selectedStudent.role !== "admin" && (
                        <option value="admin">Admin</option>
                      )}
                    </select>
                    {selectedStudent.role === "admin" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Cannot change admin role
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tagline: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      College
                    </label>
                    <input
                      type="text"
                      value={editForm.college}
                      onChange={(e) =>
                        setEditForm({ ...editForm, college: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.skills}
                      onChange={(e) =>
                        setEditForm({ ...editForm, skills: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={editForm.linkedin}
                      onChange={(e) =>
                        setEditForm({ ...editForm, linkedin: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={editForm.github}
                      onChange={(e) =>
                        setEditForm({ ...editForm, github: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) =>
                        setEditForm({ ...editForm, website: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                  >
                    {updateLoading ? "Updating..." : "Update Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
