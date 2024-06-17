import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createHermandad, deleteHermandad, updateHermandad, getHermandad } from "../../api/hermandad.api"
import { useEffect } from "react";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function HermandadFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();

    const onSubmit = handleSubmit(async data => {
        try {
            let response;
            if (params.id) {
                response = await updateHermandad(params.id, data)
            } else {
                response = await createHermandad(data);
            }
            navigate("/hermandades");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data;
                Object.entries(errors).forEach(([field, message]) => {
                    setError(field, { type: "manual", message: message });
                    toast.error(message);
                });
            } else {
                console.error("Error inesperado:", error);
                toast.error("Error inesperado, por favor intenta nuevamente.");
            }
        }
    });

    useEffect(() => { //RUD
        async function cargarHermandad() {
            if (params.id) {
                const { data } = await getHermandad(params.id)

                setValue('nombre', data.nombre)
                setValue('descripcion', data.descripcion)
                setValue('poblacion', data.poblacion)
                setValue('cif', data.cif)
                setValue('email', data.email)
                setValue('telefono', data.telefono)
            }
        }
        cargarHermandad();
    }, [])

    return (
        <div className='max-w-5xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Creación de Hermandad</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-5xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <div className='xl:grid grid-cols-6 gap-4'>
                        <div className="col-start-1 col-span-3">
                            <label htmlFor="nombre">Nombre<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Nombre de la hermandad"
                                {...register('nombre', { required: "Este campo es necesario" })}
                            />
                            {errors.nombre && <span className="text-red-500">{errors.nombre.message} <br /></span>}
                        </div>
                        <div className="col-start-4 col-span-3">
                            <label htmlFor="descripcion">Descripción<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="descripcion"
                                id="descripcion"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Descripción"
                                {...register('descripcion', { required: "Este campo es necesario" })}
                            />
                            {errors.descripcion && <span className="text-red-500">{errors.descripcion.message} <br /> </span>}

                        </div>
                    </div>
                    <div className='xl:grid grid-cols-6 gap-4'>
                        <div className="col-start-1 col-span-3">
                            <label htmlFor="poblacion">Población<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="poblacion"
                                id="poblacion"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Población"
                                {...register('poblacion', { required: "Este campo es necesario" })}
                            />
                            {errors.poblacion && <span className="text-red-500">{errors.poblacion.message} <br /></span>}
                        </div>
                        <div className="col-start-4 col-span-3">
                            <label htmlFor="cif">CIF<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="cif"
                                id="cif"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="CIF"
                                {...register('cif', { required: "Este campo es necesario", maxLength: {value:9, message:"CIF no válido"} })}
                            />
                            {errors.cif && <span className="text-red-500">{errors.cif.message} <br /></span>}
                        </div>
                    </div>
                    <div className='xl:grid grid-cols-6 gap-4'>
                        <div className="col-start-1 col-span-3">
                            <label htmlFor="email">Email<span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="example@example.com"
                                {...register('email', { required: "Este campo es necesario" })}
                            />
                            {errors.email && <span className="text-red-500">{errors.email.message} <br /></span>}
                        </div>

                        <div className="col-start-4 col-span-3">
                            <label htmlFor="telefono">Teléfono<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="telefono"
                                id="telefono"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Teléfono"
                                {...register('telefono', { required: "Este campo es necesario", maxLength: {value:12, message: "Teléfono no válido"} })}
                            />
                            {errors.telefono && <span className="text-red-500">{errors.telefono.message}</span>}
                        </div>
                    </div>
                    <div className='xl:grid grid-cols-12 gap-4'>
                        <div className="col-start-1 col-span-3">
                            <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3">Guardar Hermandad</button>
                        </div>
                        <div className="col-start-10 col-span-3">
                            {params.id && <button onClick={async () => {
                                const accepted = window.confirm('¿Estás seguro?')
                                if (accepted) {
                                    await deleteHermandad(params.id);
                                    navigate("/hermandades");
                                }
                            }} className="bg-red-500 font-bold text-white p-3 rounded-lg block w-full mt-3">Eliminar</button>}
                        </div>
                    </div>


                </form>
            </div>
        </div>
    );
}

