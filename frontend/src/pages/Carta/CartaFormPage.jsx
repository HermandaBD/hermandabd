import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createCarta, deleteCarta, updateCarta, getCarta } from "../../api/carta.api.js";
import { useEffect, useState } from "react";
import { getHermandad, getHermandades } from "../../api/hermandad.api.js";
import { getHermanos } from "../../api/hermano.api.js";

export function CartaFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams(); //RUD
    const [hermanos, setHermanos] = useState([]);  // Cambiar destinatarioss a hermanos
    const [emailHermandad, setEmailHermandad] = useState([]);  // Cambiar destinatarioss a hermanos
    const [fecha, setFecha] = useState('')
    const hermandad = localStorage.getItem('hermandad_usuario');
    useEffect(() => {
        async function fetchData() {
            try {
                const hermanosResponse = await getHermanos();
                setHermanos(hermanosResponse.data);

                const hermandadResponse = await getHermandad(hermandad);
                setEmailHermandad(hermandadResponse.data.email);

                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const onSubmit = handleSubmit(async data => {
        let currentDate = new Date().toJSON().slice(0, 10);
        setFecha(currentDate);
        data.fecha_envio = currentDate;
        try {
            if (params.id) {
                await updateCarta(params.id, data)
            } else {

                console.log(data);
                await createCarta(data);
            }
            navigate("/cartas");
        } catch (error) {
            console.error("Error al crear la carta:", error);
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

                {/* <label htmlFor="fecha_envio">Fecha de envío</label> */}
                <input
                    type="hidden"
                    name="fecha_envio"
                    id="fecha_envio"
                    value={fecha}
                    {...register('fecha_envio')}
                />


                <input type="hidden" id="hermandad" name="hermandad" value={hermandad}
                    {...register('hermandad')} />

                <input type="hidden" id="reply_to" name="reply_to" value={emailHermandad}
                    {...register('reply_to')} />

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
