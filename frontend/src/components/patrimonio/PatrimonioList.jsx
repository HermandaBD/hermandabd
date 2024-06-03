import React from 'react'

export function PatrimonioList({patrimonio}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{patrimonio.nombre}</td>
            <td className="py-2 px-4 border-b">{patrimonio.descripcion}</td>
            <td className="py-2 px-4 border-b">{patrimonio.hermandad}</td>
            <td className="py-2 px-4 border-b">{patrimonio.valor}</td>
        </tr>
    )
}