import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../DashboardReclutador.module.css';
import { LuClipboardList } from "react-icons/lu";

 const fakeApi = {
     getMisConvocatorias: async () => { await new Promise(r => setTimeout(r, 500)); return [ { id: 1, titulo: 'Desarrollador Frontend Sr.', fecha: '2025-04-25', estado: 'Activa', aptos: 5 }, { id: 2, titulo: 'Analista de Datos Jr.', fecha: '2025-04-20', estado: 'Activa', aptos: 12 }, { id: 3, titulo: 'Project Manager', fecha: '2025-03-15', estado: 'Cerrada', aptos: 8 }, ]; }
 };

export default function VerConvocatorias() {
    const [misConvocatorias, setMisConvocatorias] = useState([]);
    const [isLoadingConvocatorias, setIsLoadingConvocatorias] = useState(true);
    const [convocatoriasError, setConvocatoriasError] = useState('');
    const navigate = useNavigate();

    const fetchConvocatorias = useCallback(async () => {
        setIsLoadingConvocatorias(true);
        setConvocatoriasError('');
        try {
            const data = await fakeApi.getMisConvocatorias();
            setMisConvocatorias(data);
        } catch (error) {
            setConvocatoriasError("Error al cargar convocatorias.");
            console.error("Error fetching convocatorias:", error)
        } finally {
            setIsLoadingConvocatorias(false);
        }
    }, []);

    useEffect(() => {
        fetchConvocatorias();
    }, [fetchConvocatorias]);

    const handleNavigateVerCandidatos = (convocatoriaId) => {
        navigate(`/dashboard/reclutador/convocatoria/${convocatoriaId}/candidatos`);
    };

    return (
        <section className={styles.section}>
            {/* Título con estilo base h2 y alineación flex para el icono */}
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LuClipboardList /> {/* Icono */}
                Mis Convocatorias
            </h2>

            {/* Muestra estado de carga */}
            {isLoadingConvocatorias && <p>Cargando convocatorias...</p>}
            {/* Muestra error si existe, aplicando la clase de error */}
            {convocatoriasError && <p className={styles.errorMessage}>{convocatoriasError}</p>}

            {/* Contenedor de la tabla con su clase específica */}
            {!isLoadingConvocatorias && !convocatoriasError && (
                 <div className={styles.tableContainer}>
                    {misConvocatorias.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Fecha Creación</th>
                                    <th>Estado</th>
                                    <th>Candidatos Aptos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {misConvocatorias.map((conv) => (
                                    <tr key={conv.id}>
                                        <td>{conv.titulo}</td>
                                        <td>{conv.fecha}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[conv.estado.toLowerCase()] || styles.defaultStatus}`}>
                                                {conv.estado}
                                            </span>
                                        </td>
                                        <td>{conv.aptos}</td>
                                        <td>
                                            <button
                                                onClick={() => handleNavigateVerCandidatos(conv.id)}
                                                className={styles.actionButton}
                                            >
                                                Ver Candidatos
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                      // Mensaje si no hay convocatorias
                      <p style={{textAlign: 'center', padding: '1rem', color: 'var(--text-light)' }}>No has creado ninguna convocatoria todavía.</p>
                     )}
                 </div>
            )}
        </section>
    );
}