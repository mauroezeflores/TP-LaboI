import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css"; // Archivo CSS para los estilos del Navbar

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>H.R.Learning</div>
      <div className={styles.navButtons}>
        <Link to="/login/candidato" className={styles.navBtn}>
          {/* SVG icon */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
            />
          </svg>
          Iniciar sesion
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;