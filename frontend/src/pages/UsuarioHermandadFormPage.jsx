import React, { useEffect, useState } from 'react'
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
            const hermandadesResponse = await getHermandades();
            setHermandades(hermandadesResponse.data);

            const usuarioResponse = await getUsers();
            setUsuarios(usuarioResponse.data);
        }

        fetchData();
    }, []);

    const onSubmit = handleSubmit(async formData => {
        const user = await getUser(formData.user);
        const data = user.data;
        data.hermandad = formData.hermandad;
        data.rol = "GS";
        data.is_staff = true;
        const response = await modificarUsuario(formData.user, data);
        if (response.status == 200){
            toast.success("Usuario asociado con éxito a la hermandad");
        } else {
            toast.error("Ocurrió un error al asociar");
        }
    });

    return <div className='max-w-xl mx-auto my-5'>
        <h2 className='mb-5 font-bold'>Añadir hermandad a usuario</h2>
        <form onSubmit={onSubmit}>
            <label htmlFor="user">Usuario</label>
            <select name="user" id="user" className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                {...register('user',{required: true})}>
                <option value="">---</option>
                {usuarios.map((usuario) => (
                    <option value={usuario.username} key={usuario.username}>
                        {usuario.email}
                    </option>
                ))
                }
            </select>
            {errors.user && <span>{errors.user.message}<br /></span> }
            <label htmlFor="">Hermandad</label>
            <select name="hermandad" id="hermandad" className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                {...register('hermandad',{required: true})} >
                <option value="">---</option>
                {hermandades.map((hermandad) => (
                    <option value={hermandad.id} key={hermandad.id}>
                        {hermandad.nombre}
                    </option>
                ))}
            </select>
            {errors.hermandad && <span>{errors.hermandad.message}<br /></span> }
            <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-5">Asociar</button>
        </form>
    </div>
}
