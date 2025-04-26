import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './Autenticacion/Inicio/Inicio.jsx'; 
import Login from './Autenticacion/Login/Login.jsx';  
import MostrarDatos from './Autenticacion/MostrarDatos/MostrarDatos.jsx';
import './index.css';
import RegistroCandidato from './Autenticacion/Registro/registroCandidato.jsx';
import RegistroReclutador from './Autenticacion/Registro/registroReclutador.jsx';

function App() {
  return (
    <Router>
      <div className="App"> 
        <Routes>
          <Route path="/" element={<Inicio />} />

          <Route path="/login/:tipoUsuario" element={<Login />} />

          <Route path="/datos-empleados" element={<MostrarDatos />} />

          <Route path="/registro-candidato" element={<RegistroCandidato />} />
          <Route path="/registro-reclutador" element={<RegistroReclutador />} />  

          {/* Futuras rutas (dashboards, etc.) */}
          {/* <Route path="/dashboard-candidato" element={<DashboardCandidato />} /> */}
          {/* <Route path="/dashboard-reclutador" element={<DashboardReclutador />} /> */}

          {/* <Route path="*" element={<div>404 - Página no encontrada</div>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;