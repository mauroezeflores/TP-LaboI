import React, { useState, useEffect, useCallback } from 'react';
import styles from '../DashboardReclutador.module.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const mockLicencias = [
    { id: 1, empleadoId: 101, empleadoNombre: "Ana Pérez", motivo: "Médica", fechaInicio: "2025-05-10", fechaFin: "2025-05-12", estado: "Aprobada", dias: 3 },
    { id: 2, empleadoId: 102, empleadoNombre: "Carlos López", motivo: "Estudio", fechaInicio: "2025-06-01", fechaFin: "2025-06-05", estado: "Aprobada", dias: 5 },
    { id: 3, empleadoId: 103, empleadoNombre: "Laura Gómez", motivo: "Personal", fechaInicio: "2025-05-20", fechaFin: "2025-05-20", estado: "Aprobada", dias: 1 },
    { id: 4, empleadoId: 101, empleadoNombre: "Ana Pérez", motivo: "Médica", fechaInicio: "2025-03-01", fechaFin: "2025-03-25", estado: "Aprobada", dias: 25 },
    { id: 5, empleadoId: 104, empleadoNombre: "Juan Martín", motivo: "Personal", fechaInicio: "2025-05-02", fechaFin: "2025-05-02", estado: "Aprobada", dias: 1 },
    { id: 6, empleadoId: 104, empleadoNombre: "Juan Martín", motivo: "Personal", fechaInicio: "2025-05-09", fechaFin: "2025-05-09", estado: "Aprobada", dias: 1 },
    { id: 7, empleadoId: 104, empleadoNombre: "Juan Martín", motivo: "Personal", fechaInicio: "2025-05-16", fechaFin: "2025-05-16", estado: "Aprobada", dias: 1 },
];

const mockEmpleadosDetalle = [
    { id: 101, nombre: "Ana Pérez", yearsAtCompany: 5, performanceRatingHistory: [4, 4, 4], recentAbsences: 2, jobSatisfaction: 4 },
    { id: 102, nombre: "Carlos López", yearsAtCompany: 2, performanceRatingHistory: [3, 4, 4], recentAbsences: 0, jobSatisfaction: 5 },
    { id: 103, nombre: "Laura Gómez", yearsAtCompany: 8, performanceRatingHistory: [5, 3, 3], recentAbsences: 1, jobSatisfaction: 3 },
    { id: 104, nombre: "Juan Martín", yearsAtCompany: 0.5, performanceRatingHistory: [3, 3], recentAbsences: 8, jobSatisfaction: 2 },
    { id: 105, nombre: "Sofía Fernández", yearsAtCompany: 3, performanceRatingHistory: [4, 4, 4], recentAbsences: 1, jobSatisfaction: 1 },
];

const fakeApi = {
    getDatosParaAnomalias: async () => {
        await new Promise(r => setTimeout(r, 600));
        const data = {
            licencias: mockLicencias,
            empleadosDetalle: mockEmpleadosDetalle
        };
        return data;
    }
};

const detectarAnomalias = (datos) => {
    const anomaliasDetectadas = [];
    const licencias = datos?.licencias || [];
    const empleadosDetalle = datos?.empleadosDetalle || [];

    

    licencias.forEach(lic => {
        if (lic.estado === 'Aprobada' && lic.dias > 20) {
            anomaliasDetectadas.push({
                id: `lic-larga-${lic.id}`, tipo: 'Licencia Extensa',
                descripcion: `${lic.empleadoNombre} (${lic.empleadoId}) tuvo licencia de ${lic.dias} días (${lic.motivo}).`,
                entidadId: lic.empleadoId, entidadNombre: lic.empleadoNombre, fecha: lic.fechaFin, prioridad: 'Media'
            });
        }
    });

    const licenciasPersonalesPorEmpleado = licencias.reduce((acc, lic) => {
        if (lic.motivo === 'Personal' && lic.estado === 'Aprobada') {
            if (!acc[lic.empleadoId]) acc[lic.empleadoId] = { nombre: lic.empleadoNombre, fechas: [] };
            try {
              const fechaValida = new Date(lic.fechaInicio);
              if (!isNaN(fechaValida)) {
                 acc[lic.empleadoId].fechas.push(fechaValida);
              }
            } catch (e) {
               console.error(`Error parseando fecha ${lic.fechaInicio} para licencia ${lic.id}: `, e);
            }
        }
        return acc;
    }, {});

    Object.entries(licenciasPersonalesPorEmpleado).forEach(([empleadoId, data]) => {
        if (data.fechas.length < 3) return;
        data.fechas.sort((a, b) => a - b);
        for (let i = 0; i <= data.fechas.length - 3; i++) {
            const fechaInicioVentana = data.fechas[i];
            let count = 1;
            let ultimaFechaVentana = fechaInicioVentana;
            for (let j = i + 1; j < data.fechas.length; j++) {
                const diffTime = data.fechas[j] - fechaInicioVentana;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) {
                    count++;
                    ultimaFechaVentana = data.fechas[j];
                } else {
                     if (j < i+2) break;
                }
            }
             if (count >= 3) {
                anomaliasDetectadas.push({
                    id: `lic-freq-${empleadoId}-${i}`, tipo: 'Licencias Personales Frecuentes',
                    descripcion: `${data.nombre} (${empleadoId}) solicitó ${count} licencias personales en ~30 días (hasta ${ultimaFechaVentana.toISOString().split('T')[0]}).`,
                    entidadId: empleadoId, entidadNombre: data.nombre, fecha: ultimaFechaVentana.toISOString().split('T')[0], prioridad: 'Baja'
                });
                break;
            }
        }
    });

    empleadosDetalle.forEach(emp => {
        if (emp.yearsAtCompany !== undefined && emp.yearsAtCompany < 1) {
            anomaliasDetectadas.push({
                id: `emp-perm-${emp.id}`, tipo: 'Baja Permanencia',
                descripcion: `${emp.nombre} (${emp.id}) tiene menos de 1 año en la empresa (${emp.yearsAtCompany} años).`,
                entidadId: emp.id, entidadNombre: emp.nombre, fecha: new Date().toISOString().split('T')[0], prioridad: 'Baja'
            });
        }

        if (emp.performanceRatingHistory && emp.performanceRatingHistory.length >= 2) {
            const lastRating = emp.performanceRatingHistory[emp.performanceRatingHistory.length - 1];
            const prevRating = emp.performanceRatingHistory[emp.performanceRatingHistory.length - 2];
            if (lastRating < prevRating && (prevRating - lastRating) >= 2) {
                anomaliasDetectadas.push({
                    id: `emp-perf-${emp.id}`, tipo: 'Caída Desempeño',
                    descripcion: `${emp.nombre} (${emp.id}) tuvo una caída significativa en la calificación de desempeño (de ${prevRating} a ${lastRating}).`,
                    entidadId: emp.id, entidadNombre: emp.nombre, fecha: new Date().toISOString().split('T')[0], prioridad: 'Alta'
                });
            }
        }

        if (emp.recentAbsences !== undefined && emp.recentAbsences > 5) {
             anomaliasDetectadas.push({
                id: `emp-aus-${emp.id}`, tipo: 'Ausentismo Elevado',
                descripcion: `${emp.nombre} (${emp.id}) registró ${emp.recentAbsences} días de ausencia recientemente.`,
                entidadId: emp.id, entidadNombre: emp.nombre, fecha: new Date().toISOString().split('T')[0], prioridad: 'Media'
            });
        }

        if (emp.jobSatisfaction !== undefined && emp.jobSatisfaction <= 2) {
             anomaliasDetectadas.push({
                id: `emp-sat-${emp.id}`, tipo: 'Baja Satisfacción',
                descripcion: `${emp.nombre} (${emp.id}) reportó un nivel bajo de satisfacción (${emp.jobSatisfaction}/5).`,
                entidadId: emp.id, entidadNombre: emp.nombre, fecha: new Date().toISOString().split('T')[0], prioridad: 'Media'
            });
        }
    });

    return anomaliasDetectadas;
};

export default function DeteccionAnomalias() {
    const [anomalias, setAnomalias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDataAndDetect = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const datos = await fakeApi.getDatosParaAnomalias();
             if (!datos) throw new Error("No se recibieron datos de la API simulada.");

            let anomaliasDetectadas = [];
            try {
                 anomaliasDetectadas = detectarAnomalias(datos);
            } catch (detectionError) {
                 console.error("DFetch: Error DENTRO de la función detectarAnomalias:", detectionError);
                 throw new Error("Fallo en el procesamiento de reglas de anomalía.");
            }

            setAnomalias(anomaliasDetectadas);

        } catch (err) {
            console.error("DFetch: Error GENERAL:", err);
            setError("No se pudieron procesar los datos para detectar anomalías. Revise la consola para más detalles.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDataAndDetect();
    }, [fetchDataAndDetect]);

    const conteoPorTipo = anomalias.reduce((acc, anomalia) => {
        acc[anomalia.tipo] = (acc[anomalia.tipo] || 0) + 1;
        return acc;
    }, {});

    const tipoColores = {
        'Licencia Extensa': 'rgba(217, 83, 79, 0.6)',
        'Licencias Personales Frecuentes': 'rgba(91, 192, 222, 0.6)',
        'Baja Permanencia': 'rgba(108, 117, 125, 0.6)',
        'Caída Desempeño': 'rgba(217, 83, 79, 0.8)',
        'Ausentismo Elevado': 'rgba(240, 173, 78, 0.8)',
        'Baja Satisfacción': 'rgba(255, 193, 7, 0.6)',
    };
    const tipoBordes = {
       'Licencia Extensa': 'rgb(217, 83, 79)',
       'Licencias Personales Frecuentes': 'rgb(91, 192, 222)',
       'Baja Permanencia': 'rgb(108, 117, 125)',
       'Caída Desempeño': 'rgb(217, 83, 79)',
       'Ausentismo Elevado': 'rgb(240, 173, 78)',
       'Baja Satisfacción': 'rgb(255, 193, 7)',
    };

    const labelsGrafico = Object.keys(conteoPorTipo);

    const dataGrafico = {
        labels: labelsGrafico,
        datasets: [
            {
                label: 'Cantidad de Anomalías Detectadas',
                data: labelsGrafico.map(label => conteoPorTipo[label]),
                backgroundColor: labelsGrafico.map(label => tipoColores[label] || 'rgba(150, 150, 150, 0.6)'),
                borderColor: labelsGrafico.map(label => tipoBordes[label] || 'rgb(150, 150, 150)'),
                borderWidth: 1,
            },
        ],
    };

    const opcionesGrafico = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Distribución de Anomalías por Tipo', font: { size: 16 } },
            tooltip: {
                 callbacks: {
                     label: function(context) {
                         let label = context.dataset.label || '';
                         if (label) { label += ': '; }
                         if (context.parsed.y !== null) { label += context.parsed.y; }
                         label += ` (${context.label})`;
                         return label;
                     }
                 }
            }
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    };

     const getPrioridadStyle = (prioridad) => {
        switch (prioridad?.toLowerCase()) {
            case 'alta': return { backgroundColor: '#d9534f', color: 'white' };
            case 'media': return { backgroundColor: '#f0ad4e', color: 'white' };
            case 'baja': return { backgroundColor: '#5bc0de', color: 'white' };
            default: return { backgroundColor: '#6c757d', color: 'white' };
        }
    };

    return (
        <section className={styles.section}>
            <h2>
                Detección de Anomalías 
            </h2>

            {isLoading && <p>Analizando datos...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {!isLoading && !error && (
                <>
                    {anomalias.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                            No se detectaron anomalías significativas según las reglas actuales.
                        </p>
                    ) : (
                        <>
                            <div style={{ height: '350px', marginBottom: '2.5rem', padding: '1rem', border: '1px solid var(--border-soft)', borderRadius: '8px', background: '#fff' }}>
                                {labelsGrafico.length > 0 ? (
                                   <Bar options={opcionesGrafico} data={dataGrafico} />
                                ) : (
                                   <p>No hay datos para mostrar en el gráfico.</p>
                                )}
                            </div>

                            <h3>Detalle de Anomalías Detectadas ({anomalias.length})</h3>
                            <div className={styles.tableContainer}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Descripción</th>
                                            <th>Entidad Afectada</th>
                                            <th>Fecha Detección</th>
                                            <th>Prioridad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {anomalias.map((anomalia) => (
                                            <tr key={anomalia.id}>
                                                <td>{anomalia.tipo}</td>
                                                <td style={{ whiteSpace: 'normal', minWidth: '100px' }}>{anomalia.descripcion}</td>
                                                <td>{anomalia.entidadNombre} {anomalia.entidadId ? `(${anomalia.entidadId})` : ''}</td>
                                                <td>{anomalia.fecha}</td>
                                                <td>
                                                    <span className={styles.statusBadge} style={getPrioridadStyle(anomalia.prioridad)}>
                                                        {anomalia.prioridad || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}
        </section>
    );
}