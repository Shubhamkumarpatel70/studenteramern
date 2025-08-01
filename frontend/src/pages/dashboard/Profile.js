import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Edit2, Mail, User, School, Award, CheckCircle } from 'lucide-react';
import EditProfileModal from '../../components/EditProfileModal';
import { Linkedin, Github, Globe, Star } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from '../../config/api';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_URL || '';

// Circular progress bar component
const CircularProgress = ({ value }) => {
  const CIRCUMFERENCE = 100;
  const dashArray = value === 100 ? `${CIRCUMFERENCE}` : `${value}, 100`;
  return (
    <svg className="w-16 h-16" viewBox="0 0 36 36">
      <path
        className="text-gray-200"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        className="text-blue-500"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray={dashArray}
        strokeLinecap={value === 100 ? 'butt' : 'round'}
      />
      <text x="18" y="20.35" className="text-sm fill-blue-700 font-bold" textAnchor="middle">{value}%</text>
    </svg>
  );
};

const Profile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [showEdit, setShowEdit] = React.useState(false);
    const [localUser, setLocalUser] = React.useState(user);
    const [file, setFile] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef();

    React.useEffect(() => {
      setLocalUser(user);
    }, [user]);

    if (!localUser) {
        return <div className="p-8"><p>Loading profile...</p></div>;
    }

    // Default avatar if profile picture is not a valid URL
    const isInvalidUrl = !localUser.profilePicture || localUser.profilePicture === 'dafaultava.jpg';
    const avatar = isInvalidUrl
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(localUser.name)}&background=random`
      : localUser.profilePicture.startsWith('http')
        ? localUser.profilePicture
        : `${IMAGE_BASE_URL}/${localUser.profilePicture}`;

    // Handle save from modal
    const handleSave = (updated) => {
      setLocalUser(updated);
      setShowEdit(false);
      if (updateUserProfile) updateUserProfile(updated); // If context supports backend update
    };

    // Social links
    const socialLinks = [
      localUser.linkedin && { icon: <Linkedin size={20} />, url: localUser.linkedin, label: 'LinkedIn' },
      localUser.github && { icon: <Github size={20} />, url: localUser.github, label: 'GitHub' },
      localUser.website && { icon: <Globe size={20} />, url: localUser.website, label: 'Website' },
    ].filter(Boolean);

    // Calculate profile completeness: require profile picture and at least one social link for 100%
    const hasProfilePicture = localUser.profilePicture && localUser.profilePicture !== 'dafaultava.jpg';
    const hasSocialLink = Boolean(localUser.linkedin || localUser.github || localUser.website);
    let completeness = localUser.profileCompleteness || 0;
    if ((!hasProfilePicture || !hasSocialLink) && completeness === 100) {
      completeness = 80; // or whatever max percent you want without both
    }
    const isProfileComplete = completeness === 100 && hasProfilePicture && hasSocialLink;

    // Example badges (replace with real logic as needed)
    const badges = [
      isProfileComplete && { icon: <CheckCircle className="text-green-500" size={18} />, label: 'Profile Complete' },
    ].filter(Boolean);

    // Level badge logic (improved)
    const level = localUser.level || 'Beginner';
    const levelBadge = {
      Beginner: {
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: <Star className="text-gray-400" size={28} />, label: 'Beginner',
        desc: 'Start your journey!'
      },
      Intermediate: {
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: <Star className="text-blue-400" size={28} />, label: 'Intermediate',
        desc: 'Keep growing!'
      },
      Pro: {
        color: 'bg-pink-100 text-pink-700 border-pink-300',
        icon: <Star className="text-pink-400" size={28} />, label: 'Pro',
        desc: 'You are a pro!'
      },
    }[level];

    const handleCameraClick = () => {
      if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
      setFile(selectedFile);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('profilePicture', selectedFile);
        const res = await api.put(
          '/profile/picture',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setLocalUser(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
        setFile(null);
      } catch (err) {
        alert('Profile image upload failed');
      }
      setUploading(false);
    };

    return (
      <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-primary-light via-background to-accent-light min-h-screen flex flex-col items-center font-sans font-medium">
        <div className="relative bg-card p-4 sm:p-8 rounded-2xl shadow-2xl border border-primary-light/30 flex flex-col items-center max-w-lg w-full mx-auto">
          <div className="absolute top-4 right-4">
            {completeness < 100 ? (
              <button onClick={() => setShowEdit(true)} className="flex items-center gap-1 px-4 py-2 bg-accent hover:bg-primary text-white rounded-lg text-sm font-semibold shadow transition animate-bounce">
                <Edit2 size={16} /> Complete Profile
              </button>
            ) : (
              <button onClick={() => setShowEdit(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary-light hover:bg-primary text-primary-dark hover:text-white rounded-lg text-sm font-semibold shadow transition">
                <Edit2 size={16} /> Edit Profile
              </button>
            )}
          </div>
          <div className="relative mb-2">
            <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-primary-light shadow-lg object-cover transition-transform duration-200 hover:scale-105" />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
            <div
              className="absolute bottom-2 right-2 bg-background rounded-full p-1 shadow cursor-pointer hover:bg-primary-light transition"
              title="Change profile picture"
              onClick={handleCameraClick}
            >
              {uploading ? (
                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h6m2 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </div>
          </div>
          {/* Social Links - improved with tooltips and hover */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4 mb-2">
              {socialLinks.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label} className="text-primary hover:text-accent hover:scale-110 transition transform duration-150" data-tooltip-id={`social-${idx}`}> 
                  {link.icon}
                  <span className="sr-only">{link.label}</span>
                </a>
              ))}
            </div>
          )}
          <h2 className="text-4xl font-extrabold text-primary-dark mb-1 flex items-center gap-2 font-sans">{localUser.name}</h2>
          <p className="text-primary-dark/80 mb-1 flex items-center gap-2 text-lg font-sans"><Mail size={18} /> {localUser.email}</p>
          {localUser.internId && <p className="text-sm text-accent mb-2 flex items-center gap-2 font-semibold"><Award size={16} /> Intern ID: <span className="underline cursor-pointer">{localUser.internId}</span></p>}
          <p className="text-primary-dark/60 italic mb-4 text-base font-sans">{localUser.tagline || 'No tagline provided.'}</p>
          {/* Level badge - prominent and above progress */}
          <div className={`flex flex-col items-center mb-2`}>
            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold shadow border-2 bg-background border-primary-light text-primary-dark mb-1`} title={levelBadge.desc}>
              {levelBadge.icon} {levelBadge.label}
            </span>
            <span className="text-xs text-primary-dark/40">{levelBadge.desc}</span>
          </div>
          {/* Badges - only Profile Complete if applicable */}
          {badges.length > 0 && (
            <div className="flex gap-2 mb-4 animate-fade-in">
              {badges.filter(b => b.label === 'Profile Complete').map((badge, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success rounded-full text-xs font-semibold border border-success/30 shadow-sm animate-bounce-in">
                  {badge.icon} {badge.label}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-8 w-full justify-center items-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 animate-progress">
                <CircularProgressbar
                  value={completeness}
                  text={`${completeness}%`}
                  styles={buildStyles({
                    textSize: '18px',
                    pathColor: '#4f46e5',
                    textColor: '#4f46e5',
                    trailColor: '#e0e7ff',
                    backgroundColor: '#f3f4f6',
                  })}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">Profile Completeness {isProfileComplete && <CheckCircle size={14} className="text-green-500" />} {!isProfileComplete && '(Incomplete: Add profile picture and at least one social link)'}</span>
            </div>
            <div className="flex flex-col items-center">
              <School size={22} className="text-blue-400 mb-1" />
              <span className="text-sm font-medium text-gray-500">College</span>
              <span className="text-lg text-gray-800 font-semibold">{localUser.college || 'Not provided'}</span>
            </div>
          </div>
          <div className="w-full border-t border-gray-200 pt-6 mt-4">
            <div className="mb-2 text-base font-semibold text-green-600 flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Skills</div>
            <div>
              {localUser.skills && localUser.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {localUser.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold hover:bg-blue-200 transition cursor-pointer shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : <span className="text-gray-400">No skills provided.</span>}
            </div>
          </div>
          <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.8s ease; }
            @keyframes bounce-in { 0% { transform: scale(0.7); } 60% { transform: scale(1.1); } 100% { transform: scale(1); } }
            .animate-bounce-in { animation: bounce-in 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
            @keyframes progress { from { opacity: 0; transform: scale(0.8);} to { opacity: 1; transform: scale(1);} }
            .animate-progress { animation: progress 1s cubic-bezier(.68,-0.55,.27,1.55); }
          `}</style>
        </div>
        {showEdit && (
          <EditProfileModal
            user={localUser}
            onClose={() => setShowEdit(false)}
            onSave={handleSave}
          />
        )}
      </div>
    );
};

export default Profile; 