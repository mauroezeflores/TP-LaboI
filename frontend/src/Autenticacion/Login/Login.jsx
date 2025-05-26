import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from '../Autenticacion.module.css';

const API_BASE_URL = 'http://localhost:8000';

export default function Login() {
  const { tipoUsuario } = useParams();
  const navigate = useNavigate();

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

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Usuario o contraseña incorrectos');
        return;
      }

      // Guarda los datos en localStorage
      localStorage.setItem('usuario', JSON.stringify(data));

      // Redirige según el rol
      switch (data.rol?.toLowerCase()) {
        case 'reclutador':
          navigate('/dashboard/empleadoRRHH');
          break;
        case 'administrador':
          navigate('/dashboard/admin');
          break;
        case 'empleado':
          navigate('/dashboard/empleado');
          break;
        case 'candidato':
          navigate('/dashboard/candidato');
          break;
        case 'gerente':
          navigate('/dashboard/gerente');
          break;
        default:
          setError('Rol no reconocido');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={accentClass}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className={styles.errorMsg}>{error}</div>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}