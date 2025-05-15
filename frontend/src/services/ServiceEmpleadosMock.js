const API_URL = "http://localhost:8000/empleados/detalle";

const getEmpleados = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener empleados");
  }
  const empleados = await response.json();
  return empleados;
};

export default getEmpleados;