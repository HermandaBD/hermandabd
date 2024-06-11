import React, { useEffect, useState } from 'react'
import { getEtiquetas } from '../../api/etiqueta.api';
import { deleteDocumento } from '../../api/documento.api';
import { toast } from 'react-toastify';
export function DocumentoList({ documento }) {

    const [etiquetas, setEtiquetas] = useState([]);
    useEffect(() => {
        async function fetchEtiquetas() {
            const response = await getEtiquetas();
            setEtiquetas(response.data);
        }
        fetchEtiquetas();
    }, []);

    const eliminarDocumento = async id => {
        const response = await deleteDocumento(id);
        if (response.status == 204 || response.status == 200){
            toast.success("Documento eliminado con éxito");
        }else{
            toast.error("Ocurrió un error al eliminar el archivo");
        }
    };
    // ! SOLUCIÓN UN POCO CUTRE Y MALA PARAR SACAR EL NOMBRE DE LA ETIQUETA, POR AHORA FUNCIONAL
    return (
        <tr>
            <td className="py-2 px-4 border-b">{documento.nombre}</td>
            <td className="py-2 px-4 border-b"><a href={documento.archivo} target='_blank' rel="noopener noreferrer">Descargar</a><button className='bg-red-500 text-white mx-2 p-1' onClick={() => eliminarDocumento(documento.id)}>Eliminar</button></td>
            <td className="py-2 px-4 border-b">
                {documento.etiquetas && documento.etiquetas.length > 0 ? (
                    documento.etiquetas.map((etiqueta) => (
                        <span key={etiqueta} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">
                            {etiquetas.map((e) => (
                                e.id == etiqueta ? e.nombre : ""
                            ))}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-500">Sin etiquetas</span>
                )}
            </td>
        </tr>
    )
}