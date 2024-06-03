import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './index.css';
import { LoginPage } from './pages/LoginPage';
import { MePage } from './pages/MePage';
import { HermandadFormPage } from './pages/hermandad/HermandadFormPage';
import { HermandadPage } from './pages/hermandad/HermandadPage';
import { HermanoFormPage } from './pages/Hermano/HermanoFormPage';
import { HermanosPage } from './pages/Hermano/HermanosPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className='flex-grow'>
          <Routes>
            <Route path='/' element={<MainContent/>} /> {/* Por ahora se deja así pero en verdad se ponen en pages */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/me' element={<PrivateRoute element={MePage} />} /> 
            <Route path='/hermandad' element={<HermandadFormPage />} />
            <Route path='/hermandades' element={<HermandadPage />} />
            <Route path='/hermano' element={<PrivateRoute element={HermanoFormPage} />} />
            <Route path='/hermanos' element={<PrivateRoute element={HermanosPage} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
