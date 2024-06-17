import React from 'react'
import {useNavigate} from 'react-router-dom'

export function PagoList({pago}) {
    const navigate = useNavigate()
    return (
        <tr onClick={() =>{
            navigate(`/pagos/${pago.id}`)
        }} >
            <td className="py-2 px-4 border-b">{pago.nombre}</td>
            <td className="py-2 px-4 border-b">{pago.valor}</td>
            <td className="py-2 px-4 border-b">{pago.hermandad}</td>
            <td className="py-2 px-4 border-b">{pago.hermano}</td>
        </tr>
    )
}