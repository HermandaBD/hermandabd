import React from 'react';
import { Navigate } from 'react-router-dom';
import { NoHermandad } from '../pages/NoHermandad';

const PrivateRoute = ({ element: Element }) => {
  const authToken = localStorage.getItem('auth_token');
  const hermandad_usuario = localStorage.getItem('hermandad_usuario');
  
  return authToken ? (hermandad_usuario != "null"?<Element />:<NoHermandad/>) : <Navigate to="/login" />;
};

export default PrivateRoute;