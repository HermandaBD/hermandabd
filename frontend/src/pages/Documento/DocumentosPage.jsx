import React, { useEffect, useState } from "react";
import { getDocumentos } from "../../api/documento.api";
import { DocumentoList } from "../../components/documento/DocumentoList";

export function DocumentosPage() {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getDocumentos();
                setDocumentos(data.data);
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
            <h1 className="text-2xl font-bold mb-5">Listado de Documentos</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nombre</th>
                        <th className="py-2 px-4 border-b">Ruta</th>
                        <th className="py-2 px-4 border-b">Hermandad</th>
                        <th className="py-2 px-4 border-b">Etiquetas</th>
                    </tr>
                </thead>
                <tbody>
                    {cartas.map(carta => (
                        <CartaList key={carta.id} carta={carta}/>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}