import React, { useState } from 'react';
import FeatureCard from './FeatureCard';
import { useNavigate } from 'react-router-dom';
import { Modal } from "./Modal";


function MainContent() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  return (
    <main>

      <div className='bg-burdeos text-white py-2 px-4 xl:rounded-br-sm h-70'>
        <div className='xl:grid grid-cols-2 gap-4'>
          <div className='col-span-1'>
            <h1 className='text-3xl mb-4 font-bold  xl:px-48 mt-5 mx-auto text-left'>Un software diseñado para mejorar la gestión de hermandades</h1>
            <p className=' xl:px-48 text-2xl mb-4 mt-5 mx-auto text-left'>De un jartible programador software, para las Hermandades y Cofradías, a buen entendedor pocas palabras bastan.</p><br></br>
            <p className=' xl:px-48 text-2xl mb-4 mx-auto text-left'>Gestiona tú hermandad y cofradía ahorrando tiempo y comeduras de cabeza.</p>

          </div>
          <div className='col-span-1'>
            <img src='../utils/calendar.png' className="w-72 h-72 mx-auto mb-4 mt-2" />
          </div>
        </div>
      </div>
      <div className='xl:grid grid-cols-2 gap-4'>
        <div className='col-span-1 bg-burdeos h-40 xl:rounded-b-full '>
          <button onClick={() => navigate("/register")} className='bg-sandy text-2xl text-black mx-auto block mt-3'>¡Prueba la aplicación!</button>
        </div>
        <div className='col-span-1 bg-white h-40 rounded-tl-full'>
          <h1 className='text-2xl mt-4 text-center block text-black font-bold'>Contacta con nostros y obtén tu plataforma personalizada</h1>
          <button onClick={()=>setShowModal(true)} className='bg-burdeos text-2xl text-white block mx-auto mt-3'>Contáctacnos</button>
        </div>
      </div>
      <div className='xl:grid grid-cols-3 gap-4 mb-5'>
        <div className='col-span-1'>
          <FeatureCard title="Único" />
        </div>
        <div className='col-span-1'>
          <FeatureCard title="En la nube" />
        </div>
        <div className='col-span-1'>
          <FeatureCard title="Cambios rápidos" />
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div>
          <h2 className="text-xl font-bold mb-4">Información de contacto</h2>
          <p> Para más información puede contactar con nosotros a través de:<br/>
            -Correo electrónico: tfghermandades@gmail.com
          </p>
        </div>
      </Modal>

    </main>
  );
}

export default MainContent;


