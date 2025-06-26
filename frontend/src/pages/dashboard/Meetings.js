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
        <div className="p-6 bg-gray-50 min-h-full">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Meetings</h1>
            {meetings.length > 0 ? (
                <div className="space-y-4">
                    {meetings.map(meeting => (
                        <div key={meeting._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-4 sm:mb-0">
                                <h2 className="text-xl font-bold text-gray-900">{meeting.title}</h2>
                                <div className="flex items-center text-gray-600 mt-2">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                                    <Clock className="h-5 w-5 ml-4 mr-2" />
                                    <span>{new Date(meeting.date).toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <JoinMeetingButton meetingDate={meeting.date} meetingLink={meeting.link} expireAfterMinutes={meeting.expireAfterMinutes} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no scheduled meetings.</p>
            )}
        </div>
    );
};

export default Meetings; 