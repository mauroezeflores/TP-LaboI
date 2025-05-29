import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styles from './DashboardReclutador.module.css';
import LogoutButton from '../components/LogoutButton';
import {getUsuarioActual} from '../services/authService';

export default function DashboardReclutadorLayout() {
   const usuario = getUsuarioActual();

  return (
   
    <div className={styles.dashboardLayout}>
      {/* --- Sidebar / Menú Lateral --- */}
      
      <aside className={styles.sidebar}>
         
<div className={styles.sidebarHeader}>
   <h3 className={styles.sidebarTitle}>SIGRH+</h3>
   <span className={styles.sidebarSubtitle}>Panel EmpleadoRRHH</span><br />
   {usuario && (
     <span className={styles.sidebarWelcome}>
       Bienvenido {usuario.email}
     </span>
   )}
</div>
        <nav className={styles.sidebarNav}>

           {/* Link al Inicio del Dashboard */}
           <NavLink
             to="/dashboard/empleadoRRHH" 
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
                   <span className={styles.navTitle}>Desempeño de Empleados</span>
                   <span className={styles.navDescription}>Ver desempeño</span>
                </div>
             </div>
          </NavLink>

          <NavLink
            to="gestion-licencias"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
               <div className={styles.navItemContent}>
                  <div className={styles.navTextContainer}>
                     <span className={styles.navTitle}>Gestión Licencias</span>
                     <span className={styles.navDescription}>Ver licencias</span>
                  </div>
               </div>
            </NavLink>
            
             
          <NavLink
            to="abm-empleados"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
             <div className={styles.navItemContent}>
                <div className={styles.navTextContainer}>
                   <span className={styles.navTitle}>ABM empleados</span>
                   <span className={styles.navDescription}>Ver Empleados</span>
                </div>
             </div>
          </NavLink>
          

        </nav>


        {/* Botón/Link de Cerrar Sesión (Ejemplo) */}

         <div className={styles.sidebarFooter}>
          <LogoutButton />
        </div>



      </aside>

      {/* --- Área de Contenido Principal --- */}
      <main className={styles.contentArea}>
         <Outlet />
      </main>
    </div>
  );
}