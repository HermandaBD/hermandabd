import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createHermano, deleteHermano, updateHermano, getHermano } from "../../api/hermano.api";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function HermanoFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [showModal, setShowModal] = useState(false);
    const [hoy, setHoy] = useState('');
    const validateDNI = (dni) => {
        const dniRegex = /^\d{8}[A-Z]$/;
        return dniRegex.test(dni) || "DNI debe tener 8 números seguidos de una letra mayúscula";
    };

    const validateIBAN = (iban) => {
        const ibanRegex = /^[A-Z]{2}\d{2}[A-Z\d]{12,30}$/;
        return ibanRegex.test(iban) || "IBAN no es válido";
    };

    const onSubmit = handleSubmit(async data => {
        try {
            if (data.fecha_baja === '') {
                data.fecha_baja = null;
            }
            let response;
            if (params.id) {
                response = await updateHermano(params.id, data);
            } else {
                response = await createHermano(data);
            }
            navigate("/hermanos");
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

    const formatDatetimeLocal = () => {
        const date = new Date();
        const pad = (num) => num.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        async function cargarHermano() {

            if (params.id) {
                const { data } = await getHermano(params.id)

                setValue('nombre', data.nombre)
                setValue('apellidos', data.apellidos)
                setValue('dni', data.dni)
                setValue('telefono', data.telefono)
                setValue('email', data.email)
                setValue('fecha_nacimiento', data.fecha_nacimiento)
                setValue('fecha_alta', data.fecha_alta)
                setValue('tutor_legal', data.tutor_legal)
                setValue('direccion', data.direccion)
                setValue('localidad', data.localidad)
                setValue('provincia', data.provincia)
                setValue('codigo_postal', data.codigo_postal) /* TODO falta forma_pago */
                setValue('iban', data.iban)
                setValue('forma_pago', data.forma_pago)
                setValue('titular_cuenta_bancaria', data.titular_cuenta_bancaria)
            } else {
                setHoy(formatDatetimeLocal());
                setValue('fecha_alta', hoy);
            }
        }
        cargarHermano();
    }, [])

    return (<div className='max-w-7xl p-10 mx-auto my-5'>
        <div className="flex justify-between">
            <h1 className="font-bold text-2xl">Dar de Alta a un nuevo Hermano</h1>
            <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
        </div>
        <div className='max-w-7xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
            <form onSubmit={onSubmit}>
                <input type="hidden" name="hermandad" id="hermandad" {...register('hermandad')} value={hermandad} />
                <div className='xl:grid grid-cols-12 gap-4'>
                    <div className="col-start-1 col-span-2">
                        <label htmlFor="nombre">Nombre <span className="text-red-500">*</span> </label>
                        <input type="text" name="nombre" id="nombre" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('nombre', { required: "Este campo es necesario" })} />
                        {errors.nombre && <span className="text-red-500">{errors.nombre.message}<br /></span>}
                    </div>

                    <div className="col-start-3 col-span-2">
                        <label htmlFor="apellidos">Apellidos <span className="text-red-500">*</span></label>
                        <input type="text" name="apellidos" id="apellidos" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('apellidos', { required: "Este campo es necesario" })} />
                        {errors.apellidos && <span className="text-red-500">{errors.apellidos.message}<br /></span>}
                    </div>
                    <div className="col-start-5 col-span-2">
                        <label htmlFor="dni">DNI <span className="text-red-500">*</span></label>
                        <input type="text" name="dni" id="dni" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('dni', { required: "Este campo es necesario", maxLength: {value:9, message:'DNI inválido'}, validate: validateDNI })} />
                        {errors.dni && <span className="text-red-500">{errors.dni.message}<br /></span>}
                    </div>

                    <div className="col-start-7 col-span-2">
                        <label htmlFor="telefono">Teléfono <span className="text-red-500">*</span></label>
                        <input type="text" name="telefono" id="telefono" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('telefono', { required: "Este campo es necesario", maxLength: {value:12, message:'Número inválido'} })} />
                        {errors.telefono && <span className="text-red-500">{errors.telefono.message} <br /></span>}
                    </div>
                    <div className="col-start-9 col-span-4">
                        <label htmlFor="email">Email <span className="text-red-500">*</span></label>
                        <input type="email" name="email" id="email" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('email', { required: "Este campo es necesario" })} />
                        {errors.email && <span className="text-red-500">{errors.email.message} <br /></span>}
                    </div>
                </div>

                <div className='xl:grid grid-cols-6 gap-4'>
                    <div className="col-start-1 col-span-1">
                        <label htmlFor="fecha_nacimiento">Fecha de Nacimiento <span className="text-red-500">*</span></label>
                        <input type="date" name="fecha_nacimiento" id="fecha_nacimiento" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('fecha_nacimiento', { required: "Este campo es necesario" })} />
                        {errors.fecha_nacimiento && <span className="text-red-500">{errors.fecha_nacimiento.message} <br /></span>}
                    </div>
                    <div className="col-start-2 col-span-1">
                        <label htmlFor="fecha_alta">Fecha de Alta <span className="text-red-500">*</span></label>
                        <input type="date" name="fecha_alta" id="fecha_alta" className="border-2 border-black p-3 rounded-lg block w-full my-3" value={hoy}
                            {...register('fecha_alta', { required: "Este campo es necesario" })} />
                        {errors.fecha_alta && <span className="text-red-500">{errors.fecha_alta.message} <br /></span>}
                    </div>
                    <div className="col-start-4 col-span-2">
                        <label htmlFor="tutor_legal">Tutor legal</label>
                        <input type="text" name="tutor_legal" id="tutor_legal" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('tutor_legal')} />
                        {errors.tutor_legal && <span className="text-red-500">{errors.tutor_legal.message} <br /></span>}
                    </div>
                </div>

                <div className='xl:grid grid-cols-4 gap-4'>
                    <div>
                        <label htmlFor="direccion">Dirección <span className="text-red-500">*</span></label>
                        <input type="text" name="direccion" id="direccion" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('direccion', { required: "Este campo es necesario" })} />
                        {errors.direccion && <span className="text-red-500">{errors.direccion.message}<br /></span>}
                    </div>
                    <div>
                        <label htmlFor="localidad">Localidad <span className="text-red-500">*</span></label>
                        <input type="text" name="localidad" id="localidad" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('localidad', { required: "Este campo es necesario" })} />
                        {errors.localidad && <span className="text-red-500">{errors.localidad.message}<br /></span>}
                    </div>

                    <div>
                        <label htmlFor="provincia">Provincia <span className="text-red-500">*</span></label>
                        <input type="text" name="provincia" id="provincia" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('provincia', { required: "Este campo es necesario" })} />
                        {errors.provincia && <span className="text-red-500">{errors.provincia.message}<br /></span>}
                    </div>

                    <div>
                        <label htmlFor="codigo_postal">Código Postal <span className="text-red-500">*</span></label>
                        <input type="number" name="codigo_postal" id="codigo_postal" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('codigo_postal', { required: "Este campo es necesario", max: {value:53000, message: 'CP inválido'} })} />
                        {errors.codigo_postal && <span className="text-red-500">{errors.codigo_postal.message}<br /></span>}
                    </div>
                </div>
                <div className='xl:grid grid-cols-3 gap-4'>

                    <div>
                        <label htmlFor="iban">IBAN <span className="text-red-500">*</span></label>
                        <input type="text" name="iban" id="iban" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('iban', { required: "Este campo es necesario", maxLength: {value:24, message:"Iban sin espacios"}, validate: validateIBAN })} />
                        {errors.iban && <span className="text-red-500">{errors.iban.message}<br /></span>}
                    </div>
                    <div>
                        <label htmlFor="forma_pago">Periodicidad <span className="text-red-500">*</span></label>
                        <select name="forma_pago" id="forma_pago" {...register('forma_pago', { required: "Este campo es necesario" })} className="border-2 border-black p-3 rounded-lg block w-full my-3">
                            <option value="ANUAL">Anual</option>
                            <option value="SEMESTRAL">Semestral</option>
                            <option value="TRIMESTRAL">Trimestral</option>
                            <option value="MENSUAL">Mensual</option>
                        </select>
                        {errors.forma_pago && <span className="text-red-500">{errors.forma_pago.message}<br /></span>}
                    </div>


                    <div>
                        <label htmlFor="titular_cuenta_bancaria">Titular de la cuenta <span className="text-red-500">*</span></label>
                        <input type="text" name="titular_cuenta_bancaria" id="titular_cuenta_bancaria" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('titular_cuenta_bancaria', { required: "Este campo es necesario" })} />
                        {errors.titular_cuenta_bancaria && <span className="text-red-500">{errors.titular_cuenta_bancaria.message}<br /></span>}
                    </div>
                </div>
                <div className='xl:grid grid-cols-6 gap-4'>

                    <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3 col-start-1 col-span-1">Confirmar</button>
                    {params.id && <button onClick={async () => {
                        const accepted = window.confirm('¿Estás seguro?')
                        if (accepted) {
                            await deleteHermano(params.id);
                            navigate("/hermanos");
                        }
                    }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3 col-start-6 col-span-1">Eliminar</button>}
                </div>
            </form>
        </div>
        <Modal show={showModal} onClose={() => setShowModal(false)}>
            <div>
                <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                <p> Formulario de creación de nuevo hermano. <br />
                    El número de hermano se aplicará automáticamente al siguiente número libre.<br />
                    Los asteriscos (<span className="text-red-500">*</span>) indican campos obligatorios.
                </p>
            </div>
        </Modal>
    </div>);
}
