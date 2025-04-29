import React from 'react';
import MostrarDatos from '../../Autenticacion/MostrarDatos/MostrarDatos';
import styles from '../DashboardReclutador.module.css';

export default function GestionEmpleados() {
    return (
        // Usa la clase .section como contenedor principal
        <section className={styles.section}>
            <h2>📊 Desempeño de Empleados</h2>
             {/* Renderiza el componente importado */}
            <MostrarDatos />
        </section>
    );
}