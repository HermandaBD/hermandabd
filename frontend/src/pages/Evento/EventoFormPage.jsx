import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createEvento, getEvento, updateEvento, deleteEvento } from "../../api/evento.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";

export function EventoFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');

    const onSubmit = handleSubmit(async data => {
        try {
            if (params.id) {
                console.log('Actualizando'); //RUD
                await updateEvento(params.id, data)
            } else {
                await createEvento(data);
                console.log('Crear evento');
            }
            navigate("/eventos");
        } catch (error) {
            console.error("Error al crear el evento:", error);
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
                const { data } = await getEvento(params.id)
                setValue('descripcion', data.descripcion)
                setValue('fecha_inicio', formatDatetimeLocal(data.fecha_inicio))
                setValue('fecha_fin', formatDatetimeLocal(data.fecha_fin))
                setValue('hermandad', data.hermandad)
            }
        }
        cargarEvento();
    }, [])

    return (
        <div className='max-w-xl mx-auto my-5'>
            <form onSubmit={onSubmit}>
                <label htmlFor="descripcion">Descripción</label>
                <input
                    type="text"
                    name="descripcion"
                    id="descripcion"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    placeholder="Descripción del evento"
                    {...register('descripcion', { required: true, maxLength: 100 })}
                />
                {errors.descripcion && <span>Este campo es obligatorio y debe tener un máximo de 100 caracteres</span>}

                <label htmlFor="fecha_inicio">Fecha de inicio</label>
                <input
                    type="datetime-local"
                    name="fecha_inicio"
                    id="fecha_inicio"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    {...register('fecha_inicio', { required: true })}
                />
                {errors.fecha_inicio && <span>Este campo es obligatorio</span>}

                <label htmlFor="fecha_fin">Fecha de fin</label>
                <input
                    type="datetime-local"
                    name="fecha_fin"
                    id="fecha_fin"
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3"
                    {...register('fecha_fin', { required: true })}
                />
                {errors.fecha_fin && <span>Este campo es obligatorio</span>}

                <input type="hidden" id="hermandad" name="hermandad" value={hermandad}
                    {...register('hermandad')} />

                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Evento</button>
            </form>
            {params.id && <button onClick={async () => {
                const accepted = window.confirm('¿Estás seguro?')
                if (accepted) {
                    await deleteEvento(params.id);
                    navigate("/eventos");
                }
            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>}
        </div>
    );
}

