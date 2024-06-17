import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPapeleta, deletePapeleta, updatePapeleta, getPapeleta, generatePapeleta } from "../../api/papeleta.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";
import { getHermanos } from "../../api/hermano.api.js";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";
import Select from 'react-select';

export function PapeletaFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const [selectedHermanos, setSelectedHermanos] = useState([]);
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [hermanos, setHermanos] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const hermanosResponse = await getHermanos();
            const hermanosData = hermanosResponse.data.map(hermano => ({
                value: hermano.id,
                label: hermano.nombre
            }));
            setHermanos(hermanosData);
        }

        fetchData();
    }, []);

    const handleSelectChange = selectedOptions => {
        setSelectedHermanos(selectedOptions);
    };

    const onSubmit = handleSubmit(async data => {
        data.hermano = selectedHermanos.map(option => option.value);
        try {
            if (params.id) {
                console.log('Actualizando'); //RUD
                await updatePapeleta(params.id, data)
            } else {
                await createPapeleta(data);
                console.log('Crear papeleta');
            }
            navigate("/papeletas");
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


    const handleGeneratePapeleta = async (id) => {
        try {
            // Llamar a la función para generar el PDF
            const pdfBlob = await generatePapeleta(id);

            // Crear un objeto URL del Blob del PDF
            const blobUrl = URL.createObjectURL(pdfBlob);

            // Crear un enlace invisible para descargar el PDF
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = `papeleta_${id}.pdf`; // Nombre del archivo para descargar
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

    useEffect(() => { //RUD
        async function cargarPapeleta() {
            if (params.id) {
                const { data } = await getPapeleta(params.id)
                const seleccionados = hermanos.filter(hermano => data.hermano.includes(hermano.value));
                setValue('nombre_evento', data.nombre_evento)
                setValue('ubicacion', data.ubicacion)
                setValue('puesto', data.puesto)
                setValue('valor', data.valor)
                setValue('fecha', data.fecha)
                setValue('hora', data.hora)
                setValue('hermandad', data.hermandad)
                //setValue('hermano', data.hermano)
                setSelectedHermanos(seleccionados);
            }
        }
        cargarPapeleta();
    }, [params.id, hermanos])

    const selectAllHermanos = () => {
        setSelectedHermanos(hermanos);
    };

    return (
        <div className='max-w-5xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Creación de papeleta de sitio</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-5xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <form onSubmit={onSubmit}>
                    <div className="xl:grid grid-cols-12 gap-4">
                        <div className="col-start-1 col-span-3">
                            <label htmlFor="nombre_evento">Nombre del evento <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="nombre_evento"
                                id="nombre_evento"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Nombre del evento"
                                {...register('nombre_evento', { required: true, maxLength: 100 })}
                            />
                            {errors.nombre_evento && <span className="text-red-500">{errors.nombre_evento.message}</span>}
                        </div>
                        <div className="col-start-4 col-span-3">

                            <label htmlFor="ubicacion">Ubicación <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="ubicacion"
                                id="ubicacion"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Ubicación"
                                {...register('ubicacion', { required: true, maxLength: 200 })}
                            />
                            {errors.ubicacion && <span className="text-red-500">{errors.ubicacion.message}</span>}
                        </div>
                        <div className="col-start-7 col-span-3">
                            <label htmlFor="puesto">Puesto <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="puesto"
                                id="puesto"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Puesto"
                                {...register('puesto', { required: true, maxLength: 100 })}
                            />
                            {errors.puesto && <span className="text-red-500">{errors.puesto.message}</span>}
                        </div>
                        <div className="col-start-10 col-span-3">
                            <label htmlFor="valor">Valor</label>
                            <input
                                type="number"
                                step="0.01"
                                name="valor"
                                id="valor"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                placeholder="Valor de la papeleta"
                                {...register('valor', { required: true, min: 0, max: 999.99 })}
                            />
                            {errors.valor && <span className="text-red-500">{errors.valor.message}</span>}
                        </div>
                    </div>
                    <div className="xl:grid grid-cols-12 gap-4">
                        <div className="col-start-1 col-span-3">
                            <label htmlFor="fecha">Fecha <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="fecha"
                                id="fecha"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('fecha', { required: true })}
                            />
                            {errors.fecha && <span className="text-red-500">{errors.fecha.message}</span>}
                        </div>
                        <div className="col-start-4 col-span-3">
                            <label htmlFor="hora">Hora <span className="text-red-500">*</span></label>
                            <input
                                type="time"
                                name="hora"
                                id="hora"
                                className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('hora', { required: true })}
                            />
                            {errors.hora && <span className="text-red-500">{errors.hora.message}</span>}
                        </div>
                    </div>
                    <div className="xl:grid grid-cols-12 gap-4">
                        <div className="col-start-1 col-span-9">
                            <label htmlFor="hermano">Hermanos <span className="text-red-500">*</span></label>
                            <Select
                                isMulti
                                name="hermano"
                                options={hermanos}
                                className="basic-multi-select border-2 border-black rounded-lg block w-full my-3"
                                value={selectedHermanos}
                                onChange={handleSelectChange}
                            />
                            {errors.hermano && <span className="text-red-500">{errors.hermano.message}</span>}
                        </div>
                    </div>
                    <div className="xl:grid grid-cols-12 gap-4">
                        <div className="col-start-1 col-span-9">
                            <label htmlFor="diseno">Diseño (Opcional)</label>
                            <input type="file" name="diseno" id="diseno" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                                {...register('diseno')} />
                            {errors.diseno && <span className="text-red-500">{errors.diseno.message}<br /></span>}
                        </div>
                    </div>
                    <input type="hidden" id="hermandad" name="hermandad" value={hermandad}
                        {...register('hermandad')} />
                    <div className="xl:grid grid-cols-12 gap-4">
                        <div className="col-start-1 col-span-4">
                            <button className="bg-burdeos font-bold text-white p-3 rounded-lg block w-full mt-3">Guardar Papeleta de Sitio</button>
                        </div>
                        <div className="col-start-5 col-span-4">
                            {params.id && <button onClick={async () => {
                                const accepted = window.confirm('¿Estás seguro?')
                                if (accepted) {
                                    await deletePapeleta(params.id);
                                    navigate("/papeletas");
                                }
                            }} className="bg-red-500 font-bold text-white p-3 rounded-lg block w-full mt-3">Eliminar</button>}
                        </div>
                        <div className="col-start-9 col-span-4">
                            {params.id && (
                                    <button onClick={() => handleGeneratePapeleta(params.id)} className="bg-sandy text-black font-bold p-3 rounded-lg block w-full mt-3 col-start-3 col-span-2">
                                        Generar Papeleta PDF
                                    </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p> Formulario de creación de Papeleta de sitio. <br />
                        Puedes importar un diseño personalizado de las papeletas de sitio, recomendamos descargar el actual y hacer el diseño sobre la base para que no ocurran problemas de colocación <br />
                        Los asteriscos (<span className="text-red-500">*</span>) indican campos obligatorios.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
