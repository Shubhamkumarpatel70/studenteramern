import React from 'react';

const ViewMeetings = () => {
    // Placeholder data
    const meetings = [
        { id: 1, title: 'Interview with Alex Doe', time: '2023-10-26T10:00:00' },
        { id: 2, title: 'Kick-off for Priya Sharma', time: '2023-10-28T14:30:00' },
    ];
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">View All Meetings</h1>
            <div className="space-y-4">
                {meetings.map(meeting => (
                    <div key={meeting.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                            <h2 className="font-bold">{meeting.title}</h2>
                            <p className="text-sm text-gray-500">{new Date(meeting.time).toLocaleString()}</p>
                        </div>
                        <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition">View Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewMeetings; 