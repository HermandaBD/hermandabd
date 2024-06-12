import React, { useContext, useEffect, useState } from 'react';
import { getUser, getUsers, modificarUsuario } from '../api/auth.api'; // Asume que tienes esta función en tu API
import { AuthContext } from '../context/AuthContext';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';

export function Usuarios() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState({});
    const { rol } = useContext(AuthContext);

    useEffect(() => {
        async function getUsuarios() {
            const response = await getUsers();
            setUsers(response.data);
            const initialRoles = response.data.reduce((acc, user) => {
                acc[user.id] = user.rol || '';
                return acc;
            }, {});
            setRoles(initialRoles);
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

    if (rol === 'GS') { // Si es gestor que pueda ver todos los usuarios de su hermandad y editar roles
        return (
            <div className="mx-10 mt-10">
                {users.map(user => (
                    <div key={user.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
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
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={() => handleSubmit(user.username)}
                            className="mt-2"
                        >
                            Actualizar Rol
                        </Button>
                    </div>
                ))}
            </div>
        );
    }

    return <div>No tiene permisos para ver esta página.</div>;
}