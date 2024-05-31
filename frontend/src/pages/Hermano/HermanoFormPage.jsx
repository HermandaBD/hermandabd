import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createHermano } from "../../api/hermano.api"; 

export function HermanoFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
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
            await createHermano(data);
            navigate('/hermanos'); 
        } catch (error) {
            console.error("Error al crear el hermano:", error);
        }
    });

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

                <label htmlFor="hermandad">Hermandad</label>
                <input type="number" name="hermandad" id="hermandad" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('hermandad', { required: true })} />
                {errors.hermandad && <span>Campo necesario<br /></span>}

                <label htmlFor="iban">IBAN</label>
                <input type="text" name="iban" id="iban" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('iban', { required: true, maxLength: 24, validate: validateIBAN })} />
                {errors.iban && <span>Campo necesario, inserta un IBAN válido<br /></span>}

                <label htmlFor="localidad">Localidad</label>
                <input type="text" name="localidad" id="localidad" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('localidad', { required: true })} />
                {errors.localidad && <span>Campo necesario<br /></span>}

                <label htmlFor="numero_hermano">Número de Hermano</label>
                <input type="number" name="numero_hermano" id="numero_hermano" className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                {...register('numero_hermano', { required: true, max: 999999 })} />
                {errors.numero_hermano && <span>Campo necesario<br /></span>}

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

                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Crear Hermano</button>
            </form>
        </div>
    );
}

