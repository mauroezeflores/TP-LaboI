import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Autenticacion.module.css';

export default function RegistroReclutador() {
  const accentClass = styles.accentRecruiter;

  // Estados para todos los campos
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [cargo, setCargo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !email || !password || !nombreEmpresa || !cargo) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setError('');
    console.log('Registrando reclutador:', { nombre, apellido, email, nombreEmpresa, cargo });

    /* Lógica de envío a backend...
    // fetch('/api/registro/reclutador', { method: 'POST', body: JSON.stringify({nombre, apellido, email, password, nombreEmpresa, cargo }), headers: {'Content-Type': 'application/json'} })
    //  .then(response => response.json())
    //  .then(data => console.log(data))
    //  .catch(error => { console.error('Error:', error); setError('Error al registrar. Intenta de nuevo.'); });
 */ 
};

  return (
    // Aplica clases de contenedor y acento
    <div className={`${styles.authContainer} ${accentClass}`}>
      {/* Aplica clase de formulario */}
      <form onSubmit={handleSubmit} className={styles.authForm} >
        {/* Aplica clase de título */}
        <h2 className={styles.formTitle}>Registro de Reclutador</h2>

        {/* Aplica clase de mensaje de error */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Nombre */}
        <div className={styles.inputGroup}>
          <label htmlFor="nombre">Nombre</label>
          <div className={styles.inputWrapper}>
            <input id="nombre" type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
        </div>

        {/* Apellido */}
        <div className={styles.inputGroup}>
          <label htmlFor="apellido">Apellido</label>
          <div className={styles.inputWrapper}>
            <input id="apellido" type="text" placeholder="Tu apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
          </div>
        </div>

        {/* Email Corporativo */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Correo Electrónico</label>
          <div className={styles.inputWrapper}>
            <input id="email" type="email" placeholder="ejemplo@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        {/* Contraseña */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <div className={styles.inputWrapper}>
            <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>

        {/* Nombre de la Empresa */}
        <div className={styles.inputGroup}>
          <label htmlFor="empresa">Nombre de la Empresa</label>
          <div className={styles.inputWrapper}>
            <input id="empresa" type="text" placeholder="Nombre de tu empresa" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} required />
          </div>
        </div>

        {/* Cargo / Rol */}
        <div className={styles.inputGroup}>
          <label htmlFor="cargo">Cargo / Rol</label>
          <div className={styles.inputWrapper}>
            <input id="cargo" type="text" placeholder="Ej: Gerente de RRHH" value={cargo} onChange={(e) => setCargo(e.target.value)} required />
          </div>
        </div>

        {/* Aplica clase de botón */}
        <button type="submit" className={styles.submitButton}>
          Registrarme
        </button>

        {/* Aplica clase a contenedores de links */}
        <div className={styles.linkContainer}>
          <Link to="/login/reclutador">¿Ya tienes cuenta? Inicia Sesión</Link>
        </div>
        <div className={styles.linkContainer}>
          <Link to="/">← Volver al Inicio</Link>
        </div>
      </form>
    </div>
  );
}