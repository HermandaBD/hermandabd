import React, { useEffect, useState } from "react";
import { getEventos } from "../../api/evento.api";
import { EventoList } from "../../components/evento/EventoList";

export function EventosPage() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getEventos();
                setEventos(data.data);
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
            <h1 className="text-2xl font-bold mb-5">Listado de Eventos</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Hermandad</th>
                        <th className="py-2 px-4 border-b">Descripcion</th>
                        <th className="py-2 px-4 border-b">Fecha inicio</th>
                        <th className="py-2 px-4 border-b">Fecha fin</th>
                    </tr>
                </thead>
                <tbody>
                    {eventos.map(evento => (
                        <EventoList key={evento.id} evento={evento}/>
                    ))}
                </tbody>
            </table>
            <button onClick={() => {
                navigate('/evento')
            }} className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3" >Crear Evento</button>
            
        </div>
    );
}

