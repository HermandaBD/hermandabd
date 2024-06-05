import React, { useEffect, useState } from "react";
import { getPatrimonios } from "../../api/patrimonio.api";
import { PatrimonioList } from "../../components/patrimonio/PatrimonioList";
import { useNavigate } from "react-router-dom";

export function PatrimoniosPage() {
    const [patrimonios, setPatrimonios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPatrimonios();
                setPatrimonios(data.data);
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
            <h1 className="text-2xl font-bold mb-5">Listado de Patrimonios</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nombre</th>
                        <th className="py-2 px-4 border-b">Descripcion</th>
                        <th className="py-2 px-4 border-b">Hermandad</th>
                        <th className="py-2 px-4 border-b">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {patrimonios.map(patrimonio => (
                        <PatrimonioList key={patrimonio.id} patrimonio={patrimonio}/>
                    ))}
                </tbody>
            </table>
            <button onClick={() => {
                navigate('/patrimonio')
            }} className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3" >Crear Patrimonio</button>
            
        </div>
    );
}