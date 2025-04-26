import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inicio from './Autenticacion/Inicio/Inicio.jsx';
import Login from './Autenticacion/Login/Login.jsx';
import RegistroCandidato from './Autenticacion/Registro/registroCandidato.jsx';
import RegistroReclutador from './Autenticacion/Registro/registroReclutador.jsx';
import DashboardReclutadorLayout from './DashboardReclutador/DashboardReclutadorLayout.jsx';
import DashboardHome from './DashboardReclutador/pages/DashboardHome.jsx';
import CrearConvocatoria from './DashboardReclutador/pages/CrearConvocatoria.jsx';
import VerConvocatorias from './DashboardReclutador/pages/VerConvocatorias.jsx';
import VerCandidatos from './DashboardReclutador/pages/VerCandidatos.jsx';
import GestionEmpleados from './DashboardReclutador/pages/GestionEmpleados.jsx';
import './index.css';

function App() {
  return (
    <Router> {/* Envuelve todo en el Router */}
      <Routes> {/* Define el área donde cambian las rutas */}

        {/* --- Rutas Públicas --- */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login/:tipoUsuario" element={<Login />} />
        <Route path="/registro-candidato" element={<RegistroCandidato />} />
        <Route path="/registro-reclutador" element={<RegistroReclutador />} />
        {/* <Route path="/recuperar-contraseña/:tipoUsuario" element={<RecuperarContraseña />} /> */}


        {/* --- Rutas Dashboard Reclutador (Protegidas) --- */}
        <Route path="/dashboard/reclutador" element={<DashboardReclutadorLayout />}>
           <Route index element={<DashboardHome />} />
           <Route path="crear-convocatoria" element={<CrearConvocatoria />} />
           <Route path="mis-convocatorias" element={<VerConvocatorias />} />
           <Route path="convocatoria/:convocatoriaId/candidatos" element={<VerCandidatos />} />
           <Route path="gestion-empleados" element={<GestionEmpleados />} />
        </Route>


        {/* <Route path="/dashboard/candidato" element={<DashboardCandidatoLayout />}>...</Route> */}


        {/* --- Ruta Catch-All para Página No Encontrada (404) --- */}
        {/* Esta ruta debe ir al final */}
        <Route path="*" element={
            <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
              <h2>404 - Página No Encontrada</h2>
              <p>La página que buscas no existe o fue movida.</p>
              <Link to="/" style={{color: '#1e3a8a', fontWeight: '600'}}>Volver al Inicio</Link>
            </div>
          } />

      </Routes>
    </Router>
  );
}

export default App;