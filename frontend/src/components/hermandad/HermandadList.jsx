import React from 'react'
import {useNavigate} from 'react-router-dom'


export function HermandadList({hermandad}) {
    const navigate = useNavigate()
    return (
        <tr onClick={() =>{
            navigate(`/hermandades/${hermandad.id}`)
        }} >
            <td className="py-2 px-4 border-b">{hermandad.nombre}</td>
            <td className="py-2 px-4 border-b">{hermandad.descripcion}</td>
            <td className="py-2 px-4 border-b">{hermandad.email}</td>
        </tr>
    )
}