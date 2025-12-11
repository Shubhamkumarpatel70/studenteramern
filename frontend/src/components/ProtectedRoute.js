import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ roles }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login,
        // which is a nicer user experience than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If roles are specified, check if the user has one of the required roles
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
        // Redirect to a role-appropriate dashboard
        if (user.role === 'co-admin') return <Navigate to="/coadmin" replace />;
        if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
        if (user.role === 'accountant') return <Navigate to="/accountant" replace />;
        if (user.role === 'user') return <Navigate to="/dashboard" replace />;
        // Default fallback
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute; 