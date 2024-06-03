import React, { useEffect, useState } from "react";
import { getHermanos } from "../../api/hermano.api";
import { HermanoList } from "../../components/hermano/HermanoList";
export function HermanosPage() {
    const [hermanos, setHermanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getHermanos();
                setHermanos(data.data);
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
            <h1 className="text-2xl font-bold mb-5">Listado de Hermanos</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Número de Hermano</th>
                        <th className="py-2 px-4 border-b">Nombre</th>
                        <th className="py-2 px-4 border-b">Apellidos</th>
                        <th className="py-2 px-4 border-b">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {hermanos.map(hermano => (
                        <HermanoList key={hermano.id} hermano={hermano}/>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}
