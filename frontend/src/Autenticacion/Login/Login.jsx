import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
  const { tipoUsuario } = useParams(); // 'candidato' o 'reclutador'
  const title = tipoUsuario[0].toUpperCase() + tipoUsuario.slice(1);

  // Elegimos una clase de acento distinta según el usuario
  const accentClass =
    tipoUsuario === 'candidato'
      ? styles.accentCandidate
      : styles.accentRecruiter;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí llamás tu API / lógica de autenticación
    if (!email || !password) {
      setError('Por favor, completá todos los campos.');
    } else {
      setError('');
      // submit...
    }
  };

  return (
    <div className={`${styles.loginContainer} ${accentClass}`}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.formTitle}>Inicio de Sesión - {title}</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Email */}
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

        <button type="submit" className={styles.submitButton}>
          Iniciar Sesión
        </button>

        <div className={styles.linkContainer}>
          <Link to="/">← Volver al Inicio</Link>
        </div>
      </form>
    </div>
  );
}
