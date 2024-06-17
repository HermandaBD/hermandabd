import React from 'react';
import { Navigate } from 'react-router-dom';
import { NoAdmin } from '../pages/NoAdmin';

export const AdminRoute = ({ element: Element }) => {
  const authToken = localStorage.getItem('auth_token');
  const superuser = (localStorage.getItem('superuser')=== 'true');
  
  return authToken ? (superuser?<Element />:<NoAdmin/>) : <Navigate to="/login" />;
};
