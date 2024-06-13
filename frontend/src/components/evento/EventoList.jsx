import React from 'react'
import {useNavigate} from 'react-router-dom'


export function EventoList({evento}) {
    const navigate = useNavigate()
    return (
        <tr onClick={() =>{
            navigate(`/eventos/${evento.id}`)
        }} >
            <td className="py-2 px-4 border-b">{evento.descripcion}</td>
            <td className="py-2 px-4 border-b">{evento.fecha_inicio}</td>
            <td className="py-2 px-4 border-b">{evento.fecha_fin}</td>
        </tr>
    )
}