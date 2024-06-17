import React, { useState } from 'react'
import CSVUpload from '../../components/bd/CSVUpload'
import { ExportarBD } from './ExportarBD'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";

export function ImportarBD() {

    const [showModal, setShowModal] = useState(false);
    return (
        <div className='max-w-2xl p-10 mx-auto my-5'>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Importación fichero hermanos</h1>
                <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" />
            </div>
            <div className='max-w-2xl p-10 mx-auto my-5 bg-gray-200 outline outline-black rounded-xl'>
                <div className="">
                    <CSVUpload model="hermano" />
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p> Importación de hermanos. <br />
                        El fichero a importar debe ser un CSV, si exporta su listado de hermanos conseguirá un fichero de ejemplo de como debe ser la importación.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
