import React, { useContext, useEffect, useState } from 'react';
import { logout } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";

function Header() {
  const navigate = useNavigate();
  const {logoutAction, isAuthenticated} = useContext(AuthContext);

  const onLogout = () => {
    logout();
    logoutAction();
    navigate('/');
  }

  const onLogin = () => {
    navigate('/login');
  }

  return (
    <header className="bg-red-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="bg-red-800 text-white rounded-full px-2 py-1 mr-2">NUEVO</span>
        <span>COMENZANDO EL DESARROLLO INNOVADOR PARA LA GESTIÓN DE TU HERMANDAD!</span>
      </div>
      {
        isAuthenticated ?
          <button onClick={onLogout}>Logout</button> :
          <button onClick={onLogin}>Login</button>
      }
    </header>
  );
}

export default Header;
