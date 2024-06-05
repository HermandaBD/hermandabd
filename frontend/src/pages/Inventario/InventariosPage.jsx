import React, { useEffect, useState } from "react";
import { getInventarios } from "../../api/inventario.api";
import { InventarioList } from "../../components/inventario/InventarioList";
import { useNavigate } from "react-router-dom";


export function InventariosPage() {
    const [inventarios, setInventarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getInventarios();
                setInventarios(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='max-w-4xl mx-auto my-5'>
            <h1 className="text-2xl font-bold mb-5">Listado de Inventarios</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nombre</th>
                        <th className="py-2 px-4 border-b">Descripcion</th>
                        <th className="py-2 px-4 border-b">Ubicacion</th>
                        <th className="py-2 px-4 border-b">Hermandad</th>
                    </tr>
                </thead>
                <tbody>
                    {inventarios.map(inventario => (
                        <InventarioList key={inventario.id} inventario={inventario}/>
                    ))}
                </tbody>
            </table>
            <button onClick={() => {
                navigate('/inventario')
            }} className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3" >Crear Inventario</button>
            
        </div>
    );
}