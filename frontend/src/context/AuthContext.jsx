import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const loginAction = () => {
        setIsAuthenticated(true);
    };

    const logoutAction = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loginAction, logoutAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };