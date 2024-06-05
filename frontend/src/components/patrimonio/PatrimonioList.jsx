import React from 'react'
import {useNavigate} from 'react-router-dom'

export function PatrimonioList({patrimonio}) {
    const navigate = useNavigate()
    return (
        <tr onClick={() =>{
            navigate(`/patrimonios/${patrimonio.id}`)
        }} >
            <td className="py-2 px-4 border-b">{patrimonio.nombre}</td>
            <td className="py-2 px-4 border-b">{patrimonio.descripcion}</td>
            <td className="py-2 px-4 border-b">{patrimonio.hermandad}</td>
            <td className="py-2 px-4 border-b">{patrimonio.valor}</td>
        </tr>
    )
}