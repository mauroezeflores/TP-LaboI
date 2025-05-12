import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styles from './DashboardGerente.module.css'; // creás un nuevo CSS con los mismos estilos

export default function DashboardGerenteLayout() {
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    // lógica de logout si querés agregar algo
  };

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
           <h3 className={styles.sidebarTitle}>SIGRH+</h3>
           <span className={styles.sidebarSubtitle}>Panel Gerente</span>
        </div>
        <nav className={styles.sidebarNav}>
          {/* Cambiá los enlaces según lo que vea el gerente */}
          <NavLink
            to="/dashboard/gerente"
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

          <NavLink
            to="registro-candidato"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            <div className={styles.navItemContent}>
              <div className={styles.navTextContainer}>
                <span className={styles.navTitle}>Registro Candidatos</span>
                <span className={styles.navDescription}>formulario de registro</span>
              </div>
            </div>
          </NavLink>
          <NavLink
            to="config"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            <div className={styles.navItemContent}>
              <div className={styles.navTextContainer}>
                <span className={styles.navTitle}>Configuraciones</span>
                <span className={styles.navDescription}>configurar parametros</span>
              </div>
            </div>
          </NavLink>
           <NavLink
            to="riesgos-empleados"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            <div className={styles.navItemContent}>
              <div className={styles.navTextContainer}>
                <span className={styles.navTitle}>Pantalla de Riesgos</span>
                <span className={styles.navDescription}>Riesgo de desercion por empleado</span>
              </div>
            </div>
          </NavLink>
          {/* Agregás las secciones que correspondan al gerente */}
        </nav>

        <NavLink to="/" className={styles.navLink}>
          <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </NavLink>
      </aside>

      <main className={styles.contentArea}>
        <Outlet />
      </main>
    </div>
  );
}
