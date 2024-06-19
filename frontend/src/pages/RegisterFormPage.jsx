import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerAccount } from '../api/auth.api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../components/Modal";

export function RegisterFormPage() {
    const { register, handleSubmit, formState: { errors }, watch, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const [showModal, setShowModal] = useState(false);
    const onSubmit = handleSubmit(async user => {
        try {
            if (params.id) {
                user.hermandad = params.id;
            }
            const success = await registerAccount(user);
            if (success.status === 201) {
                toast.success("Cuenta creada con éxito, ahora activa la cuenta");
                navigate("/"); // TODO mostrar mensaje de que tiene que activar la cuenta comprobando el correo puesto
            }
        } catch (error) {
            console.log("tiene que llegar");
            if (error.response && error.response.status === 400) {
                console.log("aquí");
                const errors = error.response.data;
                Object.entries(errors).forEach(([field, message]) => {
                    setError(field, { type: "manual", message: message });
                    toast.error(message);
                });
            } else {
                console.log("allí");
                console.error("Error inesperado:", error);
                toast.error("Error inesperado, por favor intenta nuevamente.");
            }
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
        <div className='max-w-5xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Crear Cuenta</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-5xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <div className='xl:grid grid-cols-6 gap-4'>
                        <div className="col-start-1 col-span-3">
                            <label htmlFor="first_name">Nombre <span className="text-red-500">*</span></label>
                            <input type="text" name='first_name' id='first_name' className='border-2 border-black p-3 rounded-lg block w-full my-3' placeholder='Nombre'
                                {...register('first_name', { required: "Este campo es requerido", maxLength: 100 })} />
                            {errors.first_name && <span className="text-red-500">{errors.first_name.message}<br /></span>}
                        </div>

                        <div className="col-start-4 col-span-3">
                            <label htmlFor="last_name">Apellidos <span className="text-red-500">*</span></label>
                            <input type="text" name='last_name' id='last_name' className='border-2 border-black p-3 rounded-lg block w-full my-3' placeholder='Apellidos'
                                {...register('last_name', { required: "Este campo es requerido", maxLength: 100 })} />
                            {errors.last_name && <span className="text-red-500">{errors.last_name.message}<br /></span>}
                        </div>

                        <div className="col-start-1 col-span-3">
                            <label htmlFor="username">Nombre de usuario <span className="text-red-500">*</span></label>
                            <input type="text" name='username' id='username' className='border-2 border-black p-3 rounded-lg block w-full my-3' placeholder='Username'
                                {...register('username', { required: "Este campo es requerido", maxLength: 100 })} />
                            {errors.username && <span className="text-red-500">{errors.username.message}<br /></span>}
                        </div>

                        <div className="col-start-4 col-span-3">
                            <label htmlFor="email">Email <span className="text-red-500">*</span></label>
                            <input type="email" name="email" id="email" className="border-2 border-black p-3 rounded-lg block w-full my-3" placeholder="example@example.com"
                                {...register('email', { required: "Este campo es requerido" })} />
                            {errors.email && <span className="text-red-500">{errors.email.message}<br /></span>}
                        </div>

                        <div className="col-start-1 col-span-3">
                            <label htmlFor="password">Contraseña <span className="text-red-500">*</span></label>
                            <input type="password" name="password" id="password" className="border-2 border-black p-3 rounded-lg block w-full my-3" placeholder="Contraseña"
                                {...register('password', {
                                    required: "Este campo es requerido",
                                    validate: validatePassword
                                })} />
                            {errors.password && <span className="text-red-500">{errors.password.message} <br /></span>}
                        </div>

                        <div className="col-start-4 col-span-3">
                            <label htmlFor="password_repeat">Repetir Contraseña <span className="text-red-500">*</span></label>
                            <input type="password" name="password_repeat" id="password_repeat" className="border-2 border-black p-3 rounded-lg block w-full my-3" placeholder="Repetir Contraseña"
                                {...register('password_repeat', {
                                    required: "Este campo es requerido",
                                    validate: value => value === password || "Las contraseñas no coinciden"
                                })} />
                            {errors.password_repeat && <span className="text-red-500">{errors.password_repeat.message}<br /></span>}
                        </div>
                    </div>

                    <div className='xl:grid grid-cols-6 gap-4'>
                        <button type='submit' className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3 col-start-1 col-span-1">Crear cuenta</button>
                    </div>
                </form>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p>Formulario de registro.<br />
                        Los campos marcados con (<span className="text-red-500">*</span>) son obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
