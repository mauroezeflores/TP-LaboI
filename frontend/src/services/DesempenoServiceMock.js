
export const obtenerHistoriaDesempeno = async (idEmpleado) => {
  const response = await fetch(`http://localhost:8000/historial/desempeno/${idEmpleado}`);
  if (!response.ok) {
    throw new Error("Error al obtener historial de desempeño");
  }
  const data = await response.json();
  // Si tu backend devuelve los campos como 'evaluacion_desempeno', puedes mapearlos así:
  return data.map(item => ({
    fecha: item.fecha_prediccion,
    porcentaje: item.prediccion
  }));
};

