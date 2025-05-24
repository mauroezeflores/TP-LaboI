import React, { useState } from 'react';
import styles from '../DashboardReclutador.module.css'; // Asegúrate que la ruta a tus estilos sea correcta

// URL base de tu API de FastAPI
const API_BASE_URL = 'http://localhost:8000'; // Cambia esto si tu backend corre en otro puerto/URL

// Lista ejemplo de etiquetas
const ALL_POSSIBLE_TAGS = [
    'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue.js', 'Node.js',
    'Spring Boot', 'PHP','SQL', 'MySQL', 'PostgreSQL', 'MongoDB',
    'Firebase','Scrum', 'Kanban', 'Agile', 'JIRA','Git', 'Testing','Machine Learning',
    'Data Science', 'Inteligencia Artificial','Inglés B2', 'Inglés C1', 'Inglés Avanzado'
];

const initialTagSettings = ALL_POSSIBLE_TAGS.reduce((acc, tag) => {
    acc[tag] = { excluyente: false, deseable: false };
    return acc;
}, {});

export default function CrearConvocatoria() {
    const [tituloConvocatoria, setTituloConvocatoria] = useState('');
    const [puesto, setPuesto] = useState(''); 
    const [sede, setSede] = useState('');    
    const [descripcion, setDescripcion] = useState('');
    const [experienciaRequerida, setExperienciaRequerida] = useState(''); 

    const [tagSettings, setTagSettings] = useState(initialTagSettings);

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

        const excluyentes = Object.entries(tagSettings)
            .filter(([, v]) => v.excluyente) 
            .map(([k]) => k);
        
        const deseables = Object.entries(tagSettings)
            .filter(([, v]) => v.deseable) 
            .map(([k]) => k);

        if (!tituloConvocatoria || !puesto || !sede || !fechaFinalizacion || !experienciaRequerida) {
            setFormError('Los campos: Título, Puesto (ID), Sede (ID), Experiencia Requerida y Fecha de Finalización son obligatorios.');
            return;
        }
        
       {/* if (excluyentes.length === 0) {
            setFormError('Debe seleccionar al menos una etiqueta como "Excluyente".');
            return;
        */}
        
        const idSedeInt = parseInt(sede, 10);
        const idPuestoInt = parseInt(puesto, 10);
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
            etiquetas_deseables: deseables,
            etiquetas_excluyentes: excluyentes,
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
            setPuesto('');
            setSede('');
            setDescripcion('');
            setExperienciaRequerida('');
            setTagSettings(initialTagSettings);
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
                    <label htmlFor="puesto">Puesto (ID Numérico) *</label>
                    <input type="text" id="puesto" value={puesto} onChange={(e) => setPuesto(e.target.value)} disabled={isSubmitting} required placeholder="Ej: 1 (ID del puesto)" />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="sede">Sede (ID Numérico) *</label>
                    <input type="text" id="sede" value={sede} onChange={(e) => setSede(e.target.value)} disabled={isSubmitting} required placeholder="Ej: 1 (ID de la sede)"/>
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
                    <div className={styles.tagsListContainer}>
                        {ALL_POSSIBLE_TAGS.map(tag => (
                            <div key={tag} className={styles.tagItem}>
                                <span className={styles.tagName}>{tag}</span>
                                <div className={styles.tagCheckboxes}>
                                    <label className={styles.tagCheckboxLabel}>
                                        <input 
                                            type="checkbox"
                                            checked={tagSettings[tag]?.excluyente || false}
                                            onChange={() => handleTagCheckboxChange(tag, 'excluyente')}
                                            disabled={isSubmitting}
                                        /> Excluyente
                                    </label>
                                    <label className={styles.tagCheckboxLabel}>
                                        <input 
                                            type="checkbox"
                                            checked={tagSettings[tag]?.deseable || false}
                                            onChange={() => handleTagCheckboxChange(tag, 'deseable')}
                                            disabled={isSubmitting}
                                        /> Deseable
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
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