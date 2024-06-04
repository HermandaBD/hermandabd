import React, { useEffect, useState } from "react";
import { getHermandades } from "../../api/hermandad.api";
import { HermandadList } from "../../components/hermandad/HermandadList";

export function HermandadPage() {
    const [hermandades, setHermandades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getHermandades();
                setHermandades(data.data);
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
            <h1 className="text-2xl font-bold mb-5">Listado de Hermandades</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nombre</th>
                        <th className="py-2 px-4 border-b">Descripcion</th>
                        <th className="py-2 px-4 border-b">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {hermandades.map(hermandad => (
                        <HermandadList key={hermandad.id} hermandad={hermandad}/>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}

