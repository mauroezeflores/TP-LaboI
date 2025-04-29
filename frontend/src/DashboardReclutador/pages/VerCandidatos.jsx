import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../DashboardReclutador.module.css';

// Simulación API (con cvUrl)
const fakeApi = {
    getCandidatosAptos: async (id) => { /* ... */ await new Promise(r => setTimeout(r, 500)); const db = { 1: [{ id: 101, nombre: 'Ana', apellido: 'García', email: 'ana.g@mail.com', telefono: '1122334455', ubicacion: 'CABA', cvUrl: '/path/to/ana_garcia_cv.pdf' }, { id: 102, nombre: 'Luis', apellido: 'Martínez', email: 'luis.m@mail.com', telefono: '5566778899', ubicacion: 'Rosario', cvUrl: '/path/to/cv_luis_martinez.docx' }], 2: [{ id: 201, nombre: 'Carla', apellido: 'López', email: 'carla.l@mail.com', telefono: '9988776655', ubicacion: 'Córdoba', cvUrl: '/path/to/candidatos/carla_cv.pdf' }], 3: [] }; return db[id] || []; },
    getConvocatoriaInfo: async (id) => { /* ... */ await new Promise(r => setTimeout(r, 100)); const db = {1:{titulo:'Desarrollador Frontend Sr.'}, 2:{titulo:'Analista de Datos Jr.'}, 3:{titulo:'Project Manager'}}; return db[id];}
};

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
            const [info, candidatosData] = await Promise.all([
                 fakeApi.getConvocatoriaInfo(convocatoriaId),
                 fakeApi.getCandidatosAptos(convocatoriaId)
             ]);
             setConvocatoriaInfo(info);
             setCandidatos(candidatosData);
        } catch (err) {
            setError("Error al cargar datos de candidatos.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [convocatoriaId]);

    useEffect(() => {
        fetchCandidatosData();
    }, [fetchCandidatosData]);

    return (
         // Usa la clase .section como contenedor principal
         <section className={styles.section}>
             {/* Usa la clase .backLink para el enlace de volver */}
             <Link to="/dashboard/reclutador/mis-convocatorias" className={styles.backLink}>← Volver a Mis Convocatorias</Link>

             <h2>👥 Candidatos Aptos para "{convocatoriaInfo?.titulo || '...'}"</h2>
              {/* Usa clases de error y contenedor de tabla */}
             {isLoading && <p>Cargando...</p>}
             {error && <p className={styles.errorMessage}>{error}</p>}
             {!isLoading && !error && (
                 <>
                    {candidatos.length > 0 ? (
                       <div className={styles.tableContainer}>
                          <table>
                             <thead>
                                <tr>
                                   <th>Nombre</th><th>Apellido</th><th>Email</th>
                                   <th>Teléfono</th><th>Ubicación</th><th>CV</th>
                                </tr>
                              </thead>
                             <tbody>
                                {candidatos.map(cand => (
                                    <tr key={cand.id}>
                                        <td>{cand.nombre}</td><td>{cand.apellido}</td>
                                        <td>{cand.email}</td><td>{cand.telefono}</td>
                                        <td>{cand.ubicacion}</td>
                                        <td>
                                           {cand.cvUrl ? (
                                              /* Usa clase .cvLink */
                                              <a href={cand.cvUrl} target="_blank" rel="noopener noreferrer" className={styles.cvLink}>
                                                 Ver CV
                                              </a>
                                           ) : ( <span>N/A</span> )}
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    ) : <p>No hay candidatos aptos.</p>}
                 </>
             )}
         </section>
    );
}