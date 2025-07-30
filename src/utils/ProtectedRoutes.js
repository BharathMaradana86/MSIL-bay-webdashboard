import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/Auth.context';

const ProtectedRoutes = ({ children }) => {
    const { UserCredentials, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner/loading indicator
    }

    if (!UserCredentials) {
        return <Navigate to="/Login" />;
    }

    return children;
};

export default ProtectedRoutes;
