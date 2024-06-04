import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './index.css';
import { LoginPage } from './pages/LoginPage';
import { ActivateAccountPage } from './pages/ActivateAccountPage';
import { MePage } from './pages/MePage';
import { HermandadFormPage } from './pages/hermandad/HermandadFormPage';
import { HermandadPage } from './pages/hermandad/HermandadPage';
import { HermanoFormPage } from './pages/Hermano/HermanoFormPage';
import { HermanosPage } from './pages/Hermano/HermanosPage';
import { EventoFormPage } from './pages/Evento/EventoFormPage';
import { EventosPage } from './pages/Evento/EventosPage';
import { PatrimonioFormPage } from './pages/Patrimonio/PatrimonioFormPage.jsx';
import { PatrimoniosPage } from './pages/Patrimonio/PatrimoniosPage';
import { InventarioFormPage } from './pages/Inventario/InventarioFormPage.jsx';
import { InventariosPage } from './pages/Inventario/InventariosPage';
import { PapeletaFormPage } from './pages/Papeleta/PapeletaFormPage.jsx';
import { PapeletasPage } from './pages/Papeleta/PapeletasPage';
import { CartaFormPage } from './pages/Carta/CartaFormPage.jsx';
import { CartasPage } from './pages/Carta/CartasPage.jsx';
import { PagoFormPage } from './pages/Pago/PagoFormPage.jsx';
import { PagosPage } from './pages/Pago/PagosPage.jsx';
import { EtiquetaFormPage } from './pages/Etiqueta/EtiquetaFormPage.jsx';
import { EtiquetasPage } from './pages/Etiqueta/EtiquetasPage.jsx';
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
              <Route path='/hermandad' element={<PrivateRoute element={HermandadFormPage} />} />
              <Route path='/hermandades' element={<PrivateRoute element={HermandadPage} />} />
              <Route path='/hermano' element={<PrivateRoute element={HermanoFormPage} />} />
              <Route path='/hermanos' element={<PrivateRoute element={HermanosPage} />} />
              <Route path='/evento' element={<PrivateRoute element={EventoFormPage} />} />
              <Route path='/eventos' element={<PrivateRoute element={EventosPage} />} />
              <Route path='/patrimonio' element={<PrivateRoute element={PatrimonioFormPage} />} />
              <Route path='/patrimonios' element={<PrivateRoute element={PatrimoniosPage} />} />
              <Route path='/inventario' element={<PrivateRoute element={InventarioFormPage} />} />
              <Route path='/inventarios' element={<PrivateRoute element={InventariosPage} />} />
              <Route path='/papeleta' element={<PrivateRoute element={PapeletaFormPage} />} />
              <Route path='/papeletas' element={<PrivateRoute element={PapeletasPage} />} />
              <Route path='/carta' element={<PrivateRoute element={CartaFormPage} />} />
              <Route path='/cartas' element={<PrivateRoute element={CartasPage} />} />
              <Route path='/pago' element={<PrivateRoute element={PagoFormPage} />} />
              <Route path='/pagos' element={<PrivateRoute element={PagosPage} />} />
              <Route path='/etiqueta' element={<PrivateRoute element={EtiquetaFormPage} />} />
              <Route path='/etiquetas' element={<PrivateRoute element={EtiquetasPage} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
}

export default App;
