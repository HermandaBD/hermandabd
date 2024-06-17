import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { NoHermandad } from '../pages/NoHermandad';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element: Element }) => {
  const authToken = localStorage.getItem('auth_token');
  const hermandad_usuario = localStorage.getItem('hermandad_usuario');
  const { isSuperuser } = useContext(AuthContext);
  if (!isSuperuser){
    return authToken ? (hermandad_usuario != "null"?<Element />:<NoHermandad/>) : <Navigate to="/login" />;
  }else{
    return <Element />
  }
};

export default PrivateRoute;