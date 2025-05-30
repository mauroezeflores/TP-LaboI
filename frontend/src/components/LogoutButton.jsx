import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUsuario, getUsuarioActual } from '../services/authService';

function getLoginPathByRol(rol) {
return '/';
  
}

export default function LogoutButton({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    const usuario = getUsuarioActual();
    const loginPath = getLoginPathByRol(usuario?.rol);
    logoutUsuario();
    setTimeout(() => {
      navigate(loginPath);
    }, 1200); // 1.2 segundos de pantalla de carga
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '1em' }}>
        <span>Cerrando sesión...</span>
        {/* Aquí puedes poner un spinner animado si tienes uno */}
      </div>
    );
  }

  return (
    <button onClick={handleLogout}>
      {children || 'Cerrar sesión'}
    </button>
  );
}