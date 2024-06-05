import React from 'react'
import {useNavigate} from 'react-router-dom'

export function PapeletaList({papeleta}) {
    const navigate = useNavigate()
    return (
        <tr onClick={() =>{
            navigate(`/papeletas/${papeleta.id}`)
        }} >
            <td className="py-2 px-4 border-b">{papeleta.nombre_evento}</td>
            <td className="py-2 px-4 border-b">{papeleta.valor}</td>
            <td className="py-2 px-4 border-b">{papeleta.fecha}</td>
            <td className="py-2 px-4 border-b">{papeleta.hermandad}</td>
        </tr>
    )
}