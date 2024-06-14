import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPatrimonio, updatePatrimonio, deletePatrimonio, getPatrimonio } from "../../api/patrimonio.api.js";
import { useEffect, useState } from "react";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function PatrimonioFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [showModal, setShowModal] = useState(false);

    const onSubmit = handleSubmit(async data => {
        try {
            let response;
            if (params.id) {
                response = await updatePatrimonio(params.id, data);
            } else {
                response = await createPatrimonio(data);
            }
            navigate("/patrimonios");
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
        async function cargarPatrimonio() {
            if (params.id) {
                const { data } = await getPatrimonio(params.id)
                setValue('nombre', data.nombre)
                setValue('descripcion', data.descripcion)
                setValue('fecha_llegada', data.fecha_llegada)
                setValue('fecha_realizacion', data.fecha_realizacion)
                setValue('valor', data.valor)
                setValue('hermandad', data.hermandad)
            }
        }
        cargarPatrimonio();
    }, [params.id, setValue]);

    return (
        <div className='max-w-5xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">{params.id ? 'Actualizar Patrimonio' : 'Crear Patrimonio'}</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-5xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <input type="hidden" name="hermandad" id="hermandad" {...register('hermandad')} value={hermandad} />
                    <div className='xl:grid grid-cols-12 gap-4'>
                        <div className="col-start-1 col-span-4">
                            <label htmlFor="nombre">Nombre <span className="text-red-500">*</span></label>
                            <input type="text" name="nombre" id="nombre" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('nombre', { required: "Este campo es necesario", maxLength: { value: 100, message: 'Máximo 100 caracteres' } })} />
                            {errors.nombre && <span className="text-red-500">{errors.nombre.message}<br /></span>}
                        </div>

                        <div className="col-start-5 col-span-4">
                            <label htmlFor="descripcion">Descripción <span className="text-red-500">*</span></label>
                            <input type="text" name="descripcion" id="descripcion" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('descripcion', { required: "Este campo es necesario", maxLength: { value: 500, message: 'Máximo 500 caracteres' } })} />
                            {errors.descripcion && <span className="text-red-500">{errors.descripcion.message}<br /></span>}
                        </div>

                        <div className="col-start-9 col-span-4">
                            <label htmlFor="fecha_llegada">Fecha de llegada <span className="text-red-500">*</span></label>
                            <input type="date" name="fecha_llegada" id="fecha_llegada" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('fecha_llegada', { required: "Este campo es necesario" })} />
                            {errors.fecha_llegada && <span className="text-red-500">{errors.fecha_llegada.message}<br /></span>}
                        </div>
                    </div>

                    <div className='xl:grid grid-cols-6 gap-4'>
                        <div className="col-start-1 col-span-3">
                            <label htmlFor="fecha_realizacion">Fecha de realización <span className="text-red-500">*</span></label>
                            <input type="date" name="fecha_realizacion" id="fecha_realizacion" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('fecha_realizacion', { required: "Este campo es necesario" })} />
                            {errors.fecha_realizacion && <span className="text-red-500">{errors.fecha_realizacion.message}<br /></span>}
                        </div>

                        <div className="col-start-4 col-span-3">
                            <label htmlFor="valor">Valor <span className="text-red-500">*</span></label>
                            <input type="number" step="0.01" name="valor" id="valor" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('valor', { required: "Este campo es necesario", min: { value: 0, message: 'Valor mínimo 0' }, max: { value: 9999999999.99, message: 'Valor máximo 9999999999.99' } })} />
                            {errors.valor && <span className="text-red-500">{errors.valor.message}<br /></span>}
                        </div>
                    </div>

                    <div className='xl:grid grid-cols-6 gap-4'>
                        <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3 col-start-1 col-span-1">Confirmar</button>
                        {params.id && <button onClick={async () => {
                            const accepted = window.confirm('¿Estás seguro?');
                            if (accepted) {
                                await deletePatrimonio(params.id);
                                navigate("/patrimonios");
                            }
                        }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3 col-start-6 col-span-1">Eliminar</button>}
                    </div>
                </form>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p>Formulario de creación de patrimonio.<br />
                        Los campos marcados con (<span className="text-red-500">*</span>) son obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
