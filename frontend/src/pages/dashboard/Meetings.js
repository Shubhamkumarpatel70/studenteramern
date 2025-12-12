import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, Clock, Video, RefreshCw } from 'lucide-react';

const JoinMeetingButton = ({ meetingDate, meetingLink, expireAfterMinutes = 60 }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isMeetingTime, setIsMeetingTime] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        // Normalize meeting time to epoch ms so timezone differences won't affect the countdown
        const meetingTs = meetingDate ? new Date(meetingDate).getTime() : null;
        const interval = setInterval(() => {
            if (!meetingTs) return;
            const nowTs = Date.now();
            const meetingEndTs = meetingTs + (expireAfterMinutes || 60) * 60 * 1000;
            const diff = meetingTs - nowTs;
            const diffEnd = meetingEndTs - nowTs;

            if (diffEnd <= 0) {
                setIsExpired(true);
                setIsMeetingTime(false);
                setTimeLeft('Meeting Expired');
                clearInterval(interval);
                return;
            }

            if (diff <= 0) {
                setIsMeetingTime(true);
                setTimeLeft('Meeting has started');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [meetingDate, expireAfterMinutes]);

    if (isExpired) {
        return (
            <button disabled className="w-full bg-gray-300 text-gray-600 font-semibold py-3 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                Meeting Expired
            </button>
        );
    }

    if (isMeetingTime) {
        return (
            <a 
                href={meetingLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl"
            >
                <Video className="h-4 w-4" />
                Join Now
            </a>
        );
    }

    return (
        <button disabled className="w-full bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm sm:text-base">Joins in: {timeLeft}</span>
        </button>
    );
};

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMeetings = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.get('/meetings', config);
            setMeetings(data.data);
        } catch (err) {
            setError('Could not fetch meetings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading meetings...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto text-center bg-red-50 border border-red-200 rounded-2xl p-6">
                    <p className="text-red-800 font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-xl p-3">
                            <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">My Meetings</h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">View and join your scheduled meetings</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchMeetings}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl shadow-md transition-all duration-200 text-sm sm:text-base font-semibold flex items-center gap-2 disabled:opacity-50"
                        title="Refresh meetings"
                        disabled={loading}
                    >
                        <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
                {meetings.length === 0 ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gray-100 rounded-full p-6">
                                <Calendar className="h-16 w-16 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Meetings Scheduled</h3>
                        <p className="text-gray-600">You don't have any meetings scheduled at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {meetings.map(meeting => (
                            <div key={meeting._id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="bg-gray-100 rounded-xl p-3 flex-shrink-0">
                                        <Video className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{meeting.title}</h3>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                                <span>{new Date(meeting.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-blue-500" />
                                                <span>{new Date(meeting.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                        {meeting.description && (
                                            <p className="text-sm text-gray-600 mt-3 line-clamp-2">{meeting.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <JoinMeetingButton meetingDate={meeting.date} meetingLink={meeting.link} expireAfterMinutes={meeting.expireAfterMinutes} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Meetings; 