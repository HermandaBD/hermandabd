import React from 'react';
import profileImage from '../../utils/logoblanco.png'; // Asegúrate de tener la imagen de perfil en tu proyecto

function Footer() {
  return (
    <footer className="bg-burdeos text-white py-1 px-4 text-center">
      <div className="flex flex-col items-center justify-center">
        <img src={profileImage} alt="Hermandad" className="h-12 w-12 rounded-full mb-2" />
        <span>
          © 2024 HermandadBD, Inc.
        </span>
      </div>
    </footer>
  );
}

export default Footer;




