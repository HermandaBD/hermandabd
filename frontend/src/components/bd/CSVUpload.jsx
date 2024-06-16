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
        <div className="my-1 p-4 block rounded-md ">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-start-1 col-span-5">
                        <label htmlFor="file">Archivo a importar <span className='text-red-500'>*</span></label>
                        <input type="file" id='file' accept=".csv" onChange={handleFileChange} className="py-2 my-1 px-4 border border-gray-300 rounded-md" />
                    </div>
                    <div className="col-start-1 col-span-3">
                        <button type="submit" className="bg-burdeos text-white py-2 px-4 rounded-md">Subir</button>
                    </div>
                </div>
            </form>
            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    );
};

export default CSVUpload;
