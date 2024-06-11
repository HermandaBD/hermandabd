import React, { useEffect } from 'react'
import { exportBD } from '../../api/bd.api';

export function ExportarBD() {
    useEffect(() => {
    }, []);

    async function exportar() {
        const response = await exportBD();
        return response
    };

    return <button className='bg-indigo-500' onClick={() => exportar()}>Descargar BD</button>
    
}
