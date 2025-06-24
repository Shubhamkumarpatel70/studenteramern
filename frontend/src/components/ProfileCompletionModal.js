import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

const ProfileCompletionModal = () => {
    const { user, updateUserProfile, hideProfileCompletionModal } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        profilePicture: '',
        tagline: '',
        skills: '',
        college: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                profilePicture: user.profilePicture || '',
                tagline: user.tagline || '',
                skills: user.skills ? user.skills.join(', ') : '',
                college: user.college || ''
            });
        }
    }, [user]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Prepare data for API (e.g., convert skills string to array)
        const profileData = { ...formData, skills: formData.skills.split(',').map(s => s.trim()) };
        await updateUserProfile(profileData);
        if (step < 5) {
            nextStep();
        } else {
            // Last step
            hideProfileCompletionModal();
        }
    };
    
    // Simulate file upload
    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePicture: `images/users/${e.target.files[0].name}` });
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
                <p className="text-gray-600 mb-4">Fill out your profile to get the most out of Student Era.</p>
                <ProgressBar value={user.profileCompleteness || 0} />
                
                <form onSubmit={handleUpdate}>
                    {step === 1 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <p className="text-xs text-gray-500 mb-2">For now, just select an image. Upload functionality is simulated.</p>
                            <input type="file" name="profilePicture" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tagline or Headline</label>
                            <input type="text" name="tagline" placeholder="e.g., Aspiring Web Developer" value={formData.tagline} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        </div>
                    )}
                    {step === 4 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                            <input type="text" name="skills" placeholder="e.g., React, Node.js, Python" value={formData.skills} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        </div>
                    )}
                    {step === 5 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">College or University</label>
                            <input type="text" name="college" value={formData.college} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        {step > 1 && <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded-md">Back</button>}
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md ml-auto">
                            {step === 5 ? 'Done' : 'Next'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileCompletionModal; 