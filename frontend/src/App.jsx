import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './index.css';
import { LoginPage } from './pages/LoginPage';
import { ActivateAccountPage } from './pages/ActivateAccountPage';
import { MePage } from './pages/MePage';
import { HermanoFormPage } from './pages/Hermano/HermanoFormPage';
import { HermanosPage } from './pages/Hermano/HermanosPage';
import PrivateRoute from './components/PrivateRoute';
import { RegisterFormPage } from './pages/RegisterFormPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition:Bounce />
          <Header />
          <main className='flex-grow'>
            <Routes>
              <Route path='/' element={<MainContent />} /> {/* Por ahora se deja así pero en verdad se ponen en pages */}
              <Route path='/register' element={<RegisterFormPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/activate/:uid/:token' element={<ActivateAccountPage />} />
              <Route path='/me' element={<PrivateRoute element={MePage} />} />
              <Route path='/hermano' element={<PrivateRoute element={HermanoFormPage} />} />
              <Route path='/hermanos' element={<PrivateRoute element={HermanosPage} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  
}

export default App;
