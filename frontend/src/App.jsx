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
import AltaBajaMod from './Autenticacion/ABM/AltaBajaMod.jsx';
import DashboardCandidato from './DashboardCandidato/DashboardCandidato.jsx';
import DashboardEmpleado from './DashboardEmpleado/DashboardEmpleado.jsx';
import DashboardHomeGerente from './DashboardGerente/DashboardHomeGerente.jsx';
import ConfiguracionPorPuesto from './DashboardGerente/ConfiguracionPorPuesto.jsx';
import PantallaDeRiesgosEmpleados from './DashboardGerente/PantallaDeRiesgosEmpleados.jsx';
import './index.css';
import GestionLicencias from './DashboardReclutador/pages/gestionLicencias.jsx';
import DashboardGerenteLayout from './DashboardGerente/DashboardGerenteLayout.jsx';
import DashboardAdminLayout from './DashboardAdmin/DashboardAdminLayout.jsx';
//import ProtectedRoute from './Autenticacion/ProtectedRoute.jsx';
import ABMEmpleadosAdmin from './DashboardAdmin/pages/ABMEmpleadosAdmin.jsx';
import ABMCandidatosAdmin from './DashboardAdmin/pages/ABMCandidatosAdmin.jsx';
import GestionConvocatoriasAdmin from './DashboardAdmin/pages/GestionConvocatoriasAdmin.jsx';
import GestionLicenciasAdmin from './DashboardAdmin/pages/GestionLicenciasAdmin.jsx';
import GestionEncuestasAdmin from './DashboardAdmin/pages/GestionEncuestasAdmin.jsx';
import ReportesAdmin from './DashboardAdmin/pages/ReportesAdmin.jsx';
import VisualizacionAnomaliasAdmin from './DashboardAdmin/pages/VisualizacionAnomaliasAdmin.jsx';
import ConfiguracionSistemaAdmin from './DashboardAdmin/pages/ConfiguracionSistemaAdmin.jsx';
import GestionUsuarios from './DashboardAdmin/pages/GestionUsuarios.jsx';
import AdminHome from './DashboardAdmin/pages/AdminHome.jsx';
import DeteccionAnomalias from './DashboardReclutador/pages/DeteccionAnomalias.jsx';
function App() {
  return (
    <Router> {/* Envuelve todo en el Router */}
      <Routes> {/* Define el área donde cambian las rutas */}

        {/* --- Rutas Públicas --- */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login/candidato" element={<Login />} />
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
           <Route path="gestion-licencias" element={<GestionLicencias />} />
           <Route path="AltaBajaMod" element={<AltaBajaMod />} />
           <Route path="deteccion-anomalias" element={<DeteccionAnomalias />} />
        </Route>
        <Route
                        path="/dashboard/admin"
                        element={<DashboardAdminLayout />}>
                        <Route index element={<AdminHome />} /> {/* Ruta por defecto para /admin */}
                        <Route path="usuarios" element={<GestionUsuarios />} />
                        <Route path="empleados" element={<ABMEmpleadosAdmin />} />
                        <Route path="candidatos" element={<ABMCandidatosAdmin />} />
                        <Route path="convocatorias" element={<GestionConvocatoriasAdmin />} />
                        <Route path="licencias" element={<GestionLicenciasAdmin />} />
                        <Route path="encuestas" element={<GestionEncuestasAdmin />} />
                        <Route path="reportes" element={<ReportesAdmin />} />
                        <Route path="anomalias" element={<VisualizacionAnomaliasAdmin />} />
                        <Route path="configuracion" element={<ConfiguracionSistemaAdmin />} />
                    </Route>

         <Route path="/dashboard/candidato" element={<DashboardCandidato/>}/>
          <Route path="/dashboard/empleado" element={<DashboardEmpleado />} />
          <Route path="/dashboard/gerente" element={<DashboardGerenteLayout/>} />

        {/* <Route path="/dashboard/candidato" element={<DashboardCandidatoLayout />}>...</Route> */}


        <Route path="/dashboard/gerente" element={<DashboardGerenteLayout />}>
            <Route index element={<DashboardHomeGerente />} />
            <Route path="registro-candidato" element={<RegistroCandidato />} />
            <Route path="config" element={<ConfiguracionPorPuesto />} />
            <Route path="riesgos-empleados" element={<PantallaDeRiesgosEmpleados />} />
            {/* Acá van más rutas del gerente */}
        </Route>


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