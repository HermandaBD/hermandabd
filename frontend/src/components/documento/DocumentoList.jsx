import React from 'react'

export function DocumentoList({documento}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{documento.nombre}</td>
            <td className="py-2 px-4 border-b">{documento.ruta}</td>
            <td className="py-2 px-4 border-b">{documento.hermandad}</td>
            <td className="py-2 px-4 border-b">{documento.etiquetas}</td>
        </tr>
    )
}