import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Importa Link aquí
import styles from '../Autenticacion.module.css';

export default function Login() {
  const { tipoUsuario } = useParams(); // 'candidato' o 'reclutador'
  const navigate = useNavigate(); // Para redirigir después de hacer login

  // Elegimos la clase de acento correcta
  const accentClass =
    tipoUsuario === 'candidato'
      ? styles.accentCandidate
      : styles.accentRecruiter;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, completá todos los campos.');
      return;
    }

    const usuarios = {
      'reclutador@gmail.com': {
        rol: 'reclutador',
        path: '/dashboard/reclutador',
      },
      'gerente@gmail.com': {
        rol: 'gerente',
        path: '/dashboard/gerente',
      },
      'admin@gmail.com': {
        rol: 'admin',
        path: '/dashboard/admin',
      },
      'empleado@gmail.com': {
        rol: 'empleado',
        path: '/dashboard/empleado',
      },
      'candidato@gmail.com': {
        rol: 'candidato',
        path: '/dashboard/candidato',
      },
    };

    const usuario = usuarios[email];

    if (!usuario) {
      setError('Correo no registrado.');
      return;
    }

    // Navegar a la ruta correspondiente
    navigate(usuario.path);
  };

  return (
    <div className={`${styles.authContainer} ${accentClass}`}>
      <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
        <h2 className={styles.formTitle}>Inicio de Sesión</h2>

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
          <span className={styles.buttonText}>Iniciar Sesión</span>
        </button>

        {/* Links con sus contenedores */}
        <div className={styles.linkContainer}>
          <Link to={`/${tipoUsuario}/recuperar-contraseña`}>
            Olvidaste tu contraseña?
          </Link>
        </div>
        <div className={styles.linkContainer}>
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
