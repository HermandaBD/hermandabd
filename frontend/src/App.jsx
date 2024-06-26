import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { Header } from './components/Header';
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
import { DocumentoFormPage } from './pages/Documento/DocumentoFormPage.jsx';
import { DocumentosPage } from './pages/Documento/DocumentosPage.jsx';
import PrivateRoute from './components/PrivateRoute';
import { RegisterFormPage } from './pages/RegisterFormPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';
import { AuthProvider } from './context/AuthContext';
import { UsuarioHermandadFormPage } from './pages/UsuarioHermandadFormPage.jsx';
import { AdminRoute } from './components/AdminRoute.jsx';
import { ImportarBD } from './pages/BD/ImportarBD.jsx';
import { Usuarios } from './pages/Usuarios.jsx';
import { HermanosBancarioPage } from './pages/Hermano/HermanosBancarioPage.jsx';
import { MenuHermanoPage } from './pages/Hermano/MenuHermanoPage.jsx';
import { MenuInventarioPage } from './pages/Inventario/MenuInventarioPage.jsx';
import { MenuDocumentoPage } from './pages/Documento/MenuDocumentoPage.jsx';
import { MenuMayordomiaPage } from './pages/Pago/MenuMayordomiaPage.jsx';
import { ExportarBD } from './pages/BD/ExportarBD.jsx';
import { SupHeader } from './components/SupHeader.jsx';
import { MenuAdminPage } from './pages/Administracion/MenuAdminPage.jsx';
import { EstadisticasPage } from './pages/Administracion/EstadisticasPage.jsx';




function App() {
  return <AuthProvider>
      <BrowserRouter basename='/'>
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
          <SupHeader/>
          <Header />
          <main className='flex-grow'>
            <Routes>
              <Route path='/' element={<MainContent />} /> {/* Por ahora se deja así pero en verdad se ponen en pages */}
              <Route path='/register' element={<RegisterFormPage />} />
              <Route path='/register/:id' element={<RegisterFormPage />} />
              <Route path='/users' element={<PrivateRoute element={Usuarios} />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/activate/:uid/:token' element={<ActivateAccountPage />} />
              <Route path='/usuarioHermandad' element={<AdminRoute element={UsuarioHermandadFormPage} />}/>
              <Route path='/admin' element={<AdminRoute element={MenuAdminPage} />}/>
              <Route path='/estadisticas' element={<AdminRoute element={EstadisticasPage} />}/>
              <Route path='/me' element={<PrivateRoute element={MePage} />} />
              <Route path='/hermandad' element={<PrivateRoute element={HermandadFormPage} />} />
              <Route path='/hermandades' element={<AdminRoute element={HermandadPage} />} />
              <Route path='/hermandades/:id' element={<AdminRoute element={HermandadFormPage} />} />
              <Route path='/hermano' element={<PrivateRoute element={HermanoFormPage} />} />
              <Route path='/hermano/bancario' element={<PrivateRoute element={HermanosBancarioPage} />} />
              <Route path='/hermano/menu' element={<PrivateRoute element={MenuHermanoPage} />} />
              <Route path='/hermanos' element={<PrivateRoute element={HermanosPage} />} />
              <Route path='/hermanos/:id' element={<PrivateRoute element={HermanoFormPage} />} />
              <Route path='/evento' element={<PrivateRoute element={EventoFormPage} />} />
              <Route path='/eventos' element={<PrivateRoute element={EventosPage} />} />
              <Route path='/eventos/:id' element={<PrivateRoute element={EventoFormPage} />} />
              <Route path='/patrimonio' element={<PrivateRoute element={PatrimonioFormPage} />} />
              <Route path='/patrimonios' element={<PrivateRoute element={PatrimoniosPage} />} />
              <Route path='/patrimonios/:id' element={<PrivateRoute element={PatrimonioFormPage} />} />
              <Route path='/archivo' element={<PrivateRoute element={MenuInventarioPage} />} />
              <Route path='/inventario' element={<PrivateRoute element={InventarioFormPage} />} />
              <Route path='/inventarios' element={<PrivateRoute element={InventariosPage} />} />
              <Route path='/inventarios/:id' element={<PrivateRoute element={InventarioFormPage} />} />
              <Route path='/papeleta' element={<PrivateRoute element={PapeletaFormPage} />} />
              <Route path='/papeletas' element={<PrivateRoute element={PapeletasPage} />} />
              <Route path='/papeletas/:id' element={<PrivateRoute element={PapeletaFormPage} />} />
              <Route path='/carta' element={<PrivateRoute element={CartaFormPage} />} />
              <Route path='/cartas' element={<PrivateRoute element={CartasPage} />} />
              <Route path='/cartas/:id' element={<PrivateRoute element={CartaFormPage} />} />
              <Route path='/pago' element={<PrivateRoute element={PagoFormPage} />} />
              <Route path='/pago/menu' element={<PrivateRoute element={MenuMayordomiaPage} />} />
              <Route path='/pagos' element={<PrivateRoute element={PagosPage} />} />
              <Route path='/pagos/:id' element={<PrivateRoute element={PagoFormPage} />} />
              <Route path='/etiqueta' element={<PrivateRoute element={EtiquetaFormPage} />} />
              <Route path='/etiquetas' element={<PrivateRoute element={EtiquetasPage} />} />
              <Route path='/etiquetas/:id' element={<PrivateRoute element={EtiquetaFormPage} />} />
              <Route path='/documento' element={<PrivateRoute element={DocumentoFormPage} />} />
              <Route path='/documento/menu' element={<PrivateRoute element={MenuDocumentoPage} />} />
              <Route path='/documentos' element={<PrivateRoute element={DocumentosPage} />} />
              <Route path='/import' element={<PrivateRoute element={ImportarBD} />} />
              <Route path='/export' element={<PrivateRoute element={ExportarBD} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
}

export default App;
