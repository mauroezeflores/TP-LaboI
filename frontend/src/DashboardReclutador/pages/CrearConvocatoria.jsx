import React, { useState } from 'react';
import styles from '../DashboardReclutador.module.css';

// Simulacion de api
const fakeApi = {
    crearConvocatoria: async (data) => {
        await new Promise(r => setTimeout(r, 500));
        console.log("Datos enviados a la API:", data);
        return { id: Date.now(), ...data };
    }
};

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
    
    const [tagSettings, setTagSettings] = useState(initialTagSettings);
    
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFinalizacion, setFechaFinalizacion] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleTagCheckboxChange = (tagName, type) => { // type es 'excluyente' o 'deseable'
        setTagSettings(prevSettings => {
            const newTagState = { ...prevSettings[tagName] };
            const currentValue = newTagState[type];
            
            newTagState[type] = !currentValue; // Toggle el checkbox clickeado

            // Si se acaba de marcar como true, y el otro tipo también es true, desmarcar el otro.
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
            .filter(([ v]) => v.excluyente)
            .map(([k]) => k);
        
        // Validación de campos obligatorios
        if (!tituloConvocatoria || !puesto || !sede || !fechaInicio || !fechaFinalizacion) {
            setFormError('Los campos: Título de la Convocatoria, Puesto, Sede, Fecha de Inicio y Fecha de Finalización son obligatorios.');
            return;
        }
        
        if (excluyentes.length === 0) {
            setFormError('Debe seleccionar al menos una etiqueta como "Excluyente".');
            return;
        }

        if (new Date(fechaInicio) > new Date(fechaFinalizacion)) {
            setFormError('La fecha de inicio no puede ser posterior a la fecha de finalización.');
            return;
        }

        setIsSubmitting(true);

        const deseables = Object.entries(tagSettings)
            .filter(([v]) => v.deseable)
            .map(([k]) => k);

        const nuevaConvocatoriaData = {
            tituloConvocatoria: tituloConvocatoria,
            puesto: puesto,
            sede: sede,
            descripcion: descripcion,
            etiquetas: {
                excluyentes: excluyentes,
                deseables: deseables,
            },
            fechaInicio: fechaInicio,
            fechaFinalizacion: fechaFinalizacion,
        };

        try {
            const convocatoriaCreada = await fakeApi.crearConvocatoria(nuevaConvocatoriaData);
            setSuccessMessage(`Convocatoria "${convocatoriaCreada.tituloConvocatoria || convocatoriaCreada.puesto}" creada con éxito (ID: ${convocatoriaCreada.id}).`);
            // Limpiar formulario
            setTituloConvocatoria('');
            setPuesto('');
            setSede('');
            setDescripcion('');
            setTagSettings(initialTagSettings); // Resetear etiquetas
            setFechaInicio('');
            setFechaFinalizacion('');
        } catch (error) {
            setFormError(error.message || "Error al crear la convocatoria.");
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
                    <input type="text" id="puesto" value={puesto} onChange={(e) => setPuesto(e.target.value)} disabled={isSubmitting} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="sede">Sede *</label>
                    <input type="text" id="sede" value={sede} onChange={(e) => setSede(e.target.value)} disabled={isSubmitting} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="descripcion">Descripción del Puesto</label>
                    <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" disabled={isSubmitting} />
                </div>

                <div className={styles.formGroup}>
                    <label>Etiquetas / Palabras Clave (Seleccione el tipo para cada una) *</label>
                    <div className={styles.tagsListContainer}> {/* Contenedor para scroll si hay muchas etiquetas */}
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
                
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="fechaFinalizacion">Fecha de Finalización *</label>
                        <input type="date" id="fechaFinalizacion" value={fechaFinalizacion} onChange={(e) => setFechaFinalizacion(e.target.value)} disabled={isSubmitting} required />
                    </div>
                </div>

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Convocatoria'}
                </button>
            </form>
        </section>
    );
}