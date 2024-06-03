import React from 'react'

export function HermandadList({hermandad}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{hermandad.nombre}</td>
            <td className="py-2 px-4 border-b">{hermandad.descripcion}</td>
            <td className="py-2 px-4 border-b">{hermandad.email}</td>
        </tr>
    )
}