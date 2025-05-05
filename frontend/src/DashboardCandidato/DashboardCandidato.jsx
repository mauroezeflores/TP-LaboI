import React, { useState } from 'react';
import styles from './DashboardCandidato.module.css';

const DashboardCandidato = () => {
  // Datos de ejemplo (reemplazar con datos reales del candidato)
  const candidato = {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@mail.com",
    ubicacion: "Buenos Aires",
    telefono: "1123456789",
  };

  const misPostulaciones = [
    {
      id: 1,
      puesto: 'Programador Frontend Jr.',
      empresa: 'Tech Solutions S.A.',
      fecha: '2025-04-15',
      estado: 'En Revisión', // Estado 1
    },
    {
      id: 2,
      puesto: 'Analista de Datos',
      empresa: 'Data Insights Co.',
      fecha: '2025-04-10',
      estado: 'Entrevista Programada', // Estado 2
    },
    {
      id: 3,
      puesto: 'Diseñador UX/UI',
      empresa: 'Creative Minds Agency',
      fecha: '2025-03-28',
      estado: 'Rechazado', // Estado 3
    },
     {
      id: 4, 
      puesto: 'Soporte Técnico Nivel 1',
      empresa: 'InfraServicios',
      fecha: '2025-04-20',
      estado: 'Recibido', // Estado 4
    },
  ];
  
  // --- Función auxiliar para obtener la clase CSS según el estado ---
  const getStatusClass = (estado) => {
    switch (estado?.toLowerCase()) { // Añadido optional chaining por si estado es null/undefined
      case 'en revisión':
        return styles.statusRevision;
      case 'entrevista programada':
        return styles.statusEntrevista;
      case 'rechazado':
        return styles.statusRechazado;
      case 'recibido':
        return styles.statusRecibido;
      case 'contratado': 
        return styles.statusContratado;
      default:
        return styles.statusDefault; // Clase por defecto
    }
  };

  
  const notificaciones = [
    { id: 1, texto: "✔️ Su CV fue aprobado.", leida: false },
    { id: 2, texto: "❗️ Nueva oferta de trabajo disponible.", leida: false },
    { id: 3, texto: "✔️ Su entrevista está programada para el 15/10.", leida: true },
    { id: 4, texto: "❗️ Recuerde actualizar su perfil.", leida: false },
    { id: 5, texto: "✔️ Su perfil fue visto por un reclutador.", leida: true },
  ];

  // Estados para controlar la visibilidad de las secciones (opcional)
  const [seccionVisible, setSeccionVisible] = useState('datosPersonales'); // Inicia mostrando datos personales

  // --- Lógica para manejar formularios (existente) ---
  const handleFileUploadClick = () => {
      console.log("Abrir selector de CV...");
  };
    
   const handleSaveChanges = (e) => {
       e.preventDefault();
       console.log("Guardando datos personales...");
   };
    

  // Función para cambiar la sección visible
  const mostrarSeccion = (nombreSeccion) => {
    setSeccionVisible(nombreSeccion);
  };

  return (
    // Contenedor principal de la página
    <div className={styles.pageContainer}>
      <h1 className={styles.mainTitle}>Bienvenido, {candidato.nombre} {candidato.apellido}</h1>

      {/* --- Menú de Navegación de Secciones (Opcional) --- */}
      <nav className={styles.sectionNav}>
        <button
          className={`${styles.navButton} ${seccionVisible === 'datosPersonales' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('datosPersonales')}
        >
          Datos Personales
        </button>
        <button
          className={`${styles.navButton} ${seccionVisible === 'perfilProfesional' ? styles.active : ''}`}
          onClick={() => mostrarSeccion('perfilProfesional')}
        >
          Perfil Profesional / CV
        </button>
       
        <button
            className={`${styles.navButton} ${seccionVisible === 'notificaciones' ? styles.active : ''}`}
            onClick={() => mostrarSeccion('notificaciones')}
        >
            Notificaciones
        </button>
        <button
            className={`${styles.navButton} ${seccionVisible === 'estadoConvocatoria' ? styles.active : ''}`}
            onClick={() => mostrarSeccion('estadoConvocatoria')}
        >
            Estado Convocatoria
        </button>
      </nav>

      {/* --- Contenedor de Secciones --- */}
      <div className={styles.sectionsContainer}>

        {/* Sección: Datos Personales */}
        {seccionVisible === 'datosPersonales' && (
          <div className={`${styles.card} ${styles.sectionCard}`}>
            <h2 className={styles.cardTitle}>Datos personales</h2>
            <form className={styles.formPersonalData} onSubmit={handleSaveChanges}>
              <div className={styles.formGrid}>
                 <div className={styles.formGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" id="nombre" defaultValue={candidato.nombre} className={styles.inputField} />
                 </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="apellido">Apellido</label>
                    <input type="text" id="apellido" defaultValue={candidato.apellido} className={styles.inputField} />
                 </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" defaultValue={candidato.email} className={styles.inputField} />
                 </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="ubicacion">Ubicación</label>
                    <input type="text" id="ubicacion" defaultValue={candidato.ubicacion} className={styles.inputField} />
                 </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="telefono">Teléfono</label>
                    <input type="tel" id="telefono" defaultValue={candidato.telefono} className={styles.inputField} />
                 </div>
              </div>
              <div className={styles.cardActions}>
                 <button type="submit" className={styles.buttonPrimary}>
                     Guardar cambios
                 </button>
              </div>
            </form>
          </div>
        )}

        {/* Sección: Perfil Profesional / CV */}
        {seccionVisible === 'perfilProfesional' && (
          <div className={`${styles.card} ${styles.sectionCard}`}>
            <h2 className={styles.cardTitle}>Tu Perfil Profesional</h2>
            <div className={styles.buttonGroup}>
               <button className={styles.buttonPrimary} onClick={handleFileUploadClick}>
                  Subir o actualizar CV
               </button>
            </div>
            <p className={styles.infoText}>Tu CV actual es: {candidato.cvNombre || "No tienes un CV subido."}</p>
            
          </div>
        )}

        
         {/* Sección: Notificaciones */}
         {seccionVisible === 'notificaciones' && (
             <div className={`${styles.card} ${styles.sectionCard}`}>
                <h2 className={styles.cardTitle}> Notificaciones</h2>
                {notificaciones.length > 0 ? (
                    <ul className={styles.notificationList}>
                        {notificaciones.map(notif => (
                            <li key={notif.id}>{notif.texto}</li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noItemsText}>No tienes notificaciones nuevas.</p>
                )}
            </div>
         )}

            {seccionVisible === 'estadoConvocatoria' && (
            <div className={`${styles.card} ${styles.sectionCard}`}>
                <h2 className={styles.cardTitle}>Estado de Convocatoria</h2>

                {/* Verificamos si hay postulaciones */}
                {misPostulaciones.length > 0 ? (
                  <ul className={styles.applicationList}> {/* Nueva lista para postulaciones */}
                    {misPostulaciones.map(postulacion => (
                      <li key={postulacion.id} className={styles.applicationItem}>
                        <div className={styles.applicationInfo}>
                          <span className={styles.applicationJobTitle}>{postulacion.puesto}</span>
                          <span className={styles.applicationCompany}>{postulacion.empresa}</span>
                        </div>
                        <div className={styles.applicationStatus}>
                          {/* Usamos la función auxiliar para la clase y mostramos el estado */}
                          <span className={`${styles.statusBadge} ${getStatusClass(postulacion.estado)}`}>
                            {postulacion.estado}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noItemsText}>Aún no te has postulado a ninguna convocatoria.</p>
                )}
            </div>
         )} 

      </div> {/* Cierre de .sectionsContainer */}
    </div> // Cierre de .pageContainer
  );
};

export default DashboardCandidato;