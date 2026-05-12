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
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        skills: '',
        college: ''
    });

    useEffect(() => {
        const lastSkipped = localStorage.getItem('profile_modal_skip');
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (lastSkipped && (now - parseInt(lastSkipped)) < twentyFourHours) {
            setIsVisible(false);
        } else if (user && user.profileCompleteness < 100) {
            setIsVisible(true);
        }

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

    const handleSkip = () => {
        localStorage.setItem('profile_modal_skip', new Date().getTime().toString());
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Prepare data for API (e.g., convert skills string to array)
        const profileData = { ...formData, skills: formData.skills.split(',').map(s => s.trim()) };
        await updateUserProfile(profileData);
        if (step < 4) {
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
                            <label className="block text-sm font-medium text-gray-700">Tagline or Headline</label>
                            <input type="text" name="tagline" placeholder="e.g., Aspiring Web Developer" value={formData.tagline} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                            <input type="text" name="skills" placeholder="e.g., React, Node.js, Python" value={formData.skills} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        </div>
                    )}
                    {step === 4 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">College or University</label>
                            <input type="text" name="college" value={formData.college} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        {step > 1 && <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded-md">Back</button>}
                        <button type="button" onClick={handleSkip} className="px-4 py-2 text-gray-500 hover:text-gray-700">Skip for now</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            {step === 4 ? 'Done' : 'Next'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileCompletionModal; 