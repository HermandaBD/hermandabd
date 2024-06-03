import React from 'react'

export function InventarioList({inventario}) {
    return (
        <tr>
            <td className="py-2 px-4 border-b">{inventario.nombre}</td>
            <td className="py-2 px-4 border-b">{inventario.descripcion}</td>
            <td className="py-2 px-4 border-b">{inventario.ubicacion}</td>
            <td className="py-2 px-4 border-b">{inventario.hermandad}</td>
        </tr>
    )
}