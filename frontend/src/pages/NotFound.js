import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <FileSearch className="h-24 w-24 text-indigo-400 mb-6" />
            <h1 className="text-6xl font-extrabold text-gray-800 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                Sorry, the page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <Link 
                to="/"
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound; 