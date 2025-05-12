import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Autenticacion.module.css';

export default function RegistroCandidato() {
  const accentClass = styles.accentCandidate;

  // Estados para todos los campos
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [cv, setCv] = useState(null); // Estado para el archivo CV
  const [error, setError] = useState('');

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
       setCv(file);
       setError('');
    } else {
       setCv(null);
       setError('Por favor, sube un archivo PDF o Word.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !email || !password || !telefono || !ubicacion || !cv) {
      setError('Por favor, completa todos los campos y sube tu CV.');
      return;
    }
     if (cv && !(cv.type === "application/pdf" || cv.type === "application/msword" || cv.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setError('El formato del CV debe ser PDF o Word.');
      return;
    }

    setError('');
    console.log('Registrando candidato:', { nombre, apellido, email, telefono, ubicacion, cv: cv.name });

    /*Lógica de envío a backend (ejemplo con FormData)
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('telefono', telefono);
    formData.append('ubicacion', ubicacion);
    formData.append('cv', cv);

    fetch('/api/registro/candidato', { method: 'POST', body: formData })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => { console.error('Error:', error); setError('Error al registrar. Intenta de nuevo.'); });
  };*/
};

  return (
    <div className={`${styles.authContainer} ${accentClass}`}>
      <form onSubmit={handleSubmit} className={styles.authForm} >
        <h2 className={styles.formTitle}>Registro de Candidato</h2>

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

        {/* Email */}
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
            <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>

        {/* Teléfono */}
        <div className={styles.inputGroup}>
          <label htmlFor="telefono">Teléfono</label>
          <div className={styles.inputWrapper}>
            <input id="telefono" type="tel" placeholder="Tu número de teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>
        </div>

        {/* Ubicación */}
        <div className={styles.inputGroup}>
          <label htmlFor="ubicacion">Ubicación</label>
          <div className={styles.inputWrapper}>
            <input id="ubicacion" type="text" placeholder="Ciudad, Provincia/País" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
          </div>
        </div>

         {/* Campo para subir CV */}
         <div className={styles.inputGroup}>
            <label htmlFor="cv">Adjuntar CV (PDF o Word)</label>
            <div className={styles.inputWrapper}>
               <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleCvChange}
                  required
               />
            </div>
            {cv && <span style={{fontSize: '0.8rem', marginLeft: '5px', color: '#555'}}>Archivo: {cv.name}</span>}
         </div>

        <button type="submit" className={styles.submitButton}>
          Registrarme
        </button>

        <div className={styles.linkContainer}>
          <Link to="/login/candidato">¿Ya tienes cuenta? Inicia Sesión</Link>
        </div>
        <div className={styles.linkContainer}>
          <Link to="/">← Volver al Inicio</Link>
        </div>
      </form>
    </div>
  );
}