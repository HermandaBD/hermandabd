import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createInventario, deleteInventario, updateInventario, getInventario } from "../../api/inventario.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function InventarioFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [showModal, setShowModal] = useState(false);

    const onSubmit = handleSubmit(async data => {
        try {
            if (params.id) {
                await updateInventario(params.id, data);
            } else {
                await createInventario(data);
            }
            navigate("/inventarios");
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
        async function cargarInventario() {
            if (params.id) {
                const { data } = await getInventario(params.id);
                setValue('nombre', data.nombre);
                setValue('descripcion', data.descripcion);
                setValue('ubicacion', data.ubicacion);
                setValue('hermandad', data.hermandad);
            }
        }
        cargarInventario();
    }, [params.id, setValue]);

    return (
        <div className='max-w-4xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Gestión de Inventario</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-4xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <input type="hidden" name="hermandad" id="hermandad" {...register('hermandad')} value={hermandad} />
                    <div className='xl:grid grid-cols-6 gap-4'>
                        <div className="col-start-1 col-span-2">
                            <label htmlFor="nombre">Nombre <span className="text-red-500">*</span></label>
                            <input type="text" name="nombre" id="nombre" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('nombre', { required: "Este campo es necesario", maxLength: { value: 100, message: "Máximo 100 caracteres" } })} />
                            {errors.nombre && <span className="text-red-500">{errors.nombre.message}<br /></span>}
                        </div>

                        <div className="col-start-3 col-span-4">
                            <label htmlFor="descripcion">Descripción <span className="text-red-500">*</span></label>
                            <input type="text" name="descripcion" id="descripcion" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('descripcion', { required: "Este campo es necesario", maxLength: { value: 500, message: "Máximo 500 caracteres" } })} />
                            {errors.descripcion && <span className="text-red-500">{errors.descripcion.message}<br /></span>}
                        </div>
                    </div>
                    <div className='xl:grid grid-cols-12 gap-4'>
                        <div className="col-start-1 col-span-4">
                            <label htmlFor="ubicacion">Ubicación <span className="text-red-500">*</span></label>
                            <input type="text" name="ubicacion" id="ubicacion" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('ubicacion', { required: "Este campo es necesario", maxLength: { value: 200, message: "Máximo 200 caracteres" } })} />
                            {errors.ubicacion && <span className="text-red-500">{errors.ubicacion.message}<br /></span>}
                        </div>
                    </div>

                    <div className='xl:grid grid-cols-12 gap-4'>
                        <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3 col-start-1 col-span-3">Guardar Inventario</button>
                        {params.id && <button onClick={async () => {
                            const accepted = window.confirm('¿Estás seguro?')
                            if (accepted) {
                                await deleteInventario(params.id);
                                navigate("/inventarios");
                            }
                        }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3 col-start-10 col-span-3">Eliminar</button>}
                    </div>
                </form>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p>Formulario de gestión del inventario. <br />
                        Los asteriscos (<span className="text-red-500">*</span>) indican campos obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
