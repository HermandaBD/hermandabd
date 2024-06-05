import React from 'react'
import {useNavigate} from 'react-router-dom'


export function InventarioList({inventario}) {
    const navigate = useNavigate()
    return (
        <tr  onClick={() =>{
            navigate(`/inventarios/${inventario.id}`)
        }} >
            <td className="py-2 px-4 border-b">{inventario.nombre}</td>
            <td className="py-2 px-4 border-b">{inventario.descripcion}</td>
            <td className="py-2 px-4 border-b">{inventario.ubicacion}</td>
            <td className="py-2 px-4 border-b">{inventario.hermandad}</td>
        </tr>
    )
}