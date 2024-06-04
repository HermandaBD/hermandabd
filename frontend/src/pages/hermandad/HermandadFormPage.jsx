import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createHermandad } from "../../api/hermandad.api" 

export function HermandadFormPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async data => {
        try {
            await createHermandad(data);
            console.log("Hermandad creada");
            navigate('/hermandades'); 
        } catch (error) {
            console.error("Error al crear la hermandad:", error);
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
                    placeholder="Nombre de la hermandad"
                    {...register('nombre', { required: true })} 
                />
                {errors.nombre && <span>Este campo es obligatorio</span>}
                
                <label htmlFor="descripcion">Descripción</label>
                <input 
                    type="text" 
                    name="descripcion" 
                    id="descripcion" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Descripción"
                    {...register('descripcion', { required: true })} 
                />
                {errors.descripcion && <span>Este campo es obligatorio</span>}
                
                <label htmlFor="poblacion">Población</label>
                <input 
                    type="text" 
                    name="poblacion" 
                    id="poblacion" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Población"
                    {...register('poblacion', { required: true })} 
                />
                {errors.poblacion && <span>Este campo es obligatorio</span>}
                
                <label htmlFor="cif">CIF</label>
                <input 
                    type="text" 
                    name="cif" 
                    id="cif" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="CIF"
                    {...register('cif', { required: true, maxLength: 9 })} 
                />
                {errors.cif && <span>Este campo es obligatorio y debe tener un máximo de 9 caracteres</span>}
                
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="example@example.com"
                    {...register('email', { required: true })} 
                />
                {errors.email && <span>Este campo es obligatorio</span>}
                
                <label htmlFor="telefono">Teléfono</label>
                <input 
                    type="text" 
                    name="telefono" 
                    id="telefono" 
                    className="bg-zinc-700 p-3 rounded-lg block w-full my-3" 
                    placeholder="Teléfono"
                    {...register('telefono', { required: true, maxLength: 12 })} 
                />
                {errors.telefono && <span>Este campo es obligatorio y debe tener un máximo de 12 caracteres</span>}
                
                <br />
                <button className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3">Guardar Hermandad</button>
            </form>
        </div>
    );
}

