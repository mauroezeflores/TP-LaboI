import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../Autenticacion.module.css';

export default function Login() {
  const { tipoUsuario } = useParams(); // 'candidato' o 'reclutador'
  const title = tipoUsuario[0].toUpperCase() + tipoUsuario.slice(1);

  // Elegimos la clase de acento correcta
  const accentClass =
    tipoUsuario === 'candidato'
      ? styles.accentCandidate
      : styles.accentRecruiter;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completá todos los campos.');
    } else {
      setError('');
      // Lógica de autenticación...
      console.log('Iniciando sesión:', { email, tipoUsuario });
    }
  };

  return (
    <div className={`${styles.authContainer} ${accentClass}`}>
      <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
        <h2 className={styles.formTitle}>Inicio de Sesión - {title}</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Correo electrónico */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Correo electrónico</label>
          <div className={styles.inputWrapper}>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        

        {/* Contraseña */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <div className={styles.inputWrapper}>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Botón con su clase */}
        <button type="submit" className={styles.submitButton}>
          <Link to={`/dashboard/${tipoUsuario}`}>
            <span className={styles.buttonText}>Iniciar Sesión</span>
          </Link>
        </button>

        {/* Links con sus contenedores */}
        <div className={styles.linkContainer}>
          <Link to={`/${tipoUsuario}/recuperar-contraseña`}>
            Olvidaste tu contraseña?
          </Link>
        </div>
        <div className={styles.linkContainer}>
          {/* Asegúrate que el tipoUsuario sea 'candidato' o 'reclutador' */}
          <Link to={`/registro-${tipoUsuario}`}>
            No tenés cuenta? Registrate
          </Link>
        </div>
        <div className={styles.linkContainer}>
          <Link to="/">← Volver al Inicio</Link>
        </div>
      </form>
    </div>
  );
}