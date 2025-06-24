import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ roles }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login,
        // which is a nicer user experience than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If roles are specified, check if the user has one of the required roles
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />; // Or to an unauthorized page
    }

    return <Outlet />;
};

export default ProtectedRoute; 