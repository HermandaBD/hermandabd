import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPapeleta, deletePapeleta, updatePapeleta, getPapeleta, generatePapeleta } from "../../api/papeleta.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";
import { getHermanos } from "../../api/hermano.api.js";

export function PapeletaFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');
    const [hermanos, setHermanos] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const hermanosResponse = await getHermanos();
            setHermanos(hermanosResponse.data);
        }

        fetchData();
    }, []);

    const onSubmit = handleSubmit(async data => {
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

                setValue('nombre_evento', data.nombre_evento)
                setValue('ubicacion', data.ubicacion)
                setValue('puesto', data.puesto)
                setValue('valor', data.valor)
                setValue('fecha', data.fecha)
                setValue('hora', data.hora)
                setValue('hermandad', data.hermandad)
                setValue('hermano', data.hermano)
            }
        }
        cargarPapeleta();
    }, [])

    return (
        <div className='max-w-xl mx-auto my-5'>
            <form onSubmit={onSubmit}>
                <label htmlFor="nombre_evento">Nombre del evento</label>
                <input
                    type="text"
                    name="nombre_evento"
                    id="nombre_evento"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    placeholder="Nombre del evento"
                    {...register('nombre_evento', { required: true, maxLength: 100 })}
                />
                {errors.nombre_evento && <span>Este campo es obligatorio y debe tener un máximo de 100 caracteres</span>}

                <label htmlFor="ubicacion">Ubicación</label>
                <input
                    type="text"
                    name="ubicacion"
                    id="ubicacion"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    placeholder="Ubicación"
                    {...register('ubicacion', { required: true, maxLength: 200 })}
                />
                {errors.ubicacion && <span>Este campo es obligatorio y debe tener un máximo de 200 caracteres</span>}

                <label htmlFor="puesto">Puesto</label>
                <input
                    type="text"
                    name="puesto"
                    id="puesto"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    placeholder="Puesto"
                    {...register('puesto', { required: true, maxLength: 100 })}
                />
                {errors.puesto && <span>Este campo es obligatorio y debe tener un máximo de 100 caracteres</span>}

                <label htmlFor="valor">Valor</label>
                <input
                    type="number"
                    step="0.01"
                    name="valor"
                    id="valor"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    placeholder="Valor de la papeleta"
                    {...register('valor', { required: true, min: 0, max: 999.99 })}
                />
                {errors.valor && <span>Este campo es obligatorio y debe ser un número entre 0 y 999.99</span>}

                <label htmlFor="fecha">Fecha</label>
                <input
                    type="date"
                    name="fecha"
                    id="fecha"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    {...register('fecha', { required: true })}
                />
                {errors.fecha && <span>Este campo es obligatorio</span>}

                <label htmlFor="fecha">Hora</label>
                <input
                    type="time"
                    name="hora"
                    id="hora"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    {...register('hora', { required: true })}
                />
                {errors.hora && <span>Este campo es obligatorio</span>}

                <input type="hidden" id="hermandad" name="hermandad" value={hermandad}
                    {...register('hermandad')} />

                <label htmlFor="hermano">Hermanos</label>
                <select
                    multiple
                    name="hermano"
                    id="hermano"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    {...register('hermano', { required: true })}
                >
                    {hermanos.map((hermano) => (
                        <option key={hermano.id} value={hermano.id}>
                            {hermano.nombre}
                        </option>
                    ))}
                </select>
                {errors.hermano && <span>Este campo es obligatorio</span>}

                <label htmlFor="diseno">Diseño (Si se quiere generar con un diseño importado)</label>
                <input type="file" name="diseno" id="diseno" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                    {...register('diseno')} />
                {errors.diseno && <span className="text-red-500">{errors.diseno.message}<br /></span>}


                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Papeleta de Sitio</button>
            </form>
            {params.id && <button onClick={async () => {
                const accepted = window.confirm('¿Estás seguro?')
                if (accepted) {
                    await deletePapeleta(params.id);
                    navigate("/papeletas");
                }
            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>}
            {params.id && (
                    <div className='xl:grid grid-cols-6 gap-4'>
                        <button onClick={() => handleGeneratePapeleta(params.id)} className="bg-blue-500 text-white font-bold p-3 rounded-lg block w-full mt-3 col-start-3 col-span-2">
                            Generar Papeleta PDF
                        </button>
                    </div>
                )}
        </div>
    );
}
