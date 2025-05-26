const USUARIO_KEY = 'usuario';

export function loginUsuario(data) {
  localStorage.setItem(USUARIO_KEY, JSON.stringify(data));
}

export function logoutUsuario() {
  localStorage.removeItem(USUARIO_KEY);
}

export function getUsuarioActual() {
  const usuario = localStorage.getItem(USUARIO_KEY);
  return usuario ? JSON.parse(usuario) : null;
}

export function getRolUsuario() {
  const usuario = getUsuarioActual();
  return usuario?.rol?.toLowerCase() || null;
}