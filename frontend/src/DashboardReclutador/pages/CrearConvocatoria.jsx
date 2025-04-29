import React, { useState } from 'react';
import styles from '../DashboardReclutador.module.css';
//Simulacion de api
const fakeApi = {
    crearConvocatoria: async (data) => { await new Promise(r => setTimeout(r, 500)); return { id: Date.now(), ...data }; }
};

export default function CrearConvocatoria() {
    const [tituloPuesto, setTituloPuesto] = useState('');
    const [descripcionPuesto, setDescripcionPuesto] = useState('');
    const [etiquetas, setEtiquetas] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCrearConvocatoria = async (e) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage('');
        if (!tituloPuesto || !etiquetas) {
            setFormError('El título del puesto y las etiquetas son obligatorios.');
            return;
        }
        setIsSubmitting(true);
        const nuevaConvocatoriaData = {
            titulo: tituloPuesto,
            descripcion: descripcionPuesto,
            etiquetas: etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        };
        try {
            const convocatoriaCreada = await fakeApi.crearConvocatoria(nuevaConvocatoriaData);
            setSuccessMessage(`Convocatoria "${convocatoriaCreada.titulo}" creada con éxito (ID: ${convocatoriaCreada.id}).`);
            // Limpiar formulario
            setTituloPuesto('');
            setDescripcionPuesto('');
            setEtiquetas('');
        } catch (error) {
            setFormError(error.message || "Error al crear la convocatoria.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Usa la clase .section como contenedor principal de la página
        <section className={styles.section}>
            <h2>🚀 Iniciar Nueva Búsqueda</h2>
            {/* Usa las clases del formulario definidas en el CSS */}
            <form onSubmit={handleCrearConvocatoria} className={styles.formConvocatoria}>
                {/* Usa las clases de error/éxito definidas */}
                {formError && <p className={styles.errorMessage}>{formError}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                {/* Usa la clase de grupo de formulario */}
                <div className={styles.formGroup}>
                    <label htmlFor="tituloPuesto">Título del Puesto *</label>
                    <input type="text" id="tituloPuesto" value={tituloPuesto} onChange={(e) => setTituloPuesto(e.target.value)} disabled={isSubmitting} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="descripcionPuesto">Descripción Breve</label>
                    <textarea id="descripcionPuesto" value={descripcionPuesto} onChange={(e) => setDescripcionPuesto(e.target.value)} rows="3" disabled={isSubmitting} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="etiquetas">Etiquetas / Palabras Clave (separadas por coma) *</label>
                    <input type="text" id="etiquetas" placeholder="Ej: Python, React, Inglés Avanzado" value={etiquetas} onChange={(e) => setEtiquetas(e.target.value)} disabled={isSubmitting} required />
                </div>
                {/* Usa la clase del botón */}
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Convocatoria'}
                </button>
            </form>
        </section>
    );
}