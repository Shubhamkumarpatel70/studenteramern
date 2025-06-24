import React from 'react';
import { WifiOff } from 'lucide-react';

const NoInternet = () => {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <WifiOff className="h-24 w-24 text-red-400 mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">No Internet Connection</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                You are not connected to the internet. Please check your network connection and try again.
            </p>
            <button 
                onClick={handleRetry}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
            >
                Retry
            </button>
        </div>
    );
};

export default NoInternet; 