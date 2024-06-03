import React from 'react'

export function HermanoList({hermano}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{hermano.numero_hermano}</td>
            <td className="py-2 px-4 border-b">{hermano.nombre}</td>
            <td className="py-2 px-4 border-b">{hermano.apellidos}</td>
            <td className="py-2 px-4 border-b">{hermano.email}</td>
        </tr>
    )
}
