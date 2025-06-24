import React from 'react';
import { ServerCrash } from 'lucide-react';

const ServerError = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <ServerCrash className="h-24 w-24 text-red-500 mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Server Not Responding</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                We're having trouble connecting to our servers. Please try again in a few moments.
            </p>
            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
            >
                Refresh Page
            </button>
        </div>
    );
};

export default ServerError; 