// DocumentoList.jsx
import React, { useEffect, useState } from 'react';
import { getEtiquetas } from '../../api/etiqueta.api';
import { deleteDocumento } from '../../api/documento.api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFilePdf, faFileWord, faFileExcel, faFileImage, faFileVideo, faFileAudio, faFileArchive, faFile, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';

export function DocumentoList({ documento }) {
    const [etiquetas, setEtiquetas] = useState([]);

    useEffect(() => {
        async function fetchEtiquetas() {
            try {
                const response = await getEtiquetas();
                setEtiquetas(response.data);
            } catch (error) {
                console.error("Error al cargar etiquetas:", error);
            }
        }
        fetchEtiquetas();
    }, []);

    const eliminarDocumento = async id => {
        try {
            const response = await deleteDocumento(id);
            if (response.status === 204 || response.status === 200) {
                toast.success("Documento eliminado con éxito");
            } else {
                toast.error("Ocurrió un error al eliminar el archivo");
            }
        } catch (error) {
            console.error("Error al eliminar documento:", error);
            toast.error("Ocurrió un error al eliminar el archivo");
        }
    };

    const getIconByMimeType = (mimeType) => {
        switch (mimeType) {
            case 'pdf':
                return faFilePdf;
            case 'msword':
            case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                return faFileWord;
            case 'vnd.ms-excel':
            case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return faFileExcel;
            case 'jpeg':
            case 'png':
            case 'gif':
                return faFileImage;
            case 'mp4':
                return faFileVideo;
            case 'mpeg':
                return faFileAudio;
            case 'zip':
            case 'x-rar-compressed':
                return faFileArchive;
            default:
                return faFile;
        }
    };

    return (
        <div className="flex items-center justify-between border-b py-2">
            <div className="flex items-center">
                <FontAwesomeIcon icon={getIconByMimeType(documento.mime_type)} className="text-2xl text-gray-500 mr-4" />
                <span className="text-lg font-semibold">{documento.nombre}</span>
            </div>
            <div className="flex items-center">
                <a href={documento.archivo} target='_blank' rel="noopener noreferrer" className="text-blue-500 mx-2">
                    <FontAwesomeIcon icon={faDownload} className="text-xl" />
                </a>
                <button onClick={() => eliminarDocumento(documento.id)} className='text-red-500 mx-2 bg-white'>
                    <FontAwesomeIcon icon={faTrash} className="text-xl" />
                </button>
            </div>
            <div className="flex flex-wrap">
                {documento.etiquetas && documento.etiquetas.length > 0 ? (
                    documento.etiquetas.map((etiquetaId, index) => {
                        const etiqueta = etiquetas.find(e => e.id === etiquetaId);
                        return (
                            <span
                                key={index}
                                className="inline-block rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
                                style={{ backgroundColor: etiqueta ? etiqueta.color : '#ccc', color: '#fff' }}
                            >
                                {etiqueta ? etiqueta.nombre : ''}
                            </span>
                        );
                    })
                ) : (
                    <span className="text-gray-500">Sin etiquetas</span>
                )}
            </div>
        </div>
    );
}
