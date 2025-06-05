import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../DashboardReclutador.module.css';
import { LuClipboardList } from "react-icons/lu";

const API_BASE_URL = 'http://localhost:8000';

export default function VerConvocatorias() {
    const [misConvocatorias, setMisConvocatorias] = useState([]);
    const [isLoadingConvocatorias, setIsLoadingConvocatorias] = useState(true);
    const [convocatoriasError, setConvocatoriasError] = useState('');
    const [cerrandoId, setCerrandoId] = useState(null);
    const navigate = useNavigate();

    const fetchConvocatorias = useCallback(async () => {
        setIsLoadingConvocatorias(true);
        setConvocatoriasError('');
        try {
            const response = await fetch(`${API_BASE_URL}/convocatorias`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setMisConvocatorias(data);
        } catch (error) {
            setConvocatoriasError("Error al cargar convocatorias desde el backend.");
            console.error("Error fetching convocatorias:", error);
        } finally {
            setIsLoadingConvocatorias(false);
        }
    }, []);

    useEffect(() => {
        fetchConvocatorias();
    }, [fetchConvocatorias]);

    const handleNavigateVerCandidatos = (convocatoriaId) => {
        navigate(`/dashboard/empleadoRRHH/convocatoria/${convocatoriaId}/candidatos`);
    };

    const cerrarConvocatoria = async (convocatoriaId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/convocatoria/${convocatoriaId}/cerrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error('No se pudo cerrar la convocatoria');
            }
            fetchConvocatorias(); // Recarga la lista
        } catch (error) {
            alert('Error al cerrar la convocatoria');
            console.error(error);
        }
    };

    return (
        <section className={styles.section}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LuClipboardList />
                Mis Convocatorias
            </h2>

            {isLoadingConvocatorias && <p>Cargando convocatorias...</p>}
            {convocatoriasError && <p className={styles.errorMessage}>{convocatoriasError}</p>}

            {!isLoadingConvocatorias && !convocatoriasError && (
                <div className={styles.tableContainer}>
                    {misConvocatorias.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Fecha Finalización</th>
                                    <th>Estado</th>
                                    <th>Candidatos Inscritos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {misConvocatorias.map((conv) => (
                                    <tr key={conv.id}>
                                        <td>{conv.titulo}</td>
                                        <td>{new Date(conv.fecha).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[conv.estado?.toLowerCase()] || styles.defaultStatus}`}>
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
                                            {conv.estado !== 'Cerrada' && (
                                                <button
                                                    onClick={() => cerrarConvocatoria(conv.id)}
                                                    className={styles.actionButton}
                                                    style={{ marginLeft: '0.5rem', background: 'var(--danger)' }}
                                                >
                                                    Cerrar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-light)' }}>
                            No hay convocatorias para mostrar o no se pudieron cargar.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}