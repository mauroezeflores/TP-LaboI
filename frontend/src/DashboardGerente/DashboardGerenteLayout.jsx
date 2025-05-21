import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styles from './DashboardGerente.module.css'; // creás un nuevo CSS con los mismos estilos

export default function DashboardGerenteLayout() {
  const handleLogout = () => {
     // Eliminar el rol del almacenamiento (localStorage o sessionStorage)
    localStorage.removeItem('rol'); // O sessionStorage.removeItem('rol') si lo usas

    // Redirigir al usuario al inicio ("/")
    navigate('/');
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
                <span className={styles.navTitle}>Deteccion de rotacion</span>
                <span className={styles.navDescription}>Prediccion de posible desercion</span>
              </div>
            </div>
          </NavLink>
                     <NavLink
            to="datos-desempeno"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            <div className={styles.navItemContent}>
              <div className={styles.navTextContainer}>
                <span className={styles.navTitle}>Desempeno predictivo</span>
                <span className={styles.navDescription}>Prediccion de desempeño por empleados</span>
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
