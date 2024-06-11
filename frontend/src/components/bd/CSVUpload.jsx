import React, { useState } from 'react';
import { importBD } from '../../api/bd.api';
import { toast } from 'react-toastify';

const CSVUpload = ({ model }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Por favor, selecciona un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        const response = await importBD(model, formData);
        if (response.status == 201){
            toast.success("Importación exitosa");
        }else{
            toast.error("Ocurrió un error al importar ")
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Subir CSV para {model}</h2>
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                <input type="file" accept=".csv" onChange={handleFileChange} className="py-2 px-4 border border-gray-300 rounded-md" />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Subir</button>
            </form>
            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    );
};

export default CSVUpload;
