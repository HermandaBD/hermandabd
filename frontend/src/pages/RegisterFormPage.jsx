import React from 'react'
import { useForm } from 'react-hook-form'
import { registerAccount } from '../api/auth.api'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function RegisterFormPage() {
    const { register,handleSubmit, formState: {
        errors
    }, setValue} = useForm()

    const navigate = useNavigate();
    const onSubmit = handleSubmit(user => {
        try {
            const success = registerAccount(user);
            if (success) {
                toast.success("Cuenta creada con éxito, ahora activa la cuenta")
                navigate("/"); // TODO mostrar mensaje de que tiene que activar la cuenta comprobando el correo puesto
            }
        } catch (error) {
            toast.error("Ocurrió un error al crear la cuenta: ", error)
            console.error(error);
        }
    });

    return <div className='max-w-xl mx-auto my-5'>
        <form onSubmit={onSubmit}>
            <label htmlFor="first_name">Nombre</label>
            <input type="text" name='first_name' id='first_name' className='bg-zinc-700 p-3 rounded-lg block w-full my-3' placeholder='Nombre'
                {...register('first_name', { required: true, max_length: 100 })} />
            {errors.first_name && <span>Este campo es requerido</span>}
            <label htmlFor="last_name">Apellidos</label>
            <input type="text" name='last_name' id='last_name' className='bg-zinc-700 p-3 rounded-lg block w-full my-3' placeholder='Apellidos'
                {...register('last_name', { required: true, max_length: 100 })} />
            {errors.last_name && <span>Este campo es requerido</span>}
            <label htmlFor="username">Nombre de usuario</label>
            <input type="text" name='username' id='username' className='bg-zinc-700 p-3 rounded-lg block w-full my-3' placeholder='Apellidos'
                {...register('username', { required: true, max_length: 100 })} />
            {errors.username && <span>Este campo es requerido</span>}
            <label htmlFor="email" >Email</label>
            <input type="email" name="email" id="email" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" placeholder="example@example.com"
                {...register('email', { required: true })} />
            {errors.email && <span>Este campo es requirido</span>}
            <label htmlFor="password" >Contraseña</label>
            <input type="password" name="password" id="password" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" placeholder="Contraseña"
                {...register('password', { required: true })} />
            {errors.password && <span>Este campo es requirido</span>}
            <br />
            <button type='submit' className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Crear cuenta</button>
        </form>
    </div>
}
