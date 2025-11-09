import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils';

const RequireAuth = ({ children }) => {
    const location = useLocation();
    if (isAuthenticated()) {
        return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
