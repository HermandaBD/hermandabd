import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPago, deletePago, updatePago, getPago, generatePDF } from "../../api/pago.api.js";
import { useEffect, useState } from "react";
import { getHermanos } from "../../api/hermano.api.js";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function PagoFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [hermanos, setHermanos] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const hermanosResponse = await getHermanos();
            setHermanos(hermanosResponse.data);
        }

        fetchData();
    }, []);

    const onSubmit = handleSubmit(async data => {
        try {
            let response;
            if (params.id) {
                response = await updatePago(params.id, data);
            } else {
                response = await createPago(data);
            }
            navigate("/pagos");
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
        async function cargarPago() {
            if (params.id) {
                const { data } = await getPago(params.id)
                setValue('nombre', data.nombre)
                setValue('descripcion', data.descripcion)
                setValue('fecha', data.fecha)
                setValue('valor', data.valor)
                setValue('hermandad', data.hermandad)
                setValue('hermano', data.hermano)
            }
        }
        cargarPago();
    }, []);

    const handleGeneratePDF = async (id) => {
        try {
            // Llamar a la función para generar el PDF
            const pdfBlob = await generatePDF(id);
    
            // Crear un objeto URL del Blob del PDF
            const blobUrl = URL.createObjectURL(pdfBlob);
    
            // Crear un enlace invisible para descargar el PDF
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = `cuota_${id}.pdf`; // Nombre del archivo para descargar
            document.body.appendChild(a);
    
            // Simular clic en el enlace para iniciar la descarga
            a.click();
    
            // Limpiar después de la descarga
            window.URL.revokeObjectURL(blobUrl);
            a.remove();
    
            console.log("PDF generado y descargado exitosamente");
        } catch (error) {
            console.error("Error al generar o descargar el PDF:", error);
        }
    };

    return (
        <div className='max-w-5xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">{params.id ? 'Actualizar Pago' : 'Crear Pago'}</h1>
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
                            <label htmlFor="fecha">Fecha <span className="text-red-500">*</span></label>
                            <input type="date" name="fecha" id="fecha" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('fecha', { required: "Este campo es necesario" })} />
                            {errors.fecha && <span className="text-red-500">{errors.fecha.message}<br /></span>}
                        </div>
                    </div>

                    <div className='xl:grid grid-cols-6 gap-4'>
                        <div className="col-start-1 col-span-3">
                            <label htmlFor="valor">Valor <span className="text-red-500">*</span></label>
                            <input type="number" step="0.01" name="valor" id="valor" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('valor', { required: "Este campo es necesario", min: { value: 0, message: 'Valor mínimo 0' }, max: { value: 9999.99, message: 'Valor máximo 9999.99' } })} />
                            {errors.valor && <span className="text-red-500">{errors.valor.message}<br /></span>}
                        </div>

                        <div className="col-start-4 col-span-3">
                            <label htmlFor="hermano">Hermanos <span className="text-red-500">*</span></label>
                            <select multiple name="hermano" id="hermano" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('hermano', { required: "Este campo es necesario" })}>
                                {hermanos.map((hermano) => (
                                    <option key={hermano.id} value={hermano.id}>
                                        {hermano.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.hermano && <span className="text-red-500">{errors.hermano.message}<br /></span>}
                        </div>
                        <div className="col-start-1 col-span-4">
                            <label htmlFor="diseno">Diseño (Solo para cuotas)</label>
                            <input type="file" name="diseno" id="diseno" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('diseno')} />
                            {errors.diseno && <span className="text-red-500">{errors.diseno.message}<br /></span>}
                        </div>
                    </div>

                    <div className='xl:grid grid-cols-6 gap-4'>
                        <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3 col-start-1 col-span-1">Confirmar</button>
                        {params.id && (
                            <button onClick={async () => {
                                const accepted = window.confirm('¿Estás seguro?');
                                if (accepted) {
                                    await deletePago(params.id);
                                    navigate("/pagos");
                                }
                            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3 col-start-6 col-span-1">Eliminar</button>
                        )}
                    </div>
                </form>
                {params.id && (
                    <div className='xl:grid grid-cols-6 gap-4'>
                        <button onClick={() => handleGeneratePDF(params.id)} className="bg-blue-500 text-white font-bold p-3 rounded-lg block w-full mt-3 col-start-3 col-span-2">
                            Generar PDF
                        </button>
                    </div>
                )}
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p> Formulario de creación de pago. <br />
                        Los campos marcados con (<span className="text-red-500">*</span>) son obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}

