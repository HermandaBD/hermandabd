import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createEtiqueta } from "../../api/etiqueta.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";

export function EtiquetaFormPage() {
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
            await createEtiqueta(data);
            console.log("Etiqueta creada");
            navigate('/etiquetas');
        } catch (error) {
            console.error("Error al crear la etiqueta:", error);
        }
    });

    return (
        <div className='max-w-xl mx-auto my-5'>
            <form onSubmit={onSubmit}>
                <label htmlFor="nombre">Nombre</label>
                <input 
                    type="text" 
                    name="nombre" 
                    id="nombre" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Nombre de la etiqueta"
                    {...register('nombre', { required: true, maxLength: 100 })} 
                />
                {errors.nombre && <span>Este campo es obligatorio y debe tener un máximo de 100 caracteres</span>}
                
                <label htmlFor="descripcion">Descripción</label>
                <input 
                    type="text" 
                    name="descripcion" 
                    id="descripcion" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Descripción de la etiqueta"
                    {...register('descripcion', { required: true, maxLength: 200 })} 
                />
                {errors.descripcion && <span>Este campo es obligatorio y debe tener un máximo de 200 caracteres</span>}
                
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
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Etiqueta</button>
            </form>
        </div>
    );
}
