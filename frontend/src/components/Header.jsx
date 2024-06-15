import React, { useContext } from 'react';
import { logout } from '../api/auth.api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import profileImage from '../../utils/logo.png';
import PersonIcon from '@mui/icons-material/Person';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutAction, isAuthenticated, hermandadUsuario, rol } = useContext(AuthContext);

  const onLogout = () => {
    logout();
    logoutAction();
    navigate('/');
  };

  const onLogin = () => {
    navigate('/login');
  };

  const linkClass = (path) => {
    let search = location.pathname;
    let isLink = path.some(element => search.includes(element));
    return isLink
      ? "font-bold text-white hover:text-gray-300"
      : "font-normal text-white hover:text-gray-300";
  };

  return (
    <header className="bg-burdeos flex items-center justify-between p-4 font-roboto">
      {isAuthenticated ? (hermandadUsuario != "null" ?
        (<>
          <div className="flex items-center space-x-4">
            <img src={profileImage} alt="Hermandad" className="h-10 w-10 rounded-full" />
            <nav className="flex space-x-4">
              <Link to="/hermano/menu" className={linkClass(["hermano"])}>Hermanos</Link>
              <Link to="/pago/menu" className={linkClass(["pago","papeleta"])}>Mayordomía</Link>
              <Link to="/archivo" className={linkClass(["archivo", "inventario", "patrimonio"])}>Archivo</Link>
              <Link to="/documento/menu" className={linkClass(["documento", "etiqueta"])}>Documentos</Link>
              <Link to="/eventos" className={linkClass(["evento"])}>Eventos</Link>
              {rol == 'GS' ?
                <Link to="/users" className={linkClass(["user"])}>Usuarios</Link>
                : <></>
              }
            </nav>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center bg-white text-black hover:text-gray-600 rounded-full px-4 py-2 shadow">
              <PersonIcon />
              <span className="ml-2">Usuario</span>
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  <Link
                    to="/me"
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                  >
                    Perfil
                  </Link>

                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => onLogout()}
                    className="bg-gray-100 flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left"
                  >
                    Cerrar sesión
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <img src={profileImage} alt="Hermandad" className="h-10 w-10 rounded-full" />
            </div>
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="flex items-center bg-white text-black hover:text-gray-600 rounded-full px-4 py-2 shadow">
                <PersonIcon />
                <span className="ml-2">Usuario</span>
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <MenuItem>
                    <Link
                      to="/me"
                      className="flex data-[focus]:bg-gray-300 items-center px-4 py-2 text-sm text-gray-700"
                    >
                      Perfil
                    </Link>

                  </MenuItem>
                  <MenuItem>
                    <Link
                      onClick={() => onLogout()}
                      className="flex data-[focus]:bg-gray-300 items-center px-4 py-2 text-sm text-gray-700"
                    >
                      Cerrar sesión
                    </Link>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </>)
      ) : (
        <>
          <div className="flex items-center">
            <span className="bg-white text-black rounded-full px-2 py-1 mr-2">HERMANDADBD</span>
            <span>COMENZANDO EL DESARROLLO INNOVADOR PARA LA GESTIÓN DE TU HERMANDAD!</span>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center bg-white text-black hover:text-gray-600 rounded-full px-4 py-2 shadow">
              {/* <PersonIcon /> */}
              <span className="ml-2">Identificarse</span>
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  <Link
                    to="/login"
                    className="flex data-[focus]:bg-gray-300 items-center px-4 py-2 text-sm text-gray-700"
                  >
                    Iniciar sesión
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/register" className="flex data-[focus]:bg-gray-300 items-center px-4 py-2 text-sm text-gray-700">
                    Registrarse
                  </Link>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </>
      )}
    </header>
  );
}
