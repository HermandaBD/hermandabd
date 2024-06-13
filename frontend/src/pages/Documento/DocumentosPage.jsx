import React, { useEffect, useState } from "react";
import { getDocumentos } from "../../api/documento.api";
import { getEtiquetas } from "../../api/etiqueta.api";
import { DocumentoList } from "../../components/documento/DocumentoList";
import { Modal } from "../../components/Modal";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

export function DocumentosPage() {
    const [documentos, setDocumentos] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEtiqueta, setSelectedEtiqueta] = useState("");
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const documentosData = await getDocumentos();
                setDocumentos(documentosData.data);

                const etiquetasData = await getEtiquetas();
                setEtiquetas(etiquetasData.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEtiquetaChange = (e) => {
        setSelectedEtiqueta(e.target.value);
    };

    const filteredDocumentos = documentos.filter((documento) => {
        const matchesSearchTerm = documento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEtiqueta = selectedEtiqueta ? documento.etiquetas.includes(parseInt(selectedEtiqueta)) : true;
        return matchesSearchTerm && matchesEtiqueta;
    });

    if (loading) return <div className="text-center mt-8">Cargando...</div>;
    if (error) return <div className="text-center mt-8">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto my-5">
            <h1 className="text-3xl font-bold mb-5">Explorador de Documentos</h1>
            <div className="flex justify-between mb-5">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded"
                />
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer" />
                <select value={selectedEtiqueta} onChange={handleEtiquetaChange} className="p-2 border border-gray-300 rounded">
                    <option value="">Filtrar por etiqueta</option>
                    {etiquetas.map((etiqueta) => (
                        <option key={etiqueta.id} value={etiqueta.id}>
                            {etiqueta.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                {filteredDocumentos.map(documento => (
                    <DocumentoList key={documento.id} documento={documento} />
                ))}
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p> Busca ficheros por nombre o filtra por etiqueta. <br />
                        Desde esta pantalla también puedes eliminar y descargarte los documentos.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
