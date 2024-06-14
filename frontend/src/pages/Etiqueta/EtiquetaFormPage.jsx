import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createEtiqueta, updateEtiqueta, deleteEtiqueta, getEtiqueta } from "../../api/etiqueta.api.js";
import { useEffect, useState } from "react";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function EtiquetaFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [showModal, setShowModal] = useState(false);

    const onSubmit = handleSubmit(async data => {
        try {
            let response;
            if (params.id) {
                response = await updateEtiqueta(params.id, data);
            } else {
                response = await createEtiqueta(data);
            }
            navigate("/etiquetas");
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

    useEffect(() => {
        async function cargarEtiqueta() {
            if (params.id) {
                const { data } = await getEtiqueta(params.id);
                setValue('nombre', data.nombre);
                setValue('descripcion', data.descripcion);
                setValue('hermandad', data.hermandad);
                setValue('color', data.color);
            }
        }
        cargarEtiqueta();
    }, [params.id, setValue]);

    return (
        <div className='max-w-2xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Crear etiqueta</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-2xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <div className='xl:grid grid-cols-12 gap-4'>
                        <div className="col-start-1 col-span-4">

                            <label htmlFor="nombre">Nombre<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Nombre de la etiqueta"
                                {...register('nombre', { required: "Campo requerido", maxLength: {value:100, message:"Máximo 100 caracteres"} })}
                            />
                            {errors.nombre && <span className="text-red-500">{errors.nombre.message} <br /></span>}
                        </div>
                        <div className="col-start-5 col-span-8">
                            <label htmlFor="descripcion">Descripción<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="descripcion"
                                id="descripcion"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Descripción de la etiqueta"
                                {...register('descripcion', { required: "Campo requerido", maxLength: {value:200, message: "Máximo 200 caracteres"} })}
                            />
                            {errors.descripcion && <span className="text-red-500">{errors.descripcion.message} <br /></span>}
                        </div>
                    </div>
                    <div className='xl:grid grid-cols-12 gap-4'>
                        <div className="col-start-1 col-span-4">
                            <label htmlFor="color">Color<span className="text-red-500">*</span></label>
                            <input
                                type="color"
                                name="color"
                                id="color"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('color', { required: "Campo requerido" })}
                            />
                            {errors.color && <span className="text-red-500">{errors.color.message} <br /></span>}
                        </div>
                    </div>
                    <input type="hidden" id="hermandad" name="hermandad" value={hermandad} {...register('hermandad')} />
                    <div className='xl:grid grid-cols-12 gap-4'>
                        <div className="col-start-1 col-span-4">
                            <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3">Guardar Etiqueta</button>
                        </div>
                        <div className="col-start-10 col-span-3">
                            {params.id && (
                                <button onClick={async () => {
                                    const accepted = window.confirm('¿Estás seguro?');
                                    if (accepted) {
                                        await deleteEtiqueta(params.id);
                                        navigate("/etiquetas");
                                    }
                                }} className="bg-red-500 text-white font-bold p-3 rounded-lg block w-full mt-3">
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>

                </form>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p> Formulario de creación de etiqueta. <br />
                        Los asteriscos (<span className="text-red-500">*</span>) indican campos obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
