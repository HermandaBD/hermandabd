import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPatrimonio, updatePatrimonio, deletePatrimonio, getPatrimonio } from "../../api/patrimonio.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";

export function PatrimonioFormPage() {
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
                await updatePatrimonio(params.id, data)
            } else {
                await createPatrimonio(data);
                console.log('Crear patrimonio');
            }
            navigate("/patrimonios");
        } catch (error) {
            console.error("Error al crear el patrimonio:", error);
        }
    });

    useEffect(() => { //RUD
        async function cargarPatrimonio() {
            if (params.id) {
                const {data} = await getPatrimonio(params.id)
                
                setValue('nombre', data.nombre)
                setValue('descripcion', data.descripcion)
                setValue('fecha_llegada', data.fecha_llegada)
                setValue('fecha_realizacion', data.fecha_realizacion)
                setValue('valor', data.valor)
                setValue('hermandad', data.hermandad)
            }
        }
        cargarPatrimonio();
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
                    placeholder="Nombre del patrimonio"
                    {...register('nombre', { required: true, maxLength: 100 })} 
                />
                {errors.nombre && <span>Este campo es obligatorio y debe tener un máximo de 100 caracteres</span>}
                
                <label htmlFor="descripcion">Descripción</label>
                <input 
                    type="text" 
                    name="descripcion" 
                    id="descripcion" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Descripción"
                    {...register('descripcion', { required: true, maxLength: 500 })} 
                />
                {errors.descripcion && <span>Este campo es obligatorio y debe tener un máximo de 500 caracteres</span>}
                
                <label htmlFor="fecha_llegada">Fecha de llegada</label>
                <input 
                    type="date" 
                    name="fecha_llegada" 
                    id="fecha_llegada" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    {...register('fecha_llegada', { required: true })} 
                />
                {errors.fecha_llegada && <span>Este campo es obligatorio</span>}
                
                <label htmlFor="fecha_realizacion">Fecha de realización</label>
                <input 
                    type="date" 
                    name="fecha_realizacion" 
                    id="fecha_realizacion" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    {...register('fecha_realizacion', { required: true })} 
                />
                {errors.fecha_realizacion && <span>Este campo es obligatorio</span>}
                
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
                
                <label htmlFor="valor">Valor</label>
                <input 
                    type="number" 
                    step="0.01"
                    name="valor" 
                    id="valor" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Valor del patrimonio"
                    {...register('valor', { required: true, min: 0, max: 9999999999.99 })} 
                />
                {errors.valor && <span>Este campo es obligatorio y debe ser un número entre 0 y 9999999999.99</span>}
                
                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Patrimonio</button>
            </form>
            {params.id && <button onClick={async () => {
                const accepted = window.confirm('¿Estás seguro?')
                if (accepted) {
                    await deletePatrimonio(params.id);
                    navigate("/patrimonios");
                }
            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>}
        </div>
    );
}
