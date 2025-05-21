

export const getEmpleadosRiesgo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(empleados);
    }, 1000); // Simula un retraso de 1 segundo
  });
}
// Trae empleados sin riesgo
export const getEmpleadosDetalle = async () => {
  const res = await fetch("http://localhost:8000/empleados/detalle");
  return await res.json();
};

// Calcula el riesgo de un empleado
export const predecirRiesgoEmpleado = async (idEmpleado) => {
  const res = await fetch(`http://localhost:8000/predecir/rotacion/${idEmpleado}`);
  return await res.json();
};