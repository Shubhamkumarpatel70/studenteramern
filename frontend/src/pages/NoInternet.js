import React from 'react';
import { WifiOff } from 'lucide-react';

const NoInternet = () => {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light text-center p-4">
            <div className="animate-bounce mb-6">
                <WifiOff className="h-24 w-24 text-error drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-extrabold text-primary-dark mb-2 font-sans">No Internet Connection</h1>
            <p className="text-lg text-primary-dark/80 mb-8 max-w-md font-sans">
                You are not connected to the internet. Please check your network connection and try again.
            </p>
            <button 
                onClick={handleRetry}
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 text-lg font-sans"
            >
                Retry
            </button>
        </div>
    );
};

export default NoInternet; 