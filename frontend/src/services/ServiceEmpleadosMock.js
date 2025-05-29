const API_URL = "http://localhost:8000/empleados/detalle";

const getEmpleados = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener empleados");
  }
  const empleados = await response.json();
  return empleados;
};

export const getEmpleadosDetalle = async () => {
  const res = await fetch("http://localhost:8000/empleados/detalle");
  return await res.json();
};

export const getEmpleadoById = async (idEmpleado) => {
    const response = await fetch(`http://localhost:8000/empleado/${idEmpleado}`);
    if (!response.ok) {
        throw new Error('Error al obtener el empleado');
    }
    return await response.json();
};

export const registrarEmpleado = async (empleadoData) => {
    const response = await fetch(`http://localhost:8000/empleado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar el empleado');
    }
    return await response.json();
}

export const actualizarEmpleado = async (idEmpleado, empleadoData) => {
    const response = await fetch(`http://localhost:8000/empleado/${idEmpleado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar el empleado');
    }
    return await response.json();
};

export const toggleActivoEmpleado = async (idEmpleado, activo) => {
    const response = await fetch(`http://localhost:8000/empleado/${idEmpleado}/estado?activo=${activo}`, { // Pass 'activo' as query param
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // No body needed if 'activo' is in query param
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al cambiar el estado del empleado');
    }
    return await response.json();
};

export const getPuestos = async () => {
    const response = await fetch(`http://localhost:8000/puestos`); 
    if (!response.ok) throw new Error('Error al obtener puestos');
    return await response.json();
}


export const ServiceEmpleadosMock = {

  getEmpleados,
  actualizarEmpleado,
  getEmpleadosDetalle,
  getEmpleadoById,
  registrarEmpleado,
  toggleActivoEmpleado,
  getPuestos
};


export default getEmpleados; 