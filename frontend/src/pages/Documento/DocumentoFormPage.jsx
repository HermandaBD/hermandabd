import React, { useEffect, useState } from 'react'
import { createDocumento } from '../../api/documento.api';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getEtiquetas } from '../../api/etiqueta.api';
import { HttpStatusCode } from 'axios';

export function DocumentoFormPage() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [etiquetasBD, setEtiquetas] = useState([]);
    const archivo = watch("archivo");

    useEffect(() => {
        if (archivo && archivo.length > 0) {
            const fileName = archivo[0].name.split('.').slice(0, -1).join('.');
            setValue("nombre", fileName);
        }
    }, [archivo, setValue]);

    useEffect(() => {
        async function fetchEtiquetas() {
            const response = await getEtiquetas();
            setEtiquetas(response.data);
        }
        fetchEtiquetas();
    }, []);

    const onSubmit = handleSubmit(async data => {
        try {
            const response = await createDocumento(data);
            console.log(response);
            if (response == 201) {
                // TODO CUANDO SE HAGA MERGE CON DEVELOP AÑADIR EL TOAST.SUCCESS
                navigate('/documentos'); // Redirige a la página de lista de documentos después de crear uno nuevo
            }else {
                /* alert("Ocurrió un error") */
            }
        } catch (error) {
            console.error("Error al crear el documento:", error);
        }
    });

    return <div className='max-w-xl mx-auto my-5'>
        <form onSubmit={onSubmit}>
            <label htmlFor="archivo">Archivo</label>
            <input type="file" name="archivo" id="archivo" className="bg-zinc-700 p-3 rounded-lg block w-full my-3 text-black"
                {...register('archivo', { required: "Este campo es obligatorio" })} />
            {errors.archivo && <span className="text-red-500">{errors.archivo.message}<br /></span>}

            <label htmlFor="nombre">Nombre del fichero</label>
            <input id='nombre' type="text" className="bg-zinc-700 p-3 rounded-lg block w-full my-3 text-black" placeholder="Nombre del documento"
                {...register('nombre', { maxLength: { value: 200, message: "El nombre no puede tener más de 200 caracteres" }, required: "Este campo es obligatorio" })} />
            {errors.nombre && <span className='text-red-500'>{errors.nombre.message}<br /></span>}

            <label htmlFor="hermandad">Hermandad</label>
            <input type="number" name="hermandad" id="hermandad" className="bg-zinc-700 p-3 rounded-lg block w-full my-3 text-black"
                {...register('hermandad', { required: "Este campo es obligatorio" })} />
            {errors.hermandad && <span className="text-red-500">{errors.hermandad.message}<br /></span>}

            <label htmlFor="etiquetas">Etiquetas</label>
            <select name="etiquetas" id="etiquetas" multiple className="bg-zinc-700 p-3 rounded-lg block w-full my-3 text-black"
                {...register('etiquetas')}>
                {etiquetasBD.map((etiqueta) => (
                    <option value={etiqueta.id} key={etiqueta.id}>
                        {etiqueta.nombre}
                    </option>
                ))}
            </select>

            <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Subir Documento</button>
        </form>
    </div>
}
