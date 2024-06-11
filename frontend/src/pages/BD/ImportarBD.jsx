import React from 'react'
import CSVUpload from '../../components/bd/CSVUpload'
import { ExportarBD } from './ExportarBD'

export function ImportarBD() {
    return (
        <>
        <div className="container mx-auto px-4 py-8 text-black">
            <h1 className="text-3xl font-semibold mb-8 text-white">Subir Archivos CSV</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CSVUpload model="hermano" />
            </div>
        </div>
        <div className='container mx-auto px-4 py-8 text-black'>
            <h1 className='text-3xl font-semibold mb-8 text-white'>Exportar hermanos</h1>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                <ExportarBD/>
            </div>
        </div>
        </>
    )
}
