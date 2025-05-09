import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, CircularProgress } from "@mui/material";
import supabase from "../../services/SupaBaseService"; // Importa la conexión a Supabase

const MostrarDatos = () => {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar los empleados
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga general
  const [loadingEmpleado, setLoadingEmpleado] = useState(null); // Estado para manejar el cálculo de desempeño por empleado

  // Función para obtener los datos de empleados desde Supabase
  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("empleado") // Nombre de la tabla en Supabase
        .select("id_empleado, nombre, apellido, email, nivel_educativo, telefono, fecha_de_ingreso"); // Selecciona las columnas necesarias
      if (error) throw error; // Manejo de errores
      setEmpleados(data); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener empleados:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular un desempeño ficticio con retraso
  const calcularDesempeno = (id_empleado) => {
    setLoadingEmpleado(id_empleado); // Establece el empleado en proceso de cálculo
    setTimeout(() => {
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((empleado) =>
          empleado.id_empleado === id_empleado
            ? { ...empleado, desempeño: Math.floor(Math.random() * 101) } // Número aleatorio entre 0 y 100
            : empleado
        )
      );
      setLoadingEmpleado(null); // Finaliza el estado de carga para este empleado
    }, 1500); // Retraso de 1.5 segundos
  };

  // Función para determinar el color del desempeño
  const getColorDesempeno = (desempeno) => {
    if (desempeno < 30) return styles.red;
    if (desempeno >= 30 && desempeno < 70) return styles.orange;
    if (desempeno >= 70) return styles.green;
    return styles.default;
  };

  // useEffect para cargar los datos al montar el componente
  useEffect(() => {
    fetchEmpleados();
  }, []);

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
             
            {/* Link ABM */}
          <NavLink
            to="AltaBajaMod"
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
};

export default MostrarDatos;