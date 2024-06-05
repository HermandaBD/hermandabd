import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate,useParams } from "react-router-dom";
import { login } from "../api/auth.api.js" 
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";

export function LoginPage() {
    const { register,handleSubmit, formState: {
        errors
    }, setValue} = useForm()
    const navigate = useNavigate()
    const params = useParams()
    const { loginAction } = useContext(AuthContext);

    const onSubmit = handleSubmit(async data => {
        try {
            const response = await login(data);
            toast.success("Sesión iniciada");
            loginAction();
            navigate('/me');
        } catch (error) {
            console.error("Login failed:", error);
        }
    })
    return (
        <div className='max-w-xl mx-auto my-5'>
            <form onSubmit={onSubmit}>
                <label htmlFor="email" >Email</label>
                <input type="email" name="email" id="email" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" placeholder="example@example.com" 
                {...register('email', { required: true })} />
                {errors.email && <span>This field is required</span>}
                <label htmlFor="password" >Contraseña</label>
                <input type="password" name="password" id="password" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" placeholder="Contraseña"
                {...register('password', { required: true })} />
                {errors.password && <span>This field is required</span>}
                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Iniciar Sesión</button>
            </form>
        </div>
    )
}
