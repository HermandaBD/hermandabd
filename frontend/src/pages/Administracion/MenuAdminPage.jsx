import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faRightLeft, faUserPlus,faPlus,  faChartLine, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Modal } from "../../components/Modal";
import { useNavigate } from 'react-router-dom';
export function MenuAdminPage() {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <>
            <div className="mx-auto my-5 p-1 max-w-6xl ">
                <div className='flex justify-between'>
                    <h1 className='font-bold text-2xl text-white'> Acciones para hermanos</h1>
                    <HelpOutlineRoundedIcon onClick={() => setShowModal(true)} className="cursor-pointer self-center" fontSize='large' />
                </div>
            </div>
            <div className="mx-auto p-1 my-1 xl:max-w-6xl l:max-w-xl xl:grid grid-cols-12">
                <div className='col-start-1 col-span-4'>
                    <div className="grid grid-cols-1 gap-10 mb-5">
                        <MenuButton icon={faList} text="LISTADO DE HERMANDADES" link="/hermandades" />
                        <MenuButton icon={faPlus} text="CREACIÓN DE HERMANDAD" link="/hermandad" />
                    </div>
                </div>
                <div className='col-start-9 col-span-4'>
                    <div className="grid grid-cols-1 gap-10 mb-5">
                        <MenuButton icon={faChartLine} text="ESTADISTICAS DE USO" link="/estadisticas" />
                        <MenuButton icon={faRightLeft} text="ASIGNAR HERMANDAD A USER" link="/usuarioHermandad" />
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <h2 className="text-xl font-bold mb-4">Información de ayuda</h2>
                    <p> Acciones de administrador <br />
                    </p>
                </div>
            </Modal>
        </>
    );
}

function MenuButton({ icon, text, link }) {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(link)} className="relative">
            <div className='bg-persian border w-full border-black rounded-md xl:p-10 lg:p-8 sm:p-5 font-bold text-white flex align-middle justify-between cursor-pointer'>
                <FontAwesomeIcon icon={icon} className="mr-2" size='2x' />
                <span>{text}</span>
            </div>
        </div>
    );
}