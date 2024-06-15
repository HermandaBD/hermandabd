import React, { useEffect, useState } from 'react'
import { createDocumento } from '../../api/documento.api';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getEtiquetas } from '../../api/etiqueta.api';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";


export function DocumentoFormPage() {
    const { register, handleSubmit, setValue, watch, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();
    const [etiquetasBD, setEtiquetas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const archivo = watch("archivo");
    const hermandad = localStorage.getItem('hermandad_usuario');

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
            if (response.status == 201) {
                toast.success("Documento subido con éxito");
                navigate('/documentos'); // Redirige a la página de lista de documentos después de crear uno nuevo
            } 
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data;
                Object.entries(errors).forEach(([field, message]) => {
                    setError(field, { type: "manual", message: message });
                    toast.error(message);
                });
            } else {
                console.error("Error inesperado:", error);
                toast.error("Error inesperado, por favor intenta nuevamente.");
            }
        }
    });

    return <div className='max-w-5xl p-10 mx-auto my-5'>
        <div className="flex justify-between">
            <h1 className="font-bold text-2xl">Subida de Documentos</h1>
            <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
        </div>
        <div className='max-w-5xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
            <form onSubmit={onSubmit}>
                <div className='xl:grid grid-cols-12 gap-4'>
                    <div className="col-start-1 col-span-4">
                        <label htmlFor="archivo">Archivo <span className="text-red-500">*</span></label>
                        <input type="file" name="archivo" id="archivo" className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('archivo', { required: "Este campo es obligatorio" })} />
                        {errors.archivo && <span className="text-red-500">{errors.archivo.message}<br /></span>}
                    </div>
                    <div className='col-start-7 col-span-4'>
                        <label htmlFor="nombre">Nombre del fichero<span className="text-red-500">*</span></label>
                        <input id='nombre' type="text" className="border-2 border-black p-3 rounded-lg block w-full my-3" placeholder="Nombre del documento"
                            {...register('nombre', { maxLength: { value: 200, message: "El nombre no puede tener más de 200 caracteres" }, required: "Este campo es obligatorio" })} />
                        {errors.nombre && <span className='text-red-500'>{errors.nombre.message}<br /></span>}
                    </div>
                </div>
                <div className="xl:grid grid-cols-12 gap-4">
                    <div className="col-start-1 col-span-12">
                        <label htmlFor="etiquetas">Etiquetas</label>
                        <select name="etiquetas" id="etiquetas" multiple className="border-2 border-black p-3 rounded-lg block w-full my-3"
                            {...register('etiquetas')}>
                            {etiquetasBD.map((etiqueta) => (
                                <option value={etiqueta.id} key={etiqueta.id}>
                                    {etiqueta.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <input type="hidden" id="hermandad" name="hermandad" value={hermandad}
                    {...register('hermandad')} />

                <div className='xl:grid grid-cols-12 gap-4'>
                    <div className='col-start-1 col-span-3'>
                        <button className="bg-burdeos text-white font-bold p-3 rounded-lg block w-full mt-3">Subir Documento</button>
                    </div>
                </div>
            </form>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
            <div>
                <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                <p> Formulario de subida de nuevo documento. <br />
                    Los asteriscos (<span className="text-red-500">*</span>) indican campos obligatorios.
                </p>
            </div>
        </Modal>
        </div>
    </div>
}
