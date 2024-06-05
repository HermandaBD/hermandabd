import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createCarta, deleteCarta, updateCarta, getCarta } from "../../api/carta.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";
import { getHermanos } from "../../api/hermano.api.js";

export function CartaFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams(); //RUD
    const [hermandades, setHermandades] = useState([]);
    const [hermanos, setHermanos] = useState([]);  // Cambiar destinatarioss a hermanos

    useEffect(() => {
        async function fetchData() {
            try {
                const hermandadesResponse = await getHermandades();
                setHermandades(hermandadesResponse.data);

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
            if (params.id) {
                console.log('Actualizando'); //RUD
                await updateCarta(params.id, data)
            } else {
                await createCarta(data);
                console.log('Crear carta');
            }
            navigate("/cartas");
        } catch (error) {
            console.error("Error al crear la carta:", error);
        }
    });

    useEffect(() => { //RUD
        async function cargarCarta() {
            if (params.id) {
                const {data} = await getCarta(params.id)
                
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
        <div className='max-w-xl mx-auto my-5'>
            <form onSubmit={onSubmit}>
                <label htmlFor="asunto">Asunto</label>
                <input
                    type="text"
                    name="asunto"
                    id="asunto"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    placeholder="Asunto de la carta"
                    {...register('asunto', { required: true, maxLength: 100 })}
                />
                {errors.asunto && <span>Este campo es obligatorio y debe tener un máximo de 100 caracteres</span>}

                <label htmlFor="cuerpo">Cuerpo</label>
                <textarea
                    name="cuerpo"
                    id="cuerpo"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    placeholder="Cuerpo de la carta"
                    {...register('cuerpo', { required: true, maxLength: 1000 })}
                />
                {errors.cuerpo && <span>Este campo es obligatorio y debe tener un máximo de 1000 caracteres</span>}

                <label htmlFor="fecha_envio">Fecha de envío</label>
                <input
                    type="date"
                    name="fecha_envio"
                    id="fecha_envio"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    {...register('fecha_envio', { required: true })}
                />
                {errors.fecha_envio && <span>Este campo es obligatorio</span>}

                <label htmlFor="hermandad">Hermandad</label>
                <select
                    name="hermandad"
                    id="hermandad"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    {...register('hermandad', { required: true })}
                >
                    <option value="">Seleccione una hermandad</option>
                    {hermandades.map((hermandad) => (
                        <option key={hermandad.id} value={hermandad.id}>
                            {hermandad.nombre}
                        </option>
                    ))}
                </select>
                {errors.hermandad && <span>Este campo es obligatorio</span>}

                <label htmlFor="destinatarios">Destinatarios</label>
                <select
                    multiple
                    name="destinatarios"
                    id="destinatarios"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    {...register('destinatarios', { required: true })}
                >
                    {hermanos.map((hermano) => (  // Cambiar destinatarios a hermanos
                        <option key={hermano.id} value={hermano.id}>
                            {hermano.nombre}
                        </option>
                    ))}
                </select>
                {errors.destinatarios && <span>Este campo es obligatorio</span>}

                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Carta</button>
            </form>
            {params.id && <button onClick={async () => {
                const accepted = window.confirm('¿Estás seguro?')
                if (accepted) {
                    await deleteCarta(params.id);
                    navigate("/cartas");
                }
            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>}  
        </div> //RUD
    );
}
