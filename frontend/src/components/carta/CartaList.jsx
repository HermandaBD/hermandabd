import React from 'react'
import {useNavigate} from 'react-router-dom'

export function CartaList({carta}) {
    const navigate = useNavigate()
    return (
        <tr onClick={() =>{
            navigate(`/cartas/${carta.id}`)
        }} >
            <td className="py-2 px-4 border-b">{carta.asunto}</td>
            <td className="py-2 px-4 border-b">{carta.fecha_envio}</td>
            <td className="py-2 px-4 border-b">{carta.hermandad}</td>
        </tr>
    )
}