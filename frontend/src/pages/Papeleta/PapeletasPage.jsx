import React, { useEffect, useState } from "react";
import { getPapeletas } from "../../api/papeleta.api";
import { PapeletaList } from "../../components/papeleta/PapeletaList";

export function PapeletasPage() {
    const [papeletas, setPapeletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPapeletas();
                setPapeletas(data.data);
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
            <h1 className="text-2xl font-bold mb-5">Listado de Papeletas</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nombre evento</th>
                        <th className="py-2 px-4 border-b">Valor</th>
                        <th className="py-2 px-4 border-b">Fecha</th>
                        <th className="py-2 px-4 border-b">Hermandad</th>
                    </tr>
                </thead>
                <tbody>
                    {papeletas.map(papeleta => (
                        <PapeletaList key={papeleta.id} papeleta={papeleta}/>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}