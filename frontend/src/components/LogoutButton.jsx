import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUsuario, getUsuarioActual } from '../services/authService';

function getLoginPathByRol(rol) {
  switch ((rol || '').toLowerCase()) {
    case 'candidato':
      return '/login/candidato';
    case 'empleado':
      return '/login/empleado';
    case 'reclutador':
      return '/login/reclutador';
    case 'administrador':
      return '/login/admin';
    case 'gerente':
      return '/login/gerente';
    default:
      return '/login';
  }
}

export default function LogoutButton({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const usuario = getUsuarioActual();
    const loginPath = getLoginPathByRol(usuario?.rol);
    logoutUsuario();
    navigate(loginPath);
  };

  return (
    <button onClick={handleLogout}>
      {children || 'Cerrar sesión'}
    </button>
  );
}