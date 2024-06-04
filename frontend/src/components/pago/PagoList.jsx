import React from 'react'

export function PagoList({pago}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{pago.nombre}</td>
            <td className="py-2 px-4 border-b">{pago.valor}</td>
            <td className="py-2 px-4 border-b">{pago.hermandad}</td>
            <td className="py-2 px-4 border-b">{pago.hermano}</td>
        </tr>
    )
}