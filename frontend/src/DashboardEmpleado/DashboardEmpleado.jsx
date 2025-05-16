import React, { useState } from 'react';
import styles from './DashboardEmpleado.module.css';
import { useNavigate, NavLink } from 'react-router-dom';

const DashboardEmpleado = () => {
  // --- Datos de Ejemplo (Reemplazar con datos reales del empleado logueado) ---
  const empleado = {
    nombre: "Juan",
    apellido: "Perez",
    puesto: "Analista de Marketing",
    email: "juan.m@example.com",
    telefono: "1122334455",
    fechaIngreso: "2023-01-15",
    dni: "12345678",
  };

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

   const [lastSurveySubmissionDate, setLastSurveySubmissionDate] = useState(null);
  const [canSubmitSurvey, setCanSubmitSurvey] = useState(true);
  const navigate = useNavigate();

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
  };
  
  //no me funciona el useNavigate
  const handleLogout = () => {
    // Eliminar el rol del almacenamiento (localStorage o sessionStorage)
  
    localStorage.removeItem('rol'); // O sessionStorage.removeItem('rol') si lo usas

    // Redirigir al usuario al inicio ("/")
    navigate('/');
  }
  // Estado y lógica para la encuesta de clima laboral
  const [surveyData, setSurveyData] = useState({
    satisfaccionGeneral: '',
    ambienteTrabajo: '',
    comunicacionInterna: '',
    desarrolloProfesional: '',
    reconocimiento: '',
    comentariosAdicionales: '',
  });

  const surveyQuestions = [
    {
      name: 'satisfaccionGeneral',
      label: '¿Qué tan satisfecho/a estás con tu trabajo en general? (1 = Nada satisfecho, 5 = Muy satisfecho)',
      type: 'number',
      min: 1,
      max: 5,
    },
    {
      name: 'ambienteTrabajo',
      label: '¿Cómo calificarías el ambiente laboral? (1 = Muy malo, 5 = Excelente)',
      type: 'number',
      min: 1,
      max: 5,
    },
    {
      name: 'comunicacionInterna',
      label: '¿Consideras que la comunicación interna es efectiva? (1 = Nada efectiva, 5 = Muy efectiva)',
      type: 'number',
      min: 1,
      max: 5,
    },
    {
      name: 'desarrolloProfesional',
      label: '¿Sientes que tienes oportunidades de desarrollo profesional? (1 = Ninguna, 5 = Muchas)',
      type: 'number',
      min: 1,
      max: 5,
    },
    {
      name: 'reconocimiento',
      label: '¿Te sientes reconocido/a por tu trabajo? (1 = Nada, 5 = Mucho)',
      type: 'number',
      min: 1,
      max: 5,
    },
    {
      name: 'comentariosAdicionales',
      label: 'Comentarios adicionales (opcional):',
      type: 'textarea',
    },
  ];

  const handleSurveyChange = (e) => {
    const { name, value } = e.target;
    setSurveyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitSurvey = (e) => {
    e.preventDefault();
    const today = new Date();
    setLastSurveySubmissionDate(today);
    localStorage.setItem(`lastSurveySubmission_${empleado.email}`, today.toISOString());
    setCanSubmitSurvey(false);
    alert("Encuesta enviada con éxito. Podrás volver a enviarla en 30 días.");
    // Resetear formulario (opcional)
    setSurveyData({
      satisfaccionGeneral: '',
      ambienteTrabajo: '',
      comunicacionInterna: '',
      desarrolloProfesional: '',
      reconocimiento: '',
      comentariosAdicionales: '',
    });
  };

  const getNextSurveyDate = () => {
    if (lastSurveySubmissionDate) {
      const nextDate = new Date(lastSurveySubmissionDate);
      nextDate.setDate(lastSurveySubmissionDate.getDate() + 30);
      return nextDate.toLocaleDateString();
    }
    return null;
  };
  ;



  return (
    // Contenedor principal de la página del empleado
    <div className={styles.pageContainer}>
      <h1 className={styles.mainTitle}>Portal del Empleado</h1>
      <p className={styles.welcomeMessage}>Hola, {empleado.nombre}. Aquí puedes gestionar tu información.</p>

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
          className={`${styles.navButton} ${seccionVisible === 'encuestaClima' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('encuestaClima')}
        >
         Encuesta Satisfaccion
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
                        <input type="text" readOnly value={`${empleado.nombre} ${empleado.apellido}`} className={styles.inputFieldReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Puesto</label>
                        <input type="text" readOnly value={empleado.puesto} className={styles.inputFieldReadOnly} />
                    </div>
                     <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" readOnly value={empleado.email} className={styles.inputFieldReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Teléfono</label>
                        <input type="tel" readOnly value={empleado.telefono} className={styles.inputFieldReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fecha de Ingreso</label>
                        <input type="date" readOnly value={empleado.fechaIngreso} className={styles.inputFieldReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>DNI</label>
                        <input type="text" readOnly value={empleado.dni} className={styles.inputFieldReadOnly} />
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
        {/* Sección: Encuesta de Clima Laboral */}
        {seccionVisible === 'encuestaClima' && (
          <div className={styles.sectionContent}>
            <h2 className={styles.cardTitle}>Encuesta de Clima Laboral</h2>
            {!canSubmitSurvey ? (
              <div className={styles.surveyCooldownMessage}>
                <p>Ya has completado la encuesta recientemente.</p>
                <p>Podrás volver a realizarla a partir del: <strong>{getNextSurveyDate()}</strong>.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSurvey} className={styles.surveyForm}>
                <p className={styles.infoText}>
                  Tu opinión es importante para nosotros. Por favor, completa la siguiente encuesta de clima laboral. 
                  Tus respuestas son confidenciales.
                </p>
                {surveyQuestions.map(q => (
                  <div className={styles.formGroup} key={q.name}>
                    <label htmlFor={q.name}>{q.label}</label>
                    {q.type === 'textarea' ? (
                      <textarea
                        id={q.name}
                        name={q.name}
                        value={surveyData[q.name]}
                        onChange={handleSurveyChange}
                        rows="4"
                        className={styles.inputField}
                      />
                    ) : q.type === 'number' ? (
                       <input
                        type="number"
                        id={q.name}
                        name={q.name}
                        value={surveyData[q.name]}
                        onChange={handleSurveyChange}
                        min={q.min}
                        max={q.max}
                        required
                        className={styles.inputField}
                      />
                    ) : (
                      <input
                        type={q.type}
                        id={q.name}
                        name={q.name}
                        value={surveyData[q.name]}
                        onChange={handleSurveyChange}
                        required
                        className={styles.inputField}
                      />
                    )}
                  </div>
                ))}
                <div className={styles.cardActions}>
                  <button type="submit" className={styles.buttonPrimary} disabled={!canSubmitSurvey}>
                    Enviar Encuesta
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div> 
      <NavLink to="/" className={styles.navLink}>
            <div className={styles.logoutButtonContainer}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
            </NavLink>
    </div> 

  );

};


export default DashboardEmpleado;