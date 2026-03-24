import React from 'react';
import { WifiOff, RefreshCcw } from 'lucide-react';

const NoInternet = () => {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-8 md:p-12 rounded-2xl shadow-sm ring-1 ring-gray-200 text-center flex flex-col items-center">

                <div className="bg-red-50 p-6 rounded-full mb-8 relative">
                    <WifiOff className="h-16 w-16 text-red-500" />
                    <div className="absolute top-0 left-0 w-full h-full bg-red-400 rounded-full animate-ping opacity-20"></div>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                    Connection Lost
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    It seems you are not connected to the internet. Please check your network connection and try again.
                </p>

                <button
                    onClick={handleRetry}
                    className="group inline-flex items-center justify-center w-full px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <RefreshCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Retry Connection
                </button>
            </div>
        </div>
    );
};

export default NoInternet;