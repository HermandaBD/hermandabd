import React, { useContext } from 'react';
import { logout } from '../api/auth.api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import profileImage from '../../utils/logo.png'; // Asegúrate de tener la imagen de perfil en tu proyecto
import PersonIcon from '@mui/icons-material/Person'; // Importa el ícono de Material

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutAction, isAuthenticated } = useContext(AuthContext);

  const onLogout = () => {
    logout();
    logoutAction();
    navigate('/');
  };

  const onLogin = () => {
    navigate('/login');
  };

  const linkClass = (path) => {
    return location.pathname === path
      ? "font-bold text-white"
      : "font-normal text-white hover:text-gray-300";
  };

  return (
    <header className="bg-burdeos flex items-center justify-between p-4 font-roboto">
      {isAuthenticated ? (
        <>
          <div className="flex items-center space-x-4">
            <img src={profileImage} alt="Hermandad" className="h-10 w-10 rounded-full" />
            <nav className="flex space-x-4">
              <Link to="/hermanos" className={linkClass("/hermanos")}>Hermanos</Link>
              <Link to="/pagos" className={linkClass("/pagos")}>Mayordomía</Link>
              <Link to="/inventarios" className={linkClass("/inventarios")}>Archivo</Link>
              <Link to="/documentos" className={linkClass("/documentos")}>Documentos</Link>
            </nav>
          </div>
          <Link to="/perfil" className="flex items-center bg-white text-black hover:text-gray-600 rounded-full px-4 py-2 shadow">
            <PersonIcon />
            <span className="ml-2">Usuario</span>
          </Link>
        </>
      ) : (
        <div className="white text-black p-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-white text-black rounded-full px-2 py-1 mr-2">HERMANDADBD</span>
            <span>COMENZANDO EL DESARROLLO INNOVADOR PARA LA GESTIÓN DE TU HERMANDAD!</span>
          </div>
        </div>
      )}
    </header>
  );
}
