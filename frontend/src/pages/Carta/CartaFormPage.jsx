import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createCarta, deleteCarta, updateCarta, getCarta } from "../../api/carta.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";
import { getHermanos } from "../../api/hermano.api.js";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function CartaFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams(); //RUD
    const [hermanos, setHermanos] = useState([]);  // Cambiar destinatarioss a hermanos
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        async function fetchData() {
            try {
                const hermanosResponse = await getHermanos();
                setHermanos(hermanosResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const onSubmit = handleSubmit(async data => {
        try {
            let response;
            if (params.id) {
                response = await updateCarta(params.id, data)
            } else {
                response = await createCarta(data);
            }
            navigate("/cartas");
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
        async function cargarCarta() {
            if (params.id) {
                const { data } = await getCarta(params.id)

                setValue('asunto', data.asunto)
                setValue('cuerpo', data.cuerpo)
                setValue('fecha_envio', data.fecha_envio)
                setValue('hermandad', data.hermandad)
                setValue('destinatarios', data.destinatarios)
            }
        }
        cargarCarta();
    }, [])

    return (
        <div className='max-w-5xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Creación y envío de carta</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-5xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <div className='xl:grid grid-cols-12 gap-4'>
                        <div className="col-start-1 col-span-4">
                            <label htmlFor="asunto">Asunto<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="asunto"
                                id="asunto"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Asunto de la carta"
                                {...register('asunto', { required: "Campo requerido", maxLength: {value:100, message: "Máximo 100 caracteres"} })}
                            />
                            {errors.asunto && <span className="text-red-500">{errors.asunto.message} <br /></span>}
                        </div>
                        <div className="col-start-6 col-span-3">
                            <label htmlFor="fecha_envio">Fecha de envío<span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="fecha_envio"
                                id="fecha_envio"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('fecha_envio', { required: "Campo requerido" })}
                            />
                            {errors.fecha_envio && <span className="text-red-500">{errors.fecha_envio.message} <br /></span>}
                        </div>
                    </div>

                    <label htmlFor="cuerpo">Cuerpo<span className="text-red-500">*</span></label>
                    <textarea
                        name="cuerpo"
                        id="cuerpo"
                        className="border-2 border-black p-3 rounded-lg block w-full my-3"
                        placeholder="Cuerpo de la carta"
                        {...register('cuerpo', { required: "Campo requerido", maxLength: {value:1000, message: "Max 1000 caracteres"} })}
                    />
                    {errors.cuerpo && <span className="text-red-500">{errors.cuerpo.message} <br /></span>}

                    <input type="hidden" id="hermandad" name="hermandad" value={hermandad} {...register('hermandad')} />

                    <label htmlFor="destinatarios">Destinatarios<span className="text-red-500">*</span></label>
                    <select
                        multiple
                        name="destinatarios"
                        id="destinatarios"
                        className="border-2 border-black p-3 rounded-lg block w-full my-3"
                        {...register('destinatarios', { required: "Campo requerido" })}
                    >
                        {hermanos.map((hermano) => (  // Cambiar destinatarios a hermanos
                            <option key={hermano.id} value={hermano.id}>
                                {hermano.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.destinatarios && <span className="text-red-500">{errors.destinatarios.message} <br /> </span>}

                    <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3">Guardar Carta</button>
                </form>
                {params.id && <button onClick={async () => {
                    const accepted = window.confirm('¿Estás seguro?')
                    if (accepted) {
                        await deleteCarta(params.id);
                        navigate("/cartas");
                    }
                }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>}
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p> Formulario de creación de Carta. <br />
                        Por ahora el envío automatizado de carta no está implementado.<br />
                        La carta se enviará al instante al email de los hermanos seleccionados <br />
                        Los asteriscos (<span className="text-red-500">*</span>) indican campos obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
