import React from 'react';
import FeatureCard from './FeatureCard';


function MainContent() {
  return (
    <main className="bg-red-500 text-white flex-1 p-8 flex flex-col items-center">
      <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">
        Consigue tu acceso
      </button>
      <h1 className="text-2xl mb-4 text-center">Un software diseñado para mejorar la gestión de las hermandades</h1>
      <p className="mb-6 text-center">
        De un humilde programador software, para las Hermandades y Cofradías, a buen entendedor pocas palabras bastan.
        Gestiona tu hermandad y cofradía ahorrando tiempo y comeduras de cabeza.
      </p>
      <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded mb-6">
        ¡Prueba la aplicación!
      </button>
      <div className="bg-white text-red-500 p-6 rounded shadow-lg mb-6 text-center w-80">
        <img src='../utils/calendar.png' className="w-16 h-16 mx-auto mb-4" />
        <p>Contacta con nosotros y obtén tu plataforma personalizada</p>
        <button className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
          Contáctanos
        </button>
      </div>
      <div className="flex space-x-4">
        <FeatureCard title="Único" />
        <FeatureCard title="En la nube" />
        <FeatureCard title="Cambios rápidos" />
      </div>
    </main>
  );
}

export default MainContent;


