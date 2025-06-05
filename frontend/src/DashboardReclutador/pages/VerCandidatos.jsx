import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../DashboardReclutador.module.css';

const API_BASE_URL = 'http://localhost:8000';

export default function VerCandidatos() {
    const { convocatoriaId } = useParams();
    const [candidatos, setCandidatos] = useState([]);
    const [convocatoriaInfo, setConvocatoriaInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCandidatosData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const [infoResponse, candidatosResponse] = await Promise.all([
                 fetch(`${API_BASE_URL}/convocatoria/${convocatoriaId}/info`),
                 fetch(`${API_BASE_URL}/convocatoria/${convocatoriaId}/candidatos`) // Este endpoint ahora incluirá es_apto y score_ml
            ]);

            if (!infoResponse.ok) {
                const errorData = await infoResponse.json().catch(() => ({}));
                throw new Error(errorData.detail || `Error al cargar info de convocatoria: ${infoResponse.status}`);
            }
            const infoData = await infoResponse.json();
            setConvocatoriaInfo(infoData);

            if (!candidatosResponse.ok) {
                const errorData = await candidatosResponse.json().catch(() => ({}));
                throw new Error(errorData.detail || `Error al cargar candidatos: ${candidatosResponse.status}`);
            }
            const candidatosData = await candidatosResponse.json();
            setCandidatos(candidatosData);

        } catch (err) {
            setError(err.message || "Error al cargar datos de la convocatoria y candidatos.");
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [convocatoriaId]);

    useEffect(() => {
        fetchCandidatosData();
    }, [fetchCandidatosData]);

    return (
         <section className={styles.section}>
             <Link to="/dashboard/empleadoRRHH/mis-convocatorias" className={styles.backLink}>← Volver a Mis Convocatorias</Link>

             <h2>👥 Candidatos para "{convocatoriaInfo?.titulo || 'Cargando título...'}"</h2>
             
             {isLoading && <p>Cargando datos...</p>}
             {error && <p className={styles.errorMessage}>{error}</p>}
             
             {!isLoading && !error && (
                 <>
                    {candidatos.length > 0 ? (
                       <div className={styles.tableContainer}>
                          <table>
                             <thead>
                                <tr>
                                   <th>Nombre</th>
                                   <th>Apellido</th>
                                   <th>Email</th>
                                   <th>Teléfono</th> 
                                   <th>Ubicación</th>
                                   <th>CV</th>
                                   <th>Score ML</th>      {/* <--- Nueva Columna */}
                                   <th>Recomendación</th> {/* <--- Nueva Columna */}
                                </tr>
                              </thead>
                             <tbody>
                                {candidatos.map(cand => (
                                    <tr key={cand.id}>
                                        <td>{cand.nombre || 'N/A'}</td>
                                        <td>{cand.apellido || 'N/A'}</td>
                                        <td>{cand.email || 'N/A'}</td> 
                                        <td>{cand.telefono || 'N/A'}</td>
                                        <td>{cand.ubicacion || 'N/A'}</td>  
                                        <td>
                                            {/* Mostrar CV como enlace si existe */}
                                            {cand.cvUrl ? (
                                                <a href={cand.cvUrl} target="_blank" rel="noopener noreferrer">
                                                    Ver CV
                                                </a>
                                            ) : (
                                                'N/A' // Si no hay CV, mostrar N/A
                                            )}
                                        </td>
                                        <td> 
                                            {/* Mostrar Score ML */}
                                            {cand.score_ml !== null && cand.score_ml !== undefined 
                                                ? cand.score_ml.toFixed(3) 
                                                : 'N/P'} {/* N/P = No Procesado o No Pudo Predecir */}
                                        </td>
                                        <td>
                                            {/* Mostrar Recomendación */}
                                            {cand.es_apto === null || cand.es_apto === undefined 
                                                ? 'N/P' 
                                                : (cand.es_apto ? <span style={{color: 'green', fontWeight: 'bold'}}>Apto ✅</span> : <span style={{color: 'red', fontWeight: 'bold'}}>No Apto ❌</span>)}
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    ) : <p>No hay candidatos para esta convocatoria o no se pudieron cargar.</p>}
                 </>
             )}
         </section>
    );
}