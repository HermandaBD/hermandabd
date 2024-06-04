import React from 'react'

export function CartaList({carta}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{carta.asunto}</td>
            <td className="py-2 px-4 border-b">{carta.fecha_envio}</td>
            <td className="py-2 px-4 border-b">{carta.hermandad}</td>
        </tr>
    )
}