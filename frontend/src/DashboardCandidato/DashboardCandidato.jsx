import React, { useState, useEffect, useCallback } from 'react';
import styles from './DashboardCandidato.module.css';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import { getUsuarioActual } from '../services/authService';

const API_BASE_URL = 'http://localhost:8000';

const formatTimeAgo = (isoDateString) => {
  if (!isoDateString) return 'Fecha no disponible';
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (days > 1) return `Finaliza en ${days} días`;
  if (days === 1) return `Finaliza en 1 día`;
  if (hours > 1) return `Finaliza en ${hours} horas`;
  if (hours === 1) return `Finaliza en 1 hora`;
  if (minutes > 1) return `Finaliza en ${minutes} minutos`;
  if (minutes === 1) return `Finaliza en 1 minuto`;
  return 'Finaliza pronto';
};

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
  const navigate = useNavigate();
  const usuario = getUsuarioActual();

  // Redirige si no está logueado o no es candidato
  useEffect(() => {
    if (!usuario || usuario.rol?.toLowerCase() !== 'candidato') {
      navigate('/login/candidato');
    }
  }, [usuario, navigate]);

  // Extrae datos del candidato si existen
  const candidato = usuario?.candidato || {};
  const [candidatoInfo, setCandidatoInfo] = useState({
    id_usuario: usuario?.id_usuario || candidato.id_usuario || '',
    nombre: candidato.nombre || '',
    apellido: candidato.apellido || '',
    email: candidato.email || usuario?.email || '',
    ubicacion: candidato.ciudad || '',
    telefono: candidato.tel_num_telefono || '',
    cvNombre: null
  });

  const [seccionVisible, setSeccionVisible] = useState('buscarConvocatorias');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyingJobDetails, setApplyingJobDetails] = useState(null);
  const [yearsExperience, setYearsExperience] = useState('');
  const [candidateSkillSelections, setCandidateSkillSelections] = useState({});
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [applicationSuccessMessage, setApplicationSuccessMessage] = useState('');
  const [convocatoriasDisponibles, setConvocatoriasDisponibles] = useState([]);
  const [isLoadingConvocatorias, setIsLoadingConvocatorias] = useState(false);
  const [convocatoriasError, setConvocatoriasError] = useState('');

  // certificaciones
  const [certificaciones, setCertificaciones] = useState([]);
  const [certificacionesSeleccionadas, setCertificacionesSeleccionadas] = useState([]);
  const [isLoadingCertificaciones, setIsLoadingCertificaciones] = useState(false);
  const [certificacionesError, setCertificacionesError] = useState('');
  const [mensajeCertificaciones, setMensajeCertificaciones] = useState('');

  // Traer certificaciones y las que ya tiene el candidato
const fetchCertificaciones = useCallback(async () => {
  setIsLoadingCertificaciones(true);
  setCertificacionesError('');
  try {
    // Trae todas las certificaciones de interés
    const res = await fetch(`${API_BASE_URL}/certificaciones`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al obtener certificaciones");
    setCertificaciones(data);

    // Trae las certificaciones que ya tiene el candidato
    const res2 = await fetch(`${API_BASE_URL}/candidato/${candidatoInfo.id_usuario}/certificaciones`);
    const data2 = await res2.json();
    if (res2.ok && Array.isArray(data2)) {
      setCertificacionesSeleccionadas(data2.map(c => c.id_certificacion));
    }
  } catch (err) {
    setCertificacionesError(err.message);
  } finally {
    setIsLoadingCertificaciones(false);
  }
}, [candidatoInfo.id_usuario]);

// Cargar certificaciones al entrar a la pestaña
useEffect(() => {
  if (seccionVisible === 'misCertificaciones') {
    fetchCertificaciones();
  }
}, [seccionVisible, fetchCertificaciones]);

const handleCertificacionChange = (id_certificacion) => {
  setCertificacionesSeleccionadas(prev =>
    prev.includes(id_certificacion)
      ? prev.filter(id => id !== id_certificacion)
      : [...prev, id_certificacion]
  );
};

const handleGuardarCertificaciones = async () => {
  setMensajeCertificaciones('');
  try {
    const res = await fetch(`${API_BASE_URL}/candidato/${candidatoInfo.id_usuario}/certificaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificaciones: certificacionesSeleccionadas }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al guardar certificaciones");
    setMensajeCertificaciones("¡Certificaciones guardadas!");
  } catch (err) {
    setMensajeCertificaciones("Error: " + err.message);
  }
};

  // Filtros y postulaciones
 
  const [filtros] = useState({
    area: [ { name: 'Programacion', count: 0 }, { name: 'Soporte tecnico', count: 0 } ],
    modalidad: [ { name: 'Presencial', count: 0 }, { name: 'Híbrido', count: 0 }, { name: 'Remoto', count: 0 } ],
    fecha: [ { name: 'Hoy', count: 0 }, { name: 'Menor a 2 días', count: 0 } ],
    lugardetrabajo: [ { name: 'Buenos Aires', count: 0 }, { name: 'CABA', count: 0 } ]
  });
  const [misPostulaciones] = useState([
    { id: 101, puesto: 'Desarrollador Backend Ejemplo', empresa: 'Innovatech', estado: 'En Revisión' },
  ]);
  const [notificaciones] = useState([
    { id: 1, texto: "✔️ Ejemplo: Su CV fue aprobado.", leida: false },
  ]);

  // Fetch convocatorias disponibles
  const fetchConvocatoriasDisponibles = useCallback(async () => {
    setIsLoadingConvocatorias(true);
    setConvocatoriasError('');
    try {
      const response = await fetch(`${API_BASE_URL}/convocatorias/disponibles`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      const convocatoriasConTiempo = data.map(job => ({
        ...job,
        tags: [],
        time: formatTimeAgo(job.fecha_publicacion)
      }));
      setConvocatoriasDisponibles(convocatoriasConTiempo);
    } catch (error) {
      setConvocatoriasError(error.message || "No se pudieron cargar las convocatorias.");
    } finally {
      setIsLoadingConvocatorias(false);
    }
  }, []);

  useEffect(() => {
    if (seccionVisible === 'buscarConvocatorias') {
      fetchConvocatoriasDisponibles();
    }
  }, [seccionVisible, fetchConvocatoriasDisponibles]);

  const handleSaveChanges = (e) => { e.preventDefault(); /* lógica de guardado */ };
  const mostrarSeccion = (nombreSeccion) => {
    setApplicationError('');
    setApplicationSuccessMessage('');
    setSeccionVisible(nombreSeccion);
  };

  const handleOpenApplyModal = (job) => {
    setApplyingJobDetails(job);
    setYearsExperience('');
    setApplicationError('');
    setApplicationSuccessMessage('');
    const initialSkills = job.skillTags?.reduce((acc, tag) => {
      acc[tag] = false;
      return acc;
    }, {}) || {};
    setCandidateSkillSelections(initialSkills);
    setIsApplyModalOpen(true);
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
    setApplyingJobDetails(null);
    setYearsExperience('');
    setCandidateSkillSelections({});
  };

  const handleSkillSelectionChange = (skillTag) => {
    setCandidateSkillSelections(prev => ({
      ...prev,
      [skillTag]: !prev[skillTag]
    }));
  };

  const handleConfirmApplication = async () => {
    if (!applyingJobDetails || !candidatoInfo.id_usuario) {
      setApplicationError("Datos de postulación incompletos o falta ID de usuario.");
      return;
    }
    if (yearsExperience.trim() === '' || isNaN(parseInt(yearsExperience)) || parseInt(yearsExperience) < 0) {
      setApplicationError("Por favor, ingresa un número válido y positivo de años de experiencia.");
      return;
    }

    setIsSubmittingApplication(true);
    setApplicationError('');
    setApplicationSuccessMessage('');

    const formData = new FormData();
    formData.append('id_usuario', candidatoInfo.id_usuario);
    formData.append('experiencia', parseInt(yearsExperience, 10));

    try {
      const response = await fetch(`${API_BASE_URL}/convocatoria/${applyingJobDetails.id}/postularse`, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || responseData.error || `Error HTTP: ${response.status}`);
      }
      setApplicationSuccessMessage(responseData.mensaje || `Postulación enviada con éxito para "${applyingJobDetails.title}".`);
      setTimeout(() => {
        handleCloseApplyModal();
      }, 3000);
    } catch (error) {
      setApplicationError(error.message || "Ocurrió un error al enviar la postulación.");
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const [selectedCvFile, setSelectedCvFile] = useState(null);
  const [cvUploadMessage, setCvUploadMessage] = useState('');
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  const handleCvFileChange = (event) => {
    setSelectedCvFile(event.target.files[0]);
    setCvUploadMessage('');
  };

  const handleUploadCvSubmit = async () => {
    if (!selectedCvFile) {
      setCvUploadMessage('Por favor, selecciona un archivo CV.');
      return;
    }
    if (!candidatoInfo.id_usuario) {
      setCvUploadMessage('ID de usuario no encontrado. No se puede subir el CV.');
      return;
    }
    setIsUploadingCv(true);
    setCvUploadMessage('Subiendo CV...');
    const formData = new FormData();
    formData.append('file', selectedCvFile);
    formData.append('id_usuario', candidatoInfo.id_usuario);
    try {
      const response = await fetch(`${API_BASE_URL}/cv`, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || responseData.error || 'Error al subir CV');
      }
      setCvUploadMessage(responseData.mensaje || 'CV subido con éxito.');
      setCandidatoInfo(prev => ({ ...prev, cvNombre: selectedCvFile.name }));
    } catch (error) {
      setCvUploadMessage(`Error: ${error.message}`);
    } finally {
      setIsUploadingCv(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logoutButtonContainer}>
        <LogoutButton />
      </div>
      <h1 className={styles.mainTitle}>
        Bienvenida, {candidatoInfo.nombre || candidatoInfo.email}
        {candidatoInfo.apellido ? ` ${candidatoInfo.apellido}` : ''}
      </h1>

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
            {isLoadingConvocatorias && <p>Cargando convocatorias...</p>}
            {convocatoriasError && <p className={styles.errorMessage}>{convocatoriasError}</p>}
            {!isLoadingConvocatorias && !convocatoriasError && (
              <div className={styles.jobBoardContainer}>
                <aside className={styles.sidebar}>
                  <h3 className={styles.filterTitle}>Filtrar Búsqueda</h3>
                  <div className={styles.filterGroup}>
                    <h4 className={styles.filterCategory}>Área</h4>
                    <ul className={styles.filterList}>
                      {filtros.area.slice(0, 6).map((item, index) => (
                        <li key={index} className={styles.filterItem}>
                          <a href="#" className={styles.filterLink}>{item.name}</a>
                          <span className={styles.filterCount}>({item.count})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.filterGroup}>
                    <h4 className={styles.filterCategory}>Modalidad</h4>
                    <ul className={styles.filterList}>
                      {filtros.modalidad.map((item, index) => (
                        <li key={index} className={styles.filterItem}>
                          <a href="#" className={styles.filterLink}>{item.name}</a>
                          <span className={styles.filterCount}>({item.count})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.filterGroup}>
                    <h4 className={styles.filterCategory}>Fecha</h4>
                    <ul className={styles.filterList}>
                      {filtros.fecha.slice(0, 4).map((item, index) => (
                        <li key={index} className={styles.filterItem}>
                          <a href="#" className={styles.filterLink}>{item.name}</a>
                          <span className={styles.filterCount}>({item.count})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.filterGroup}>
                    <h4 className={styles.filterCategory}>Lugar de Trabajo</h4>
                    <ul className={styles.filterList}>
                      {filtros.lugardetrabajo.map((item, index) => (
                        <li key={index} className={styles.filterItem}>
                          <a href="#" className={styles.filterLink}>{item.name}</a>
                          <span className={styles.filterCount}>({item.count})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                <section className={styles.jobListings}>
                  {convocatoriasDisponibles.length > 0 ? convocatoriasDisponibles.map(job => (
                    <article key={job.id} className={styles.jobCard}>
                      <div className={styles.jobCardHeader}>
                        <div className={styles.tagsRow}>
                          {job.tags?.map((tag, i) => (
                            <span key={i} className={`${styles.tag} ${tag === 'Nuevo' ? styles.tagNuevo : ''}`}>{tag}</span>
                          ))}
                        </div>
                        <span className={styles.tagTime}>{job.time}</span>
                      </div>
                      <h3 className={styles.cardTitleJob}>
                        <Link to={`/dashboard/candidato/convocatoria/${job.id}`}>{job.title}</Link>
                      </h3>
                      <div className={styles.cardCompany}>{job.company}</div>
                      <p className={styles.cardDesc}>{job.desc?.substring(0, 150)}...</p>
                      <div className={styles.skillTagsCard}>
                        {job.skillTags?.slice(0, 4).map(skill => <span key={skill} className={styles.skillTagItem}>{skill}</span>)}
                        {job.skillTags?.length > 4 && <span className={styles.skillTagItem}>...</span>}
                      </div>
                      <div className={styles.meta}>
                        <span>📍 {job.location}</span>
                        <span><span role="img" aria-label="company-icon">🏢</span> {job.modality}</span>
                      </div>
                      <div className={styles.applyButtonContainer}>
                        <button onClick={() => handleOpenApplyModal(job)} className={styles.applyButton}>
                          Aplicar Ahora
                        </button>
                      </div>
                    </article>
                  )) : <p>No hay convocatorias disponibles en este momento.</p>}
                </section>
              </div>
            )}
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
                  <input type="text" id="nombre" defaultValue={candidatoInfo.nombre} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="apellido">Apellido</label>
                  <input type="text" id="apellido" defaultValue={candidatoInfo.apellido} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" defaultValue={candidatoInfo.email} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="ubicacion">Ubicación</label>
                  <input type="text" id="ubicacion" defaultValue={candidatoInfo.ubicacion} className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="telefono">Teléfono</label>
                  <input type="tel" id="telefono" defaultValue={candidatoInfo.telefono} className={styles.inputField} />
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
            <div className={styles.formGroup}>
              <label htmlFor="cvFile">Agregar/Actualizar CV (PDF o DOCX):</label>
              <input
                type="file"
                id="cvFile"
                accept=".pdf,.docx"
                className={styles.inputField}
                onChange={handleCvFileChange}
              />
              <button
                onClick={handleUploadCvSubmit}
                className={styles.buttonPrimary}
                style={{ marginTop: '10px' }}
                disabled={isUploadingCv}
              >
                {isUploadingCv ? 'Subiendo...' : 'Subir CV'}
              </button>
              {cvUploadMessage && <p className={styles.infoText} style={{ marginTop: '10px' }}>{cvUploadMessage}</p>}
            </div>
            <p className={styles.infoText}>Tu CV actual es: {candidatoInfo.cvNombre || "No tienes un CV subido."}</p>
          </div>
        )}

        {seccionVisible === 'notificaciones' && (
          <div className={`${styles.card} ${styles.sectionCard}`}>
            <h2 className={styles.cardTitle}> Notificaciones</h2>
            {notificaciones.length > 0 ? (
              <ul className={styles.notificationList}>
                {notificaciones.map(notif => (
                  <li key={notif.id} className={notif.leida ? styles.leida : styles.noLeida}>{notif.texto}</li>
                ))}
              </ul>
            ) : (<p className={styles.noItemsText}>No tienes notificaciones nuevas.</p>)}
          </div>
        )}
      </div>

      {/* Modal de postulación */}
      {isApplyModalOpen && applyingJobDetails && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Aplicar a: {applyingJobDetails.title}</h3>
            {applicationError && <p className={styles.errorMessageModal}>{applicationError}</p>}
            {applicationSuccessMessage && <p className={styles.successMessageModal}>{applicationSuccessMessage}</p>}
            {!applicationSuccessMessage && (
              <>
                <div className={styles.formGroupModal}>
                  <label htmlFor="yearsExperience">Años de experiencia en el puesto/rol similar *:</label>
                  <input
                    type="number"
                    min="0"
                    id="yearsExperience"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className={styles.inputFieldModal}
                    placeholder="Ej: 2"
                    disabled={isSubmittingApplication}
                  />
                </div>
                <div className={styles.formGroupModal}>
                  <label>Tecnologías/habilidades que posees para este puesto :</label>
                  <div className={styles.skillTagsContainerModal}>
                    {applyingJobDetails.skillTags && applyingJobDetails.skillTags.length > 0 ?
                      applyingJobDetails.skillTags.map(skill => (
                        <label key={skill} className={styles.skillTagCheckboxLabel}>
                          <input
                            type="checkbox"
                            checked={candidateSkillSelections[skill] || false}
                            onChange={() => handleSkillSelectionChange(skill)}
                            disabled={isSubmittingApplication}
                          /> {skill}
                        </label>
                      )) : (
                        <p>No se especificaron habilidades para esta oferta.</p>
                      )}
                  </div>
                </div>
              </>
            )}
            <div className={styles.modalActions}>
              {!applicationSuccessMessage && (
                <button
                  onClick={handleConfirmApplication}
                  className={`${styles.buttonPrimary} ${styles.buttonModalConfirm}`}
                  disabled={isSubmittingApplication}
                >
                  {isSubmittingApplication ? 'Enviando...' : 'Confirmar Postulación'}
                </button>
              )}
              <button
                onClick={handleCloseApplyModal}
                className={`${styles.buttonSecondary} ${styles.buttonModalCancel}`}
                disabled={isSubmittingApplication && !applicationSuccessMessage}
              >
                {applicationSuccessMessage ? 'Cerrar' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardCandidato;