import React from 'react'
import {useNavigate} from 'react-router-dom'


export function EtiquetaList({etiqueta}) {
    const navigate = useNavigate()
    return (
        <tr onClick={() =>{
            navigate(`/etiquetas/${etiqueta.id}`)
        }} >
            <td className="py-2 px-4 border-b">{etiqueta.nombre}</td>
            <td className="py-2 px-4 border-b">{etiqueta.descripcion}</td>
            <td className="py-2 px-4 border-b">{etiqueta.hermandad}</td>
        </tr>
    )
}