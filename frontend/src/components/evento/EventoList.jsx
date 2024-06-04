import React from 'react'

export function EventoList({evento}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{evento.hermandad}</td>
            <td className="py-2 px-4 border-b">{evento.descripcion}</td>
            <td className="py-2 px-4 border-b">{evento.fecha_inicio}</td>
            <td className="py-2 px-4 border-b">{evento.fecha_fin}</td>
        </tr>
    )
}