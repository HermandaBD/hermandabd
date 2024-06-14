import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { login } from "../api/auth.api.js";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../components/Modal";

export function LoginPage() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();
    const { loginAction } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    const onSubmit = handleSubmit(async data => {
        try {
            await login(data);
            toast.success("Sesión iniciada");
            loginAction();
            navigate('/me');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message;
                setError("email", { type: "manual", message: errorMessage });
                setError("password", { type: "manual", message: errorMessage });
                toast.error(errorMessage);
            } else {
                console.error("Login failed:", error);
                toast.error("Error inesperado, por favor intenta nuevamente.");
            }
        }
    });

    return (
        <div className='max-w-xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Iniciar Sesión</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <div className=''>
                        <div className="">
                            <label htmlFor="email">Email <span className="text-red-500">*</span></label>
                            <input type="email" name="email" id="email" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="example@example.com"
                                {...register('email', { required: "Este campo es necesario" })} />
                            {errors.email && <span className="text-red-500">{errors.email.message}<br /></span>}
                        </div>

                        <div className="col-start-4 col-span-3">
                            <label htmlFor="password">Contraseña <span className="text-red-500">*</span></label>
                            <input type="password" name="password" id="password" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Contraseña"
                                {...register('password', { required: "Este campo es necesario" })} />
                            {errors.password && <span className="text-red-500">{errors.password.message}<br /></span>}
                        </div>
                    </div>

                    <div className='xl:grid grid-cols-6 gap-4'>
                        <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3 col-start-1 col-span-full">Iniciar Sesión</button>
                    </div>
                </form>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p>Formulario de inicio de sesión.<br />
                        Los campos marcados con (<span className="text-red-500">*</span>) son obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
