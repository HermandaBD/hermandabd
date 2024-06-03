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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className='flex-grow'>
          <Routes>
            <Route path='/' element={<MainContent/>} /> {/* Por ahora se deja así pero en verdad se ponen en pages */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/me' element={<MePage />} />
            <Route path='/hermandad' element={<HermandadFormPage />} />
            <Route path='/hermandades' element={<HermandadPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
