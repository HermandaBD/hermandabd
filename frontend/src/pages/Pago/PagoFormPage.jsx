import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPago, deletePago, updatePago, getPago } from "../../api/pago.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";
import { getHermanos } from "../../api/hermano.api.js";

export function PagoFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const [hermandades, setHermandades] = useState([]);
    const [hermanos, setHermanos] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const hermandadesResponse = await getHermandades();
            setHermandades(hermandadesResponse.data);

            const hermanosResponse = await getHermanos();
            setHermanos(hermanosResponse.data);
        }

        fetchData();
    }, []);

    const onSubmit = handleSubmit(async data => {
        try {
            if (params.id) {
                console.log('Actualizando'); //RUD
                await updatePago(params.id, data)
            } else {
                await createPago(data);
                console.log('Crear pago');
            }
            navigate("/pagos");
        } catch (error) {
            console.error("Error al crear el pago:", error);
        }
    });

    useEffect(() => { //RUD
        async function cargarPago() {
            if (params.id) {
                const {data} = await getPago(params.id)
                
                setValue('nombre', data.nombre)
                setValue('descripcion', data.descripcion)
                setValue('fecha', data.fecha)
                setValue('valor', data.valor)
                setValue('hermandad', data.hermandad)
                setValue('hermano', data.hermano)
            }
        }
        cargarPago();
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
                    placeholder="Nombre del pago"
                    {...register('nombre', { required: true, maxLength: 100 })} 
                />
                {errors.nombre && <span>Este campo es obligatorio y debe tener un máximo de 100 caracteres</span>}
                
                <label htmlFor="descripcion">Descripción</label>
                <input 
                    type="text" 
                    name="descripcion" 
                    id="descripcion" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Descripción del pago"
                    {...register('descripcion', { required: true, maxLength: 500 })} 
                />
                {errors.descripcion && <span>Este campo es obligatorio y debe tener un máximo de 500 caracteres</span>}
                
                <label htmlFor="fecha">Fecha</label>
                <input 
                    type="date" 
                    name="fecha" 
                    id="fecha" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    {...register('fecha', { required: true })} 
                />
                {errors.fecha && <span>Este campo es obligatorio</span>}
                
                <label htmlFor="valor">Valor</label>
                <input 
                    type="number" 
                    step="0.01"
                    name="valor" 
                    id="valor" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Valor del pago"
                    {...register('valor', { required: true, min: 0, max: 9999.99 })} 
                />
                {errors.valor && <span>Este campo es obligatorio y debe ser un número entre 0 y 9999.99</span>}
                
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
                
                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Pago</button>
            </form>
            {params.id && <button onClick={async () => {
                const accepted = window.confirm('¿Estás seguro?')
                if (accepted) {
                    await deletePago(params.id);
                    navigate("/pagos");
                }
            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>} 
        </div>
    );
}
