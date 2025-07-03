import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    college: '',
    skills: '',
    linkedin: '',
    github: '',
    website: '',
    profilePicture: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        tagline: user.tagline || '',
        college: user.college || '',
        skills: user.skills ? user.skills.join(', ') : '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        website: user.website || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSave(updated);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataBackend = new FormData();
    formDataBackend.append('profilePicture', file);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/profile/picture',
        formDataBackend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData((prev) => ({ ...prev, profilePicture: res.data.profilePicture }));
    } catch (err) {
      alert('Image upload failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tagline</label>
            <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">College</label>
            <input type="text" name="college" value={formData.college} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills <span className="text-xs text-gray-400">(comma separated)</span></label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub</label>
              <input type="url" name="github" value={formData.github} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://github.com/username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://yourwebsite.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {formData.profilePicture && (
              <img src={formData.profilePicture.startsWith('http') ? formData.profilePicture : `http://localhost:5000/${formData.profilePicture}`} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover border-2 border-blue-200" />
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 