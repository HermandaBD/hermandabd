import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element }) => {
  const authToken = localStorage.getItem('auth_token');
  
  return authToken ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;