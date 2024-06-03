import React from 'react'

export function PapeletaList({papeleta}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{papeleta.nombre_evento}</td>
            <td className="py-2 px-4 border-b">{papeleta.valor}</td>
            <td className="py-2 px-4 border-b">{papeleta.fecha}</td>
            <td className="py-2 px-4 border-b">{papeleta.hermandad}</td>
        </tr>
    )
}