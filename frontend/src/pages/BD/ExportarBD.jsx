import React, { useEffect } from 'react'
import { exportBD } from '../../api/bd.api';

export function ExportarBD() {
    useEffect(() => {
    }, []);

    async function exportar() {
        const response = await exportBD();
        return response
    };

    return <button className='bg-persian' onClick={() => exportar()}>Descargar BD</button>
    
}
