import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createInventario, deleteInventario, updateInventario, getInventario } from "../../api/inventario.api.js";
import { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api.js";

export function InventarioFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');

    const onSubmit = handleSubmit(async data => {
        try {
            if (params.id) {
                console.log('Actualizando'); //RUD
                await updateInventario(params.id, data)
            } else {
                await createInventario(data);
                console.log('Crear inventario');
            }
            navigate("/inventarios");
        } catch (error) {
            console.error("Error al crear el inventario:", error);
        }
    });

    useEffect(() => { //RUD
        async function cargarInventario() {
            if (params.id) {
                const { data } = await getInventario(params.id)

                setValue('nombre', data.nombre)
                setValue('descripcion', data.descripcion)
                setValue('ubicacion', data.ubicacion)
                setValue('hermandad', data.hermandad)

            }
        }
        cargarInventario();
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
                    placeholder="Nombre del inventario"
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

                <input type="hidden" id="hermandad" name="hermandad" value={hermandad}
                    {...register('hermandad')} />

                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Inventario</button>
            </form>
            {params.id && <button onClick={async () => {
                const accepted = window.confirm('¿Estás seguro?')
                if (accepted) {
                    await deleteInventario(params.id);
                    navigate("/inventarios");
                }
            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>}
        </div>
    );
}
