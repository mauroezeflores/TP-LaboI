import React, { useState } from 'react';
import styles from './DashboardCandidato.module.css';
import { Link, NavLink } from 'react-router-dom';

const convocatoriasDisponibles = [
  { id: 1, tags: ['⚡ Postulación rápida', 'Nuevo'], title: 'Programador Frontend Jr.', company: 'Tech Solutions S.A.', desc: 'Nuestra Organización se encuentra en la búsqueda de un Programador...', location: 'Capital Federal, Buenos Aires', modality: 'Remoto', time: 'Publicado hace 1 hora' },
  { id: 2, tags: [ '⚡ Postulación rápida'], title: 'Soporte Técnico Sistemas IT', company: 'Confidencial', desc: 'Atender las necesidades de la empresa en cuanto a hardware...', location: 'Capital Federal, Buenos Aires', modality: 'Híbrido', time: 'Actualizado hace 2h' },
  { id: 3, tags: ['Urgente'], title: 'Analista Contable Jr.', company: 'Finanzas Corp', desc: 'Buscamos estudiantes o jóvenes Profesionales de Contador Público...', location: 'Capital Federal, Buenos Aires', modality: 'Presencial', time: 'Publicado ayer' },
  { id: 4, tags: [], title: 'Asistente de Marketing Digital', company: 'Confidencial', desc: 'Importante empresa de tecnología audiovisual busca sumar talento...', location: 'Vicente López, Buenos Aires', modality: 'Presencial', time: 'Publicado hace 2 días' },
];

const filtros = {
  area: [ { name: 'Programacion', count: 1 }, { name: 'Soporte tecnico', count: 1 }, { name: 'Analista Contable', count: 1 }, { name: 'Asistente de Marketing', count: 1 }, ],
  modalidad: [ { name: 'Presencial', count: 2 }, { name: 'Híbrido', count: 1 }, { name: 'Remoto', count: 1 }, ],
  fecha: [ { name: 'Hoy', count: 2 }, { name: 'Menor a 2 días', count: 2 }, { name: 'Menor a 4 días', count: 0 }, ],
  lugardetrabajo: [ { name: 'Buenos Aires', count: 4 }, { name: 'CABA', count: 3 }, { name: 'Vicente López', count: 1 }, ]
};

const misPostulaciones = [
  { id: 101, puesto: 'Desarrollador Backend', empresa: 'Innovatech', estado: 'En Revisión' },
  { id: 102, puesto: 'Project Manager', empresa: 'Global Solutions', estado: 'Entrevista Programada' },
  { id: 103, puesto: 'Tester QA', empresa: 'QualityFirst', estado: 'Rechazado' },
];

const getStatusClass = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'en revisión': return styles.statusRevision;
    case 'entrevista programada': return styles.statusEntrevista;
    case 'rechazado': return styles.statusRechazado;
    case 'recibido': return styles.statusRecibido;
    case 'contratado': return styles.statusContratado;
    default: return styles.statusDefault;
  }
};

const DashboardCandidato = () => {
  const candidato = { nombre: "Lara", apellido: "Selser", email: "lara.selser@mail.com", ubicacion: "Buenos Aires", telefono: "1123456789", cvNombre: "CV_JuanPerez_2025.pdf" };
  const notificaciones = [ { id: 1, texto: "✔️ Su CV fue aprobado.", leida: false }, { id: 2, texto: "❗️ Nueva oferta de trabajo disponible.", leida: false }, { id: 3, texto: "✔️ Su entrevista está programada para el 15/10.", leida: true }, ];

  const [seccionVisible, setSeccionVisible] = useState('buscarConvocatorias');

  const handleFileUploadClick = () => { console.log("Abrir selector de CV..."); };
  const handleSaveChanges = (e) => { e.preventDefault(); console.log("Guardando datos personales..."); };
  const mostrarSeccion = (nombreSeccion) => { setSeccionVisible(nombreSeccion); };

  const handleApply = (jobId, jobTitle) => {
    console.log(`Aplicando a la convocatoria ID: ${jobId}, Título: ${jobTitle}`);
    // TODO: Implementar lógica real de postulación (API call, etc.)
    alert(`Simulación: Aplicando a "${jobTitle}" (ID: ${jobId}).`);
  }
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    // lógica de logout si querés agregar algo
  }

  ;


  return (
    <div className={styles.pageContainer}>
      <NavLink to="/dashboard/empleado" className={styles.navLink}>
      <div className={styles.logoutButtonContainer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      </NavLink>
      <h1 className={styles.mainTitle}>Bienvenida, {candidato.nombre} {candidato.apellido}</h1>

      <nav className={styles.sectionNav}>
      <button className={`${styles.navButton} ${seccionVisible === 'datosPersonales' ? styles.active : ''}`} onClick={() => mostrarSeccion('datosPersonales')}>
          Datos Personales
        </button>
        <button className={`${styles.navButton} ${seccionVisible === 'perfilProfesional' ? styles.active : ''}`} onClick={() => mostrarSeccion('perfilProfesional')}>
          Perfil Profesional / CV
        </button>
        <button className={`${styles.navButton} ${seccionVisible === 'buscarConvocatorias' ? styles.active : ''}`} onClick={() => mostrarSeccion('buscarConvocatorias')}>
            Buscar Convocatorias
        </button>
        <button className={`${styles.navButton} ${seccionVisible === 'estadoConvocatoria' ? styles.active : ''}`} onClick={() => mostrarSeccion('estadoConvocatoria')}>
            Mis Postulaciones
        </button>
        <button className={`${styles.navButton} ${seccionVisible === 'notificaciones' ? styles.active : ''}`} onClick={() => mostrarSeccion('notificaciones')}>
            Notificaciones
        </button>
      </nav>
      <div className={styles.sectionsContainer}>

        {seccionVisible === 'buscarConvocatorias' && (
          <div className={styles.jobBoardSection}>
             <h2 className={styles.cardTitle}>Convocatorias Disponibles</h2>
             <div className={styles.jobBoardContainer}>
               <aside className={styles.sidebar}>
                 <h3 className={styles.filterTitle}>Filtrar Búsqueda</h3>
                 <div className={styles.filterGroup}>
                   <h4 className={styles.filterCategory}>Área</h4>
                   <ul className={styles.filterList}>
                     {filtros.area.slice(0, 6).map((item, index) => ( <li key={index} className={styles.filterItem}><a href="#" className={styles.filterLink}>{item.name}</a><span className={styles.filterCount}>({item.count})</span></li> ))}
                   </ul>
                 </div>
                 <div className={styles.filterGroup}>
                   <h4 className={styles.filterCategory}>Modalidad</h4>
                   <ul className={styles.filterList}>
                     {filtros.modalidad.map((item, index) => ( <li key={index} className={styles.filterItem}><a href="#" className={styles.filterLink}>{item.name}</a><span className={styles.filterCount}>({item.count})</span></li> ))}
                   </ul>
                 </div>
                  <div className={styles.filterGroup}>
                   <h4 className={styles.filterCategory}>Fecha</h4>
                   <ul className={styles.filterList}>
                     {filtros.fecha.slice(0, 4).map((item, index) => ( <li key={index} className={styles.filterItem}><a href="#" className={styles.filterLink}>{item.name}</a><span className={styles.filterCount}>({item.count})</span></li> ))}
                   </ul>
                 </div>
                  <div className={styles.filterGroup}>
                    <h4 className={styles.filterCategory}>Lugar de Trabajo</h4>
                    <ul className={styles.filterList}>
                      {filtros.lugardetrabajo.map((item, index) => ( <li key={index} className={styles.filterItem}><a href="#" className={styles.filterLink}>{item.name}</a><span className={styles.filterCount}>({item.count})</span></li> ))}
                    </ul>
                  </div>
               </aside>

               <section className={styles.jobListings}>
                 {convocatoriasDisponibles.map(job => (
                   <article key={job.id} className={styles.jobCard}>
                     <div className={styles.jobCardHeader}>
                       <div className={styles.tagsRow}>
                         {job.tags.map((tag, i) => (<span key={i} className={`${styles.tag} ${tag === 'Nuevo' ? styles.tagNuevo : ''}`}>{tag}</span>))}
                       </div>
                       <span className={styles.tagTime}>{job.time}</span>
                     </div>
                     <h3 className={styles.cardTitleJob}><Link to={`/convocatoria/${job.id}`}>{job.title}</Link></h3>
                     <div className={styles.cardCompany}>{job.company}</div>
                     <p className={styles.cardDesc}>{job.desc}</p>
                     <div className={styles.meta}>
                       <span>📍 {job.location}</span>
                       <span>🏢 {job.modality}</span>
                     </div>
                     <div className={styles.applyButtonContainer}>
                       <button onClick={() => handleApply(job.id, job.title)} className={styles.applyButton}>
                         Aplicar Ahora
                       </button>
                     </div>
                   </article>
                 ))}
               </section>
             </div>
          </div>
        )}

        {seccionVisible === 'estadoConvocatoria' && (
          <div className={`${styles.card} ${styles.sectionCard}`}>
            <h2 className={styles.cardTitle}>Mis Postulaciones</h2>
            {misPostulaciones.length > 0 ? (
              <ul className={styles.applicationList}>
                {misPostulaciones.map(postulacion => (
                  <li key={postulacion.id} className={styles.applicationItem}>
                    <div className={styles.applicationInfo}>
                      <span className={styles.applicationJobTitle}>{postulacion.puesto}</span>
                      <span className={styles.applicationCompany}>{postulacion.empresa}</span>
                    </div>
                    <div className={styles.applicationStatus}>
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

         {seccionVisible === 'notificaciones' && (
              <div className={`${styles.card} ${styles.sectionCard}`}>
                 <h2 className={styles.cardTitle}> Notificaciones</h2>
                 {notificaciones.length > 0 ? (
                     <ul className={styles.notificationList}>
                         {notificaciones.map(notif => ( <li key={notif.id}>{notif.texto}</li> ))}
                     </ul>
                 ) : ( <p className={styles.noItemsText}>No tienes notificaciones nuevas.</p> )}
             </div>
         )}

      </div>
    </div>
  );
};

export default DashboardCandidato;