import React, { useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AccountantSidebar from '../components/AccountantSidebar';
import AccountantHome from './AccountantHome';
import AccountantManageTransactions from './AccountantManageTransactions';
import AccountantMeetings from './AccountantMeetings';
import AccountantNotifications from './AccountantNotifications';
import AuthContext from '../context/AuthContext';

const AccountantProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || user.role !== 'accountant') {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AccountantDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <AccountantProtectedRoute>
            <div className="flex min-h-screen">
                <AccountantSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<AccountantHome />} />
                        <Route path="/transactions" element={<AccountantManageTransactions />} />
                        <Route path="/meetings" element={<AccountantMeetings />} />
                        <Route path="/notifications" element={<AccountantNotifications />} />
                        <Route path="*" element={<Navigate to="/accountant" replace />} />
                    </Routes>
                </div>
            </div>
        </AccountantProtectedRoute>
    );
};

export default AccountantDashboard; 