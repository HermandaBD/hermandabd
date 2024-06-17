import React from 'react'
import {useNavigate} from 'react-router-dom'


export function HermanoList({hermano}) {
    const navigate = useNavigate()
    return (
        <tr onClick={() =>{
            navigate(`/hermanos/${hermano.id}`)
        }} >
            <td className="py-2 px-4 border-b">{hermano.numero_hermano}</td>
            <td className="py-2 px-4 border-b">{hermano.nombre}</td>
            <td className="py-2 px-4 border-b">{hermano.apellidos}</td>
            <td className="py-2 px-4 border-b">{hermano.email}</td>
        </tr>
    )
}
