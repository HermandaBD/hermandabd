import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createEvento, getEvento, updateEvento, deleteEvento } from "../../api/evento.api.js";
import { useEffect, useState } from "react";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function EventoFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [showModal, setShowModal] = useState(false);
    const onSubmit = handleSubmit(async data => {
        try {
            let response;

            if (params.id) {
                response = await updateEvento(params.id, data)
                toast.success("Evento modificado con éxito");
            } else {
                response = await createEvento(data);
                toast.success("Evento creado con éxito");
            }
            navigate("/eventos");
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

    const formatDatetimeLocal = (datetime) => {
        const date = new Date(datetime);
        const pad = (num) => num.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => { //RUD
        async function cargarEvento() {
            if (params.id) {
                const { data } = await getEvento(params.id);
                setValue('title', data.title);
                setValue('start', formatDatetimeLocal(data.start));
                setValue('end', formatDatetimeLocal(data.end));
                setValue('hermandad', data.hermandad);
            }
        }
        cargarEvento();
    }, []);

    return (
        <div className='max-w-2xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Creación de evento</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-2xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <input type="hidden" name="hermandad" id="hermandad" {...register('hermandad')} value={hermandad} />
                    <div className='xl:grid grid-cols-6 gap-4'>
                        <div className="col-start-1 col-span-full">
                            <label htmlFor="title">Descripción <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Descripción del evento"
                                {...register('title', { required: "Este campo es requerido", maxLength: {value:100, message:"No puede tener más de 100 caracteres"} })}
                            />
                            {errors.title && <span className="text-red-500">{errors.title.message} <br /> </span>}
                        </div>
                    </div>
                    <div className="xl:grid grid-cols-6 gap-4">
                        <div className="col-start-1 col-span-2">
                            <label htmlFor="start">Fecha de inicio<span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                name="start"
                                id="start"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('start', { required: "Este campo es requerido" })}
                            />
                            {errors.start && <span className="text-red-500">{errors.start.message} <br /></span>}
                        </div>
                        <div className="col-start-3 col-span-2">
                            <label htmlFor="end">Fecha de fin <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                name="end"
                                id="end"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('end', { required: "Este campo es requerido" })}
                            />
                            {errors.end && <span className="text-red-500">{errors.end.message}</span>}
                        </div>
                    </div>

                    <div className="xl:grid grid-cols-6 gap-4">
                        <div className="col-start-1 col-span-2">
                            <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3">Guardar Evento</button>
                        </div>
                        <div className="col-start-5 col-span-2">
                            {params.id && <button onClick={async () => {
                                const accepted = window.confirm('¿Estás seguro?')
                                if (accepted) {
                                    await deleteEvento(params.id);
                                    navigate("/eventos");
                                }
                            }} className="bg-red-500 font-bold text-white p-3 rounded-lg block w-full mt-3">Eliminar</button>}
                        </div>
                    </div>

                </form>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p> Formulario de creación de nuevo evento. <br />
                        Recomendamos títulos cortos para su correcta visualización en el calendario <br />
                        Los asteriscos (<span className="text-red-500">*</span>) indican campos obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}

