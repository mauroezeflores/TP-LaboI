import React, { useState } from 'react';
import styles from './Dashboardempleado.module.css';
import { NavLink ,useNavigate} from 'react-router-dom';
import { EncuestaSatisfaccionEmpleado } from "./EncuestaSatisfaccionEmpleado";
import { useEffect } from 'react';
import { getUsuarioActual } from '../services/authService';
import LogoutButton from '../components/LogoutButton'; // Asegúrate de que la ruta sea correcta
const DashboardEmpleado = () => {
  const navigate = useNavigate();
    const usuario = getUsuarioActual();
  useEffect(() => {
      if (!usuario || usuario.rol?.toLowerCase() !== 'empleado') {
        navigate('/login/candidato');
      }
    }, [usuario, navigate]);
  
    // Extrae datos del empleado si existen
    const empleado = usuario?.empleado || {};
    const [empleadoInfo, setempleadoInfo] = useState({
      nombre: empleado.nombre || '',
      apellido: empleado.apellido || '',
      puesto: empleado.puesto || '',
      fechaIngreso: empleado.fecha_ingreso || '',
      dni: empleado.dni || '',
      email: empleado.email || usuario?.email || '',
      ubicacion: empleado.ciudad || '',
      telefono: empleado.tel_num_telefono || '',
    });

  const licencias = [
    // Datos de ejemplo de licencias del empleado
    { id: 1, fechaSolicitud: "2025-04-15", motivo: "Médica", estado: "Aprobada", fechaInicio: "2025-04-20", fechaFin: "2025-04-22", documento: "certificado_medico.pdf" },
    { id: 2, fechaSolicitud: "2025-03-10", motivo: "Examen", estado: "Aprobada", fechaInicio: "2025-03-15", fechaFin: "2025-03-15", documento: "constancia_examen.pdf" },
    { id: 3, fechaSolicitud: "2025-04-28", motivo: "Personal", estado: "Pendiente Aprobación", fechaInicio: "2025-05-05", fechaFin: "2025-05-05", documento: null },
  ];

  const historialDesempeno = [
    // Datos de ejemplo
    { periodo: "Q1 2025", evaluacion: "Supera expectativas", prediccionRendimiento: 85 }, // [cite: 9]
    { periodo: "Q4 2024", evaluacion: "Cumple expectativas", prediccionRendimiento: 70 },
  ];

  const registrosAsistencia = [
    // Datos de ejemplo
    { fecha: "2025-04-28", entrada: "08:55", salida: "18:05", horas: 8.17 },
    { fecha: "2025-04-27", entrada: "09:05", salida: "18:00", horas: 7.92 },
    { fecha: "2025-04-26", entrada: "08:58", salida: "18:10", horas: 8.20 },
  ];

   const recibosSueldo = [
     // Datos de ejemplo
     { id: 101, periodo: "Abril 2025", fechaPago: "2025-05-05", archivo: "recibo_abril_2025.pdf" },
     { id: 100, periodo: "Marzo 2025", fechaPago: "2025-04-05", archivo: "recibo_marzo_2025.pdf" },
   ];

  // --- Estado para controlar la pestaña visible ---
  const [seccionVisible, setSeccionVisible] = useState('perfil'); // Inicia en Mi Perfil

  // --- Lógica de Handlers (Ejemplos) ---
  const handleSolicitarLicencia = () => {
    console.log("Iniciar flujo de solicitud de licencia...");
    // Aquí iría la lógica para mostrar un modal o navegar a un formulario
  };

  const handleVerRecibo = (archivo) => {
    console.log(`Descargando/Viendo recibo: ${archivo}`);
    // Lógica para abrir el PDF
  };

  const handleSubirDocumento = (licenciaId) => {
     console.log(`Subir documento para licencia ID: ${licenciaId}`);
     // Lógica para abrir selector de archivos
  };

   const handleGuardarPerfil = (e) => {
       e.preventDefault();
       console.log("Guardando datos del perfil...");
       // Lógica para enviar datos actualizados (si permites edición)
   };

  // Función para cambiar la sección visible
  const mostrarSeccion = (nombreSeccion) => {
    setSeccionVisible(nombreSeccion);
  }
  
  //no me funciona el useNavigate
  const handleLogout = () => {
    // Eliminar el rol del almacenamiento (localStorage o sessionStorage)
  
    localStorage.removeItem('rol'); // O sessionStorage.removeItem('rol') si lo usas

    // Redirigir al usuario al inicio ("/")
    navigate('/');
  }
  ;


  return (
    // Contenedor principal de la página del empleado
    
    <div className={styles.pageContainer}>
      <LogoutButton />
      <h1 className={styles.mainTitle}>Portal del Empleado</h1>
      <p className={styles.welcomeMessage}>Hola, {empleadoInfo.nombre}. Aquí puedes gestionar tu información.</p>

      {/* --- Menú de Navegación tipo Tabs --- */}
      <nav className={styles.sectionNav}>
        <button
          className={`${styles.navButton} ${seccionVisible === 'perfil' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('perfil')}
        >
          Mi Perfil
        </button>
        <button
          className={`${styles.navButton} ${seccionVisible === 'licencias' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('licencias')}
        >
         Mis Licencias
        </button>
        <button
          className={`${styles.navButton} ${seccionVisible === 'desempeno' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('desempeno')}
        >
         Mi Desempeño
        </button>
         <button
          className={`${styles.navButton} ${seccionVisible === 'asistencia' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('asistencia')}
        >
         Mi Asistencia
        </button>
         <button
          className={`${styles.navButton} ${seccionVisible === 'recibos' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('recibos')}
        >
         Mis Recibos
        </button>
        <button
          className={`${styles.navButton} ${seccionVisible === 'satisfaccion' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('satisfaccion')}
        >
          Encuesta de Satisfacción
        </button>
      </nav>

      {/* --- Contenedor del Contenido de la Sección Activa --- */}
      <div className={styles.sectionsContainer}>

        {/* Sección: Mi Perfil */}
        {seccionVisible === 'perfil' && (
          <div className={styles.sectionContent}>
            <h2 className={styles.cardTitle}>Mi Información</h2>
           
              <form onSubmit={handleGuardarPerfil}> 
                
                 <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>Nombre Completo</label>
                        <input type="text" readOnly value={`${empleadoInfo.nombre} ${empleadoInfo.apellido}`} className={styles.inputFieldReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Puesto</label>
                        <input type="text" readOnly value={empleadoInfo.puesto} className={styles.inputFieldReadOnly} />
                    </div>
                     <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" readOnly value={empleadoInfo.email} className={styles.inputFieldReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Teléfono</label>
                        <input type="tel" readOnly value={empleadoInfo.telefono} className={styles.inputFieldReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>DNI</label>
                        <input type="text" readOnly value={empleadoInfo.dni} className={styles.inputFieldReadOnly} />
                    </div>
                 </div>
                  <div className={styles.cardActions}>
                    <button type="submit" className={styles.buttonPrimary}>Guardar Cambios</button>
                 </div> 
             </form> 
          </div>
        )}

        {/* Sección: Mis Licencias */}
        {seccionVisible === 'licencias' && (
          <div className={styles.sectionContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className={styles.cardTitle} style={{ marginBottom: 0, borderBottom: 'none' }}>Historial de Licencias</h2>
                <button className={styles.buttonPrimary} onClick={handleSolicitarLicencia}>
                    + Nueva Solicitud
                </button>
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Fecha Solicitud</th>
                    <th>Motivo</th>
                    <th>Fechas</th>
                    <th>Estado</th>
                    <th>Documento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {licencias.length > 0 ? licencias.map((lic) => (
                    <tr key={lic.id}>
                      <td>{lic.fechaSolicitud}</td>
                      <td>{lic.motivo}</td>
                      <td>{lic.fechaInicio} al {lic.fechaFin}</td>
                      <td>{lic.estado}</td>
                      <td>{lic.documento ? lic.documento : 'No adjunto'}</td>
                      <td>
                        {/* Mostrar botón de subir si falta documento y está pendiente/aprobada */}
                        {lic.estado === 'Falta documento' || (lic.estado === 'Aprobada' && !lic.documento) ? (
                             <button
                                className={styles.buttonSecondarySmall} // Crear esta clase para botones pequeños
                                onClick={() => handleSubirDocumento(lic.id)}
                             >
                                Subir Doc.
                             </button>
                        ) : null}
                       </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className={styles.noItemsTextTable}>No tienes licencias registradas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sección: Mi Desempeño */}
        {seccionVisible === 'desempeno' && (
          <div className={styles.sectionContent}>
            <h2 className={styles.cardTitle}>Mi Historial de Desempeño</h2>
             {/* Mostrar datos si existen y RRHH los comparte */}
             {historialDesempeno.length > 0 ? (
                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr><th>Período</th><th>Evaluación</th><th>Predicción Rendimiento</th></tr>
                        </thead>
                        <tbody>
                            {historialDesempeno.map(item => (
                                <tr key={item.periodo}>
                                    <td>{item.periodo}</td>
                                    <td>{item.evaluacion}</td>
                                    {/* Mostrar predicción si existe */}
                                    <td>{item.prediccionRendimiento ? `${item.prediccionRendimiento}%` : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             ) : (
                <p className={styles.infoText}>No hay información de desempeño disponible por el momento.</p>
             )}
          </div>
        )}

        {/* Sección: Mi Asistencia */}
        {seccionVisible === 'asistencia' && (
          <div className={styles.sectionContent}>
            <h2 className={styles.cardTitle}>Mis Registros de Asistencia</h2>
             {/* Mostrar últimos registros */}
             {registrosAsistencia.length > 0 ? (
                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr><th>Fecha</th><th>Entrada</th><th>Salida</th><th>Horas Trabajadas</th></tr>
                        </thead>
                        <tbody>
                            {registrosAsistencia.map(reg => (
                                <tr key={reg.fecha}>
                                    <td>{reg.fecha}</td>
                                    <td>{reg.entrada}</td>
                                    <td>{reg.salida}</td>
                                    <td>{reg.horas.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             ) : (
                 <p className={styles.infoText}>No se encontraron registros de asistencia recientes.</p>
             )}
          </div>
        )}

        {/* Sección: Mis Recibos */}
        {seccionVisible === 'recibos' && (
          <div className={styles.sectionContent}>
            <h2 className={styles.cardTitle}>Mis Recibos de Sueldo</h2>
            {recibosSueldo.length > 0 ? (
                 <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr><th>Período</th><th>Fecha de Pago</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            {recibosSueldo.map(recibo => (
                                <tr key={recibo.id}>
                                    <td>{recibo.periodo}</td>
                                    <td>{recibo.fechaPago}</td>
                                    <td>
                                        <button
                                            className={styles.buttonSecondarySmall} 
                                            onClick={() => handleVerRecibo(recibo.archivo)}
                                        >
                                            Ver/Descargar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             ) : (
                <p className={styles.infoText}>Aún no hay recibos de sueldo disponibles.</p>
             )}
          </div>
        )}
        {/* Sección: Encuesta de Satisfacción */}
        {seccionVisible === 'satisfaccion' && (
            <div className={styles.sectionContent}>
              <EncuestaSatisfaccionEmpleado />
            </div>
          )}
      </div> 
    </div> 
  );
};

export default DashboardEmpleado;