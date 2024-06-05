import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createEtiqueta, updateEtiqueta, deleteEtiqueta, getEtiqueta } from "../../api/etiqueta.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";

export function EtiquetaFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams();
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
            if (params.id) {
                console.log('Actualizando'); //RUD
                await updateEtiqueta(params.id, data)
            } else {
                await createEtiqueta(data);
                console.log('Crear etiqueta');
            }
            navigate("/etiquetas");
        } catch (error) {
            console.error("Error al crear la etiqueta:", error);
        }
    });

    useEffect(() => { //RUD
        async function cargarEtiqueta() {
            if (params.id) {
                const {data} = await getEtiqueta(params.id)
                
                setValue('nombre', data.nombre)
                setValue('descripcion', data.descripcion)
                setValue('hermandad', data.hermandad)
            }
        }
        cargarEtiqueta();
    }, [])

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
            {params.id && <button onClick={async () => {
                const accepted = window.confirm('¿Estás seguro?')
                if (accepted) {
                    await deleteEtiqueta(params.id);
                    navigate("/etiquetas");
                }
            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>}
        </div>
    );
}
