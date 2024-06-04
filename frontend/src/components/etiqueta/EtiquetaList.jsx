import React from 'react'

export function EtiquetaList({etiqueta}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{etiqueta.nombre}</td>
            <td className="py-2 px-4 border-b">{etiqueta.descripcion}</td>
            <td className="py-2 px-4 border-b">{etiqueta.hermandad}</td>
        </tr>
    )
}