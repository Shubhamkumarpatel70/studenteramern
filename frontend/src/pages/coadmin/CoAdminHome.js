import React from 'react';

const CoAdminHome = () => {
    const stats = [
        { title: 'Total Students', value: '800', color: 'bg-teal-500' },
        { title: 'Meetings This Week', value: '12', color: 'bg-cyan-500' },
        { title: 'Active Internships', value: '50', color: 'bg-emerald-500' },
    ];
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Co-Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <div key={stat.title} className={`${stat.color} text-white p-6 rounded-lg shadow-lg`}>
                        <h2 className="text-lg font-semibold">{stat.title}</h2>
                        <p className="text-4xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoAdminHome; 