import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { Plus, Edit, Trash2 } from "lucide-react";

const TestimonialModal = ({ testimonial, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    designation: "",
    image: "",
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || "",
        message: testimonial.message || testimonial.quote || "",
        designation: testimonial.designation || testimonial.role || "",
        image: testimonial.image || testimonial.avatar || "",
      });
    } else {
      setFormData({ name: "", message: "", designation: "", image: "" });
    }
  }, [testimonial]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">
          {testimonial ? "Edit" : "Add"} Testimonial
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation (e.g., "Web Development Intern")
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL (optional)
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isLoading ? "Saving..." : "Save Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/testimonials");
      setTestimonials(data.data);
    } catch (err) {
      setError("Failed to fetch testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (testimonialData) => {
    setActionLoading(true);
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (testimonialData._id) {
        // Update existing
        await api.put(
          `/testimonials/${testimonialData._id}`,
          testimonialData,
          config
        );
      } else {
        // Create new
        await api.post("/testimonials", testimonialData, config);
      }
      fetchTestimonials();
      setIsModalOpen(false);
      setSelectedTestimonial(null);
    } catch (err) {
      console.error("Save failed", err);
      setError("Could not save testimonial.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await api.delete(`/testimonials/${id}`, config);
        fetchTestimonials();
      } catch (err) {
        setError("Could not delete testimonial.");
      }
    }
  };

  const openModal = (testimonial = null) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Testimonials
        </h1>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}

      <div className="bg-white shadow-md rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avatar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Message
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testimonials.map((t) => (
                <tr key={t._id}>
                  <td className="px-6 py-4">
                    <img
                      src={t.image || t.avatar || "https://i.pravatar.cc/150"}
                      alt={t.name}
                      className="h-10 w-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {t.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {t.designation || t.role}
                  </td>
                  <td className="px-6 py-4">
                    <p className="w-64 truncate">{t.message || t.quote}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => openModal(t)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default ManageTestimonials;
