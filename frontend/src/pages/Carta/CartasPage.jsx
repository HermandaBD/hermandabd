import React, { useEffect, useState } from "react";
import { getCartas } from "../../api/carta.api";
import { CartaList } from "../../components/carta/CartaList";
import { useNavigate } from "react-router-dom";
import { Cargando } from "../../components/Cargando";


export function CartasPage() {
    const [cartas, setCartas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getCartas();
                setCartas(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <Cargando/>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='max-w-4xl mx-auto my-5'>
            <h1 className="text-2xl font-bold mb-5">Listado de Cartas</h1>
            <table className="min-w-full bg-red-100 text-black border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Asunto</th>
                        <th className="py-2 px-4 border-b">Fecha envio</th>
                        <th className="py-2 px-4 border-b">Hermandad</th>
                    </tr>
                </thead>
                <tbody>
                    {cartas.map(carta => (
                        <CartaList key={carta.id} carta={carta}/>
                    ))}
                </tbody>
            </table>
            <button onClick={() => {
                navigate('/carta')
            }} className="bg-indigo-500 font-bold p-3 rounded-lg block w-full mt-3" >Crear Carta</button>
            
        </div>
    );
}