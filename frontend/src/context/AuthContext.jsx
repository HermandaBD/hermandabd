import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hermandadUsuario, setHermandadUsuario] = useState(null);
    const [isStaff, setIsStaff] = useState(false);
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [rol, setRol] = useState(''); // GS (Gestor), SE (Secretario), MA (Mayordomo)
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
        if (staff == "true") {
            setIsStaff(true);
        }
        const superuser = localStorage.getItem('superuser');
        if (superuser == "true") {
            setIsSuperuser(true);
        }
        const userRol = localStorage.getItem('user_rol');
        if (userRol) {
            setRol(userRol)
        }
    }, []);

    const loginAction = () => {
        setIsAuthenticated(true);
    };

    const logoutAction = () => {
        setIsAuthenticated(false);
        setHermandadUsuario(null);
        setIsStaff(false);
        setRol('');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, hermandadUsuario, isStaff, isSuperuser, rol, loginAction, logoutAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };