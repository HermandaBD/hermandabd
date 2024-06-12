import React from 'react';
import { useForm } from 'react-hook-form';
import { registerAccount } from '../api/auth.api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export function RegisterFormPage() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const onSubmit = handleSubmit(async user => {
        try {
            if (params.id){
                user.hermandad = params.id
            }
            const success = await registerAccount(user);
            if (success.status == 201) {
                toast.success("Cuenta creada con éxito, ahora activa la cuenta");
                navigate("/"); // TODO mostrar mensaje de que tiene que activar la cuenta comprobando el correo puesto
            }
        } catch (error) {
            toast.error("Ocurrió un error al crear la cuenta: ", error.message);
            console.error(error);
        }
    });

    const validatePassword = (value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasValidLength = value.length > 8;
        if (!hasUpperCase) {
            return "La contraseña debe tener al menos una letra mayúscula.";
        }
        if (!hasValidLength) {
            return "La contraseña debe tener más de 8 caracteres.";
        }
        return true;
    };

    const password = watch("password", "");

    return (
        <div className='max-w-xl mx-auto my-5'>
            <form onSubmit={onSubmit}>
                <label htmlFor="first_name">Nombre</label>
                <input type="text" name='first_name' id='first_name' className='bg-zinc-700 p-3 rounded-lg block w-full my-3' placeholder='Nombre'
                    {...register('first_name', { required: true, maxLength: 100 })} />
                {errors.first_name && <span>Este campo es requerido<br /></span>}
                
                <label htmlFor="last_name">Apellidos</label>
                <input type="text" name='last_name' id='last_name' className='bg-zinc-700 p-3 rounded-lg block w-full my-3' placeholder='Apellidos'
                    {...register('last_name', { required: true, maxLength: 100 })} />
                {errors.last_name && <span>Este campo es requerido<br /></span>}
                
                <label htmlFor="username">Nombre de usuario</label>
                <input type="text" name='username' id='username' className='bg-zinc-700 p-3 rounded-lg block w-full my-3' placeholder='Username'
                    {...register('username', { required: true, maxLength: 100 })} />
                {errors.username && <span>Este campo es requerido<br /></span>}
                
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" placeholder="example@example.com"
                    {...register('email', { required: true })} />
                {errors.email && <span>Este campo es requerido<br /></span>}
                
                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password" id="password" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" placeholder="Contraseña"
                    {...register('password', { 
                        required: "Este campo es requerido", 
                        validate: validatePassword 
                    })} />
                {errors.password && <span className='text-red-500'>{errors.password.message} <br /></span>}
                
                <label htmlFor="password_repeat">Repetir Contraseña</label>
                <input type="password" name="password_repeat" id="password_repeat" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" placeholder="Repetir Contraseña"
                    {...register('password_repeat', { 
                        required: "Este campo es requerido", 
                        validate: value => value === password || "Las contraseñas no coinciden" 
                    })} />
                {errors.password_repeat && <span>{errors.password_repeat.message}</span>}
                
                <br />
                <button type='submit' className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Crear cuenta</button>
            </form>
        </div>
    );
}
