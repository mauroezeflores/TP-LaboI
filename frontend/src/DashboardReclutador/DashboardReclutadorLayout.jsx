import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styles from './DashboardReclutador.module.css';

export default function DashboardReclutadorLayout() {
  // Función para manejar el logout (ejemplo)
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    // Aca iría la lógica para limpiar tokens/estado y redirigir al login
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* --- Sidebar / Menú Lateral --- */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
           <h3 className={styles.sidebarTitle}>SIGRH+</h3>
           <span className={styles.sidebarSubtitle}>Panel Reclutador</span>
        </div>
        <nav className={styles.sidebarNav}>

           {/* Link al Inicio del Dashboard */}
           <NavLink
             to="/dashboard/reclutador" 
             end 
             className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
           >
             <div className={styles.navItemContent}>
                <div className={styles.navTextContainer}>
                   <span className={styles.navTitle}>Inicio</span>
                   <span className={styles.navDescription}>Vista general</span>
                </div>
             </div>
           </NavLink>

          {/* Link Crear Convocatoria */}
          <NavLink
            to="crear-convocatoria"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            <div className={styles.navItemContent}>
               <div className={styles.navTextContainer}>
                  <span className={styles.navTitle}>Crear Convocatoria</span>
                  <span className={styles.navDescription}>Publicar nueva búsqueda</span>
               </div>
            </div>
          </NavLink>

          {/* Link Mis Convocatorias */}
          <NavLink
            to="mis-convocatorias"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
             <div className={styles.navItemContent}>
                <div className={styles.navTextContainer}>
                   <span className={styles.navTitle}>Mis Convocatorias</span>
                   <span className={styles.navDescription}>Gestionar búsquedas</span>
                </div>
             </div>
          </NavLink>

          {/* Link Gestión Empleados */}
          <NavLink
            to="gestion-empleados"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
             <div className={styles.navItemContent}>
                <div className={styles.navTextContainer}>
                   <span className={styles.navTitle}>Gestión Empleados</span>
                   <span className={styles.navDescription}>Ver desempeño</span>
                </div>
             </div>
          </NavLink>

        </nav>

        {/* Botón/Link de Cerrar Sesión (Ejemplo) */}
        <NavLink to="/" className={styles.navLink}>
        <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.logoutButton}>
                <span>Cerrar Sesión</span>
            </button>
        </div>
        </NavLink>

      </aside>

      {/* --- Área de Contenido Principal --- */}
      <main className={styles.contentArea}>
         <Outlet />
      </main>
    </div>
  );
}