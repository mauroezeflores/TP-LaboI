import React, { useState } from 'react';
import { useEffect } from 'react';
import styles from '../DashboardReclutador.module.css'; // Asegúrate que la ruta a tus estilos sea correcta

// URL base de tu API de FastAPI
const API_BASE_URL = 'http://localhost:8000'; // Cambia esto si tu backend corre en otro puerto/URL



export default function CrearConvocatoria() {
    const [puestos, setPuestos] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [idPuesto, setIdPuesto] = useState('');
    const [idSede, setIdSede] = useState('');

    const [etiquetas, setEtiquetas] = useState([]);
    const [tagSettings, setTagSettings] = useState({});
    const [loadingEtiquetas, setLoadingEtiquetas] = useState(true);

    useEffect(() => {
        const fetchEtiquetas = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/etiquetas`);
                const data = await res.json();
                setEtiquetas(data);
                // Inicializa tagSettings con las etiquetas traídas
                const initial = {};
                data.forEach(et => {
                    initial[et.nombre] = { excluyente: false, deseable: false };
                });
                setTagSettings(initial);
            } catch (e) {
                console.error("Error al cargar etiquetas:", e);
            } finally {
                setLoadingEtiquetas(false);
            }
        };
        fetchEtiquetas();
    }, []);
    useEffect(() => {
    const fetchPuestos = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/puestos`);
            const data = await res.json();
            setPuestos(data);
        } catch (e) {
            console.error("Error al cargar puestos:", e);
        }
    };
    fetchPuestos();
        }, []);

    useEffect(() => {
    const fetchSedes = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/sedes`);
            const data = await res.json();
            setSedes(data);
        } catch (e) {
            console.error("Error al cargar sedes:", e);
        }
    };
    fetchSedes();
}, []);
    const [tituloConvocatoria, setTituloConvocatoria] = useState('');

    const [descripcion, setDescripcion] = useState('');
    const [experienciaRequerida, setExperienciaRequerida] = useState(''); 

    const [fechaFinalizacion, setFechaFinalizacion] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleTagCheckboxChange = (tagName, type) => { 
        setTagSettings(prevSettings => {
            const currentTagState = prevSettings[tagName] || { excluyente: false, deseable: false };
            const newTagState = { ...currentTagState };
            const currentValue = newTagState[type];
            
            newTagState[type] = !currentValue; 

            if (newTagState[type] === true) {
                if (type === 'excluyente' && newTagState.deseable) {
                    newTagState.deseable = false;
                } else if (type === 'deseable' && newTagState.excluyente) {
                    newTagState.excluyente = false;
                }
            }
            return { ...prevSettings, [tagName]: newTagState };
        });
    };

    const handleCrearConvocatoria = async (e) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage('');

const excluyentes = etiquetas
    .filter(et => tagSettings[et.nombre]?.excluyente)
    .map(et => et.id_etiqueta);

const deseables = etiquetas
    .filter(et => tagSettings[et.nombre]?.deseable)
    .map(et => et.id_etiqueta);

        if (!tituloConvocatoria || !puesto || !sede || !fechaFinalizacion || !experienciaRequerida) {
            setFormError('Los campos: Título, Puesto (ID), Sede (ID), Experiencia Requerida y Fecha de Finalización son obligatorios.');
            return;
        }
        
       {/* if (excluyentes.length === 0) {
            setFormError('Debe seleccionar al menos una etiqueta como "Excluyente".');
            return;
        */}
        
        const idSedeInt = parseInt(idSede, 10);
        const idPuestoInt = parseInt(idPuesto, 10);
        const experienciaInt = parseInt(experienciaRequerida, 10);

        if (isNaN(idSedeInt) || isNaN(idPuestoInt) || isNaN(experienciaInt)) {
            setFormError('Puesto (ID), Sede (ID) y Experiencia Requerida deben ser números válidos.');
            return;
        }

        setIsSubmitting(true);

const payloadBackend = {
    id_sede: idSedeInt,
    id_puesto: idPuestoInt,
    descripcion: `${tituloConvocatoria} - ${descripcion}`,
    fecha_de_finalizacion: fechaFinalizacion, 
    experiencia_requerida: experienciaInt,
    etiquetas_deseables: deseables,      // array de IDs
    etiquetas_excluyentes: excluyentes,  // array de IDs
};

        try {
            const response = await fetch(`${API_BASE_URL}/convocatoria`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadBackend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.detail || responseData.error || `Error HTTP: ${response.status}`;
                throw new Error(errorMessage);
            }
            
            setSuccessMessage(`Convocatoria "${tituloConvocatoria}" creada con éxito (ID de Convocatoria: ${responseData.id_convocatoria}).`);
            // Limpiar formulario
            setTituloConvocatoria('');
            setIdPuesto('');
            setIdSede('');
            setDescripcion('');
            setExperienciaRequerida('');
            setTagSettings(
            etiquetas.reduce((acc, et) => {
                acc[et.nombre] = { excluyente: false, deseable: false };
                return acc;
            }, {})
            );
            setFechaFinalizacion('');
        } catch (error) {
            setFormError(error.message || "Error al crear la convocatoria.");
            console.error("Error en API:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.section}>
            <h2>🚀 Crear Convocatoria</h2>
            <form onSubmit={handleCrearConvocatoria} className={styles.formConvocatoria}>
                {formError && <p className={styles.errorMessage}>{formError}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                <div className={styles.formGroup}>
                    <label htmlFor="tituloConvocatoria">Título de la Convocatoria *</label>
                    <input type="text" id="tituloConvocatoria" value={tituloConvocatoria} onChange={(e) => setTituloConvocatoria(e.target.value)} disabled={isSubmitting} required />
                </div>
<div className={styles.formGroup}>
    <label htmlFor="puesto">Puesto *</label>
    <select
        id="puesto"
        value={idPuesto}
        onChange={e => setIdPuesto(e.target.value)}
        disabled={isSubmitting}
        required
    >
        <option value="">Seleccionar puesto</option>
        {puestos.map(p => (
            <option key={p.id_puesto_trabajo} value={p.id_puesto_trabajo}>
                {p.nombre} {p.seniority ? `(${p.seniority})` : ""}
            </option>
        ))}
    </select>
</div>

<div className={styles.formGroup}>
    <label htmlFor="sede">Sede *</label>
    <select
        id="sede"
        value={idSede}
        onChange={e => setIdSede(e.target.value)}
        disabled={isSubmitting}
        required
    >
        <option value="">Seleccionar sede</option>
        {sedes.map(s => (
            <option key={s.id_sede} value={s.id_sede}>
                {s.nombre}
            </option>
        ))}
    </select>
</div>

                <div className={styles.formGroup}>
                    <label htmlFor="descripcion">Descripción Adicional del Puesto</label>
                    <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" disabled={isSubmitting} />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="experienciaRequerida">Experiencia Requerida (años) *</label>
                    <input type="text" id="experienciaRequerida" value={experienciaRequerida} onChange={(e) => setExperienciaRequerida(e.target.value)} disabled={isSubmitting} required min="0" />
                </div>

<div className={styles.formGroup}>
    <label>Etiquetas / Palabras Clave (Seleccione el tipo para cada una) *</label>
    {loadingEtiquetas ? (
        <p>Cargando etiquetas...</p>
    ) : (
        <div className={styles.tagsListContainer}>
            {etiquetas.map(etiqueta => (
                <div key={etiqueta.id_etiqueta} className={styles.tagItem}>
                    <span className={styles.tagName}>{etiqueta.nombre}</span>
                    <div className={styles.tagCheckboxes}>
                        <label className={styles.tagCheckboxLabel}>
                            <input 
                                type="checkbox"
                                checked={tagSettings[etiqueta.nombre]?.excluyente || false}
                                onChange={() => handleTagCheckboxChange(etiqueta.nombre, 'excluyente')}
                                disabled={isSubmitting}
                            /> Excluyente
                        </label>
                        <label className={styles.tagCheckboxLabel}>
                            <input 
                                type="checkbox"
                                checked={tagSettings[etiqueta.nombre]?.deseable || false}
                                onChange={() => handleTagCheckboxChange(etiqueta.nombre, 'deseable')}
                                disabled={isSubmitting}
                            /> Deseable
                        </label>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>
                
                <div className={styles.formGroup}> 
                    <label htmlFor="fechaFinalizacion">Fecha de Finalización *</label>
                    <input type="date" id="fechaFinalizacion" value={fechaFinalizacion} onChange={(e) => setFechaFinalizacion(e.target.value)} disabled={isSubmitting} required />
                </div>

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Convocatoria'}
                </button>
            </form>
        </section>
    );
}