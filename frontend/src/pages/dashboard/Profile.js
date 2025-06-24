import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div className="p-8"><p>Loading profile...</p></div>;
    }

    // Default avatar if profile picture is not a valid URL
    const isInvalidUrl = !user.profilePicture || user.profilePicture.startsWith('images/users/');
    const avatar = isInvalidUrl ? `https://ui-avatars.com/api/?name=${user.name}&background=random` : user.profilePicture;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-6 mb-6">
                    <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
                    <div>
                        <h2 className="text-2xl font-semibold">{user.name}</h2>
                        <p className="text-gray-600">{user.tagline || 'No tagline provided.'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.internId && <p className="text-sm text-gray-500 mt-1">Intern ID: <span className="font-semibold text-gray-700">{user.internId}</span></p>}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">College</dt>
                            <dd className="mt-1 text-sm text-gray-900">{user.college || 'Not provided'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Profile Completeness</dt>
                            <dd className="mt-1 text-sm text-gray-900">{user.profileCompleteness || 0}%</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Skills</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {user.skills && user.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : 'No skills provided.'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Profile; 