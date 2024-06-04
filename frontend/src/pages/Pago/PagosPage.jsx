import React, { useEffect, useState } from "react";
import { getPagos } from "../../api/pago.api";
import { PagoList } from "../../components/pago/PagoList";

export function PagosPage() {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPagos();
                setPagos(data.data);
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
            <h1 className="text-2xl font-bold mb-5">Listado de Pagos</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nombre</th>
                        <th className="py-2 px-4 border-b">Valor</th>
                        <th className="py-2 px-4 border-b">Hermandad</th>
                        <th className="py-2 px-4 border-b">Hermano</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.map(pago => (
                        <PagoList key={pago.id} pago={pago}/>
                    ))}
                </tbody>
            </table>
            <button onClick={() => {
                navigate('/pago')
            }} className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3" >Crear Pago</button>
            
        </div>
    );
}