import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../DashboardReclutador.module.css';


const dashboardTools = [
  {
    title: "Crear Convocatoria",
    description: "Define los parámetros y publica una nueva búsqueda de talento.",
    link: "crear-convocatoria" // Ruta relativa a /dashboard/reclutador
  },
  {
    title: "Mis Convocatorias",
    description: "Visualiza y gestiona todas tus convocatorias activas y cerradas.",
    link: "mis-convocatorias"
  },
  {
    title: "Gestión Empleados",
    description: "Accede a la información y métricas de desempeño del personal.",
    link: "gestion-empleados"
  },
];

// --- COMPONENTE ---
export default function DashboardHome() {
  return (
    <div className={styles.dashboardHomeContainer}>
        {/* --- Encabezado de Bienvenida --- */}
      <header className={styles.welcomeHeader}>
        <h2>Bienvenido al Panel de RRHH</h2>
        <p>
          Desde aquí puedes acceder a las herramientas principales para gestionar
          empleados y el ciclo de reclutamiento.
        </p>
      </header>

      {/* --- Grilla de Herramientas --- */}
      <div className={styles.toolsGrid}>
        {dashboardTools.map((tool) => (
          <Link to={tool.link} key={tool.title} className={styles.toolCardLink}>
            {/* --- Tarjeta --- */}
            <div className={styles.toolCard}>
              {/* Icono con su wrapper y clase */}
              <div className={styles.toolIconWrapper}>
                {tool.icon}
              </div>
              {/* Título con su clase */}
              <h3 className={styles.toolTitle}>{tool.title}</h3>
              {/* Descripción con su clase */}
              <p className={styles.toolDescription}>{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>

    </div> 
  ); 
} 