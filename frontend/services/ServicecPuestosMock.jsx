const puestosMock = [
  { id: 1, nombre: 'Gerente de Ventas', descripcion: 'Responsable de liderar el equipo de ventas y alcanzar los objetivos comerciales.' },
  { id: 2, nombre: 'Analista de Marketing', descripcion: 'Encargado de analizar el mercado y desarrollar estrategias de marketing.' },
  { id: 3, nombre: 'Desarrollador Frontend', descripcion: 'Responsable del desarrollo de la interfaz de usuario de aplicaciones web.' },
  { id: 4, nombre: 'Desarrollador Backend', descripcion: 'Encargado del desarrollo del lado del servidor y la lógica de negocio.' },
  { id: 5, nombre: 'Diseñador Gráfico', descripcion: 'Responsable de crear elementos visuales para campañas y productos.' },
    { id: 6, nombre: 'Gerente de Recursos Humanos', descripcion: 'Encargado de gestionar el talento humano y las relaciones laborales.' },
    { id: 7, nombre: 'Analista Financiero', descripcion: 'Responsable de analizar la situación financiera de la empresa y hacer recomendaciones.' },
    { id: 8, nombre: 'Asistente Administrativo', descripcion: 'Encargado de tareas administrativas y apoyo a diferentes departamentos.' },
    { id: 9, nombre: 'Gerente de Proyectos', descripcion: 'Responsable de planificar y ejecutar proyectos dentro del presupuesto y plazo.' },
    { id: 10, nombre: 'Especialista en SEO', descripcion: 'Encargado de optimizar el contenido web para mejorar su posicionamiento en buscadores.' }
]; 
const getPuestos = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(puestosMock);
    }, 1000); // Simula un retraso de 1 segundo
  });
}
export default getPuestos;
// Este archivo simula la obtención de datos de puestos desde un servicio externo.