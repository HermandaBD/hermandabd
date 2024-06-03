import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createEvento } from "../../api/evento.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";

export function EventoFormPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [hermandades, setHermandades] = useState([]);

    useEffect(() => {
        async function fetchHermandades() {
            const response = await getHermandades();
            setHermandades(response.data);
        }

        fetchHermandades();
    }, []);

    const onSubmit = handleSubmit(async data => {
        try {
            await createEvento(data);
            console.log("Evento creado");
            navigate('/eventos');
        } catch (error) {
            console.error("Error al crear el evento:", error);
        }
    });

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
                
                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Crear Evento</button>
            </form>
        </div>
    );
}
