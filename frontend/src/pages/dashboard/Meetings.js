import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, Clock, Video } from 'lucide-react';

const JoinMeetingButton = ({ meetingDate, meetingLink, expireAfterMinutes = 60 }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isMeetingTime, setIsMeetingTime] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const meetingDateTime = new Date(meetingDate);
            const meetingEndTime = new Date(meetingDateTime.getTime() + (expireAfterMinutes || 60) * 60 * 1000);
            const diff = meetingDateTime - now;
            const diffEnd = meetingEndTime - now;

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
            <button disabled className="bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed">
                Meeting Expired
            </button>
        );
    }

    if (isMeetingTime) {
        return (
            <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors">
                Join Now
            </a>
        );
    }

    return (
        <button disabled className="bg-indigo-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed">
            Joins in: {timeLeft}
        </button>
    );
};

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMeetings = async () => {
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

        fetchMeetings();
    }, []);

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen font-sans font-medium">
            <div className="max-w-lg mx-auto font-sans font-medium">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Meetings</h1>
                {loading ? (
                    <div className="text-center py-8">Loading meetings...</div>
                ) : meetings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No meetings scheduled.</div>
                ) : (
                    <div className="space-y-4">
                        {meetings.map(meeting => (
                            <div key={meeting._id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                                <div className="font-semibold text-gray-800">{meeting.title}</div>
                                <div className="text-xs text-gray-500">{new Date(meeting.date).toLocaleString()}</div>
                                <div className="text-sm text-gray-600">{meeting.description}</div>
                                <JoinMeetingButton meetingDate={meeting.date} meetingLink={meeting.link} expireAfterMinutes={meeting.expireAfterMinutes} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Meetings; 