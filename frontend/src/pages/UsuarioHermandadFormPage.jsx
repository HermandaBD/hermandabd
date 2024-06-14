import React, { useEffect, useState } from 'react';
import { getHermandades } from '../api/hermandad.api';
import { modificarUsuario, getUser, getUsers } from '../api/auth.api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export function UsuarioHermandadFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [hermandades, setHermandades] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const hermandadesResponse = await getHermandades();
                setHermandades(hermandadesResponse.data);

                const usuarioResponse = await getUsers();
                setUsuarios(usuarioResponse.data);
            } catch (error) {
                toast.error("Error al cargar los datos.");
                console.error("Error al cargar los datos:", error);
            }
        }

        fetchData();
    }, []);

    const onSubmit = handleSubmit(async formData => {
        try {
            const user = await getUser(formData.user);
            const data = user.data;
            data.hermandad = formData.hermandad;
            data.rol = "GS";
            data.is_staff = true;
            const response = await modificarUsuario(formData.user, data);
            if (response.status === 200) {
                toast.success("Usuario asociado con éxito a la hermandad");
            } else {
                toast.error("Ocurrió un error al asociar");
            }
        } catch (error) {
            toast.error("Ocurrió un error al asociar el usuario.");
            console.error("Error al asociar el usuario:", error);
        }
    });

    return (
        <div className='max-w-xl mx-auto my-5'>
            <h2 className='mb-5 font-bold text-2xl'>Añadir hermandad a usuario</h2>
            <div className='bg-gray-200 p-5 rounded-xl'>
                <form onSubmit={onSubmit}>
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700">Usuario <span className="text-red-500">*</span></label>
                    <select name="user" id="user" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                        {...register('user', { required: "Este campo es requerido" })}>
                        <option value="">---</option>
                        {usuarios.map((usuario) => (
                            <option value={usuario.username} key={usuario.username}>
                                {usuario.email}
                            </option>
                        ))}
                    </select>
                    {errors.user && <span className="text-red-500">{errors.user.message}<br /></span>}

                    <label htmlFor="hermandad" className="block text-sm font-medium text-gray-700">Hermandad <span className="text-red-500">*</span></label>
                    <select name="hermandad" id="hermandad" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                        {...register('hermandad', { required: "Este campo es requerido" })}>
                        <option value="">---</option>
                        {hermandades.map((hermandad) => (
                            <option value={hermandad.id} key={hermandad.id}>
                                {hermandad.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.hermandad && <span className="text-red-500">{errors.hermandad.message}<br /></span>}

                    <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-5">Asociar</button>
                </form>
            </div>
        </div>
    );
}
