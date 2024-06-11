import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createHermano, deleteHermano, updateHermano, getHermano } from "../../api/hermano.api"; 
import { getHermandades } from "../../api/hermandad.api.js";

export function HermanoFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const hermandad = localStorage.getItem('hermandad_usuario');

    const validateDNI = (dni) => {
        const dniRegex = /^\d{8}[A-Z]$/;
        return dniRegex.test(dni) || "DNI debe tener 8 números seguidos de una letra mayúscula";
    };
    
    // Función de validación del IBAN
    const validateIBAN = (iban) => {
        const ibanRegex = /^[A-Z]{2}\d{2}[A-Z\d]{12,30}$/;
        return ibanRegex.test(iban) || "IBAN no es válido";
    };

    const onSubmit = handleSubmit(async data => {
        try {
            if (data.fecha_baja == ''){
                data.fecha_baja = null;
            }
            if (params.id) {
                console.log('Actualizando'); //RUD
                await updateHermano(params.id, data)
            } else {
                await createHermano(data);
                console.log('Crear hermano');
            }
            navigate("/hermanos");
        } catch (error) {
            console.error("Error al crear el hermano:", error);
        }
    });

    useEffect(() => { //RUD
        async function cargarHermano() {
            if (params.id) {
                const {data} = await getHermano(params.id)
                
                setValue('nombre', data.nombre)
                setValue('apellidos', data.apellidos)
                setValue('dni', data.dni)
                setValue('codigo_postal', data.codigo_postal)
                setValue('direccion', data.direccion)
                setValue('email', data.email)
                setValue('fecha_nacimiento', data.fecha_nacimiento)
                setValue('fecha_alta', data.fecha_alta)
                setValue('fecha_baja', data.fecha_baja)
                setValue('forma_pago', data.forma_pago)
                setValue('hermandad', data.hermandad)
                setValue('forma_pago', data.forma_pago)
                setValue('iban', data.iban)
                setValue('localidad', data.localidad)
                setValue('numero_hermano', data.numero_hermano)
                setValue('provincia', data.provincia)
                setValue('telefono', data.telefono)
                setValue('titular_cuenta_bancaria', data.titular_cuenta_bancaria)
                setValue('tutor legal', data.tutor_legal)
            }
        }
        cargarHermano();
    }, [])


    return (
        <div className='max-w-xl mx-auto my-5'>
            <form onSubmit={onSubmit}>
                <label htmlFor="nombre">Nombre</label>
                <input type="text" name="nombre" id="nombre" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('nombre', { required: true })} />
                {errors.nombre && <span>Campo necesario<br /></span>}
                
                <label htmlFor="apellidos">Apellidos</label>
                <input type="text" name="apellidos" id="apellidos" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('apellidos', { required: true })} />
                {errors.apellidos && <span>Campo necesario<br /></span>}

                <label htmlFor="dni">DNI</label>
                <input type="text" name="dni" id="dni" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('dni', { required: true, maxLength: 9, validate: validateDNI })} />
                {errors.dni && <span>Campo necesario, inserta un DNI válido<br /></span>}

                <label htmlFor="codigo_postal">Código Postal</label>
                <input type="number" name="codigo_postal" id="codigo_postal" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('codigo_postal', { required: true, max: 53000 })} />
                {errors.codigo_postal && <span>Campo necesario <br /></span>}

                <label htmlFor="direccion">Dirección</label>
                <input type="text" name="direccion" id="direccion" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('direccion', { required: true })} />
                {errors.direccion && <span>Campo necesario<br /></span>}

                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('email', { required: true })} />
                {errors.email && <span>Campo necesario<br /></span>}

                <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                <input type="date" name="fecha_nacimiento" id="fecha_nacimiento" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('fecha_nacimiento', { required: true })} />
                {errors.fecha_nacimiento && <span>Campo necesario<br /></span>}

                <label htmlFor="fecha_alta">Fecha de Alta</label>
                <input type="date" name="fecha_alta" id="fecha_alta" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('fecha_alta', { required: true })} />
                {errors.fecha_alta && <span>Campo necesario<br /></span>}

                <label htmlFor="fecha_baja">Fecha de Baja</label>
                <input type="date" name="fecha_baja" id="fecha_baja" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('fecha_baja')} />

                <label htmlFor="forma_pago">Forma de Pago</label>
                <input type="text" name="forma_pago" id="forma_pago" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('forma_pago', { required: true })} />
                {errors.forma_pago && <span>Campo necesario<br /></span>}

                <input type="hidden" id="hermandad" name="hermandad" value={hermandad} 
                    {...register('hermandad')}/>

                <label htmlFor="iban">IBAN</label>
                <input type="text" name="iban" id="iban" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('iban', { required: true, maxLength: 24, validate: validateIBAN })} />
                {errors.iban && <span>Campo necesario, inserta un IBAN válido<br /></span>}

                <label htmlFor="localidad">Localidad</label>
                <input type="text" name="localidad" id="localidad" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('localidad', { required: true })} />
                {errors.localidad && <span>Campo necesario<br /></span>}

                <label htmlFor="numero_hermano">Número de Hermano</label>
                <input readOnly type="number" name="numero_hermano" id="numero_hermano" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                /* {...register('numero_hermano')} */ />
                {/* {errors.numero_hermano && <span>Campo necesario<br /></span>} */}

                <label htmlFor="provincia">Provincia</label>
                <input type="text" name="provincia" id="provincia" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('provincia', { required: true })} />
                {errors.provincia && <span>Campo necesario<br /></span>}

                <label htmlFor="telefono">Teléfono</label>
                <input type="text" name="telefono" id="telefono" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('telefono', { required: true, maxLength: 12 })} />
                {errors.telefono && <span>Campo necesario and must be max 12 characters<br /></span>}

                <label htmlFor="titular_cuenta_bancaria">Titular de la Cuenta Bancaria</label>
                <input type="text" name="titular_cuenta_bancaria" id="titular_cuenta_bancaria" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('titular_cuenta_bancaria', { required: true})} />
                {errors.titular_cuenta_bancaria && <span>Campo necesario<br /></span>}

                <label htmlFor="tutor_legal">Tutor Legal</label>
                <input type="text" name="tutor_legal" id="tutor_legal" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('tutor_legal')} />

                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Hermano</button>
            </form>
            {params.id && <button onClick={async () => {
                const accepted = window.confirm('¿Estás seguro?')
                if (accepted) {
                    await deleteHermano(params.id);
                    navigate("/hermanos");
                }
            }} className="bg-red-500 font-bold p-3 rounded-lg block w-full mt-3">Eliminar</button>} 
        </div>
    );
}

