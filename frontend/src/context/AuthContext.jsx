import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hermandadUsuario, setHermandadUsuario] = useState(null);
    const [isStaff, setIsStaff] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            setIsAuthenticated(true);
        }
        const hermandad = localStorage.getItem('hermandad_usuario');
        if (hermandad) {
            setHermandadUsuario(hermandad);
        }
        const staff = localStorage.getItem('staff');
        if (staff) {
            setIsStaff(true);
        }
        console.log("se ejecuta");
    }, []);

    const loginAction = () => {
        setIsAuthenticated(true);
    };

    const logoutAction = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, hermandadUsuario, isStaff, loginAction, logoutAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };