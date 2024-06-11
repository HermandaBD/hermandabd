import React from 'react';
import { Navigate } from 'react-router-dom';
import { NoAdmin } from '../pages/NoAdmin';

export const AdminRoute = ({ element: Element }) => {
  const authToken = localStorage.getItem('auth_token');
  const staff = (localStorage.getItem('staff')=== 'true');
  
  return authToken ? (staff?<Element />:<NoAdmin/>) : <Navigate to="/login" />;
};
