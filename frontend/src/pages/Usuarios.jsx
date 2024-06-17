import React, { useContext, useEffect, useState } from 'react';
import { getUser, getUsers, modificarUsuario } from '../api/auth.api'; // Asume que tienes esta función en tu API
import { AuthContext } from '../context/AuthContext';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { Warning } from "@mui/icons-material";
import { toast } from 'react-toastify';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from '../components/Modal';

export function Usuarios() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState({});
    const { rol, isSuperuser } = useContext(AuthContext);
    const [userLogin, setUserLogin] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [hermandad, setHermandad] = useState('');
    useEffect(() => {
        async function getUsuarios() {
            const response = await getUsers();
            setUsers(response.data);
            const initialRoles = response.data.reduce((acc, user) => {
                acc[user.id] = user.rol || '';
                return acc;
            }, {});
            setRoles(initialRoles);
            let usersLogin = localStorage.getItem('user');
            const jsonObject = JSON.parse(usersLogin);
            const valuesArray = Object.values(jsonObject);
            setUserLogin(valuesArray[1]);
            setHermandad(localStorage.getItem('hermandad_usuario'));
        }
        getUsuarios();
    }, []);

    const handleRoleChange = (userId, newRole) => {
        setRoles({
            ...roles,
            [userId]: newRole,
        });
    };

    const handleSubmit = async (username) => {
        try {
            const user = await getUser(username);
            const data = user.data;
            data.rol = roles[data.id];
            const response = await modificarUsuario(username, data);
            if (response.status == 200) {
                toast.success('Rol modificado con éxito');
            } else {
                toast.error('No se pudo modificar el Rol del usuario');
            }
        } catch (error) {
            console.error('Error actualizando rol del usuario:', error);
        }
    };

    const handleDeleteAccess = async (username) => {
        try {
            const user = await getUser(username);
            const data = user.data;
            data.rol = '';
            data.hermandad = null;
            const response = await modificarUsuario(username, data);
            if (response.status == 200) {
                toast.success("Acceso eliminado con éxito");
            } else {
                toast.error("No se puedo eliminar el acceso");
            }
        } catch (error) {
            console.error('Error al eliminar el acceso al usuario: ', error);
        }
    }

    if (rol === 'GS' || isSuperuser) { // Si es gestor que pueda ver todos los usuarios de su hermandad y editar roles
        return (
            <div className="mx-auto mt-10 max-w-lg">
                <div className="flex justify-between pr-5">
                    <h1 className="text-2xl font-bold mb-5">Listado de Usuarios y permisos</h1>
                
                    <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer" />
                </div>
                {users.map(user => (
                    <div key={user.id} className="bg-white shadow-md rounded-lg p-4 mb-4 outline-gray-700 outline">
                        <p className="text-lg text-black font-semibold">{user.first_name} {user.last_name}</p>
                        <p className="text-gray-600 mb-5">{user.email} <br /></p>
                        <FormControl fullWidth className="my-2">
                            <InputLabel id={`rol-label-${user.id}`}>Rol</InputLabel>
                            <Select
                                labelId={`rol-label-${user.id}`}
                                id={`rol-${user.id}`}
                                value={roles[user.id] || user.rol}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            >
                                <MenuItem value="">---</MenuItem>
                                <MenuItem value="GS">Gestor</MenuItem>
                                <MenuItem value="SE">Secretario</MenuItem>
                                <MenuItem value="MA">Mayordomo</MenuItem>
                            </Select>
                        </FormControl>
                        <div className='grid grid-cols-6 gap-4 p-2'>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={() => handleSubmit(user.username)}
                                className="mt-2 col-start-1 col-span-3"
                                disabled={user.email === userLogin}
                            >
                                Actualizar Rol
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                startIcon={<Warning />}
                                onClick={() => handleDeleteAccess(user.username)}
                                className="mt-2 col-start-4 col-span-3"
                                disabled={user.email === userLogin}
                            >
                                Eliminar acceso
                            </Button>
                        </div>
                    </div>
                ))}
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p>
                        Para invitar a un nuevo usuario envía el siguiente link: <br />
                        /register/{hermandad}
                    </p>
                </div>
            </Modal>
            </div>
        );
    }

    return <div>No tiene permisos para ver esta página.</div>;
}