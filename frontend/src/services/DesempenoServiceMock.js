
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

export const subirValoraciones = async (idEmpleado, valoracionJefe) => {
  try {
    const response = await fetch("http://localhost:8000/historial/evaluacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_empleado: idEmpleado,
        evaluacion_del_superior: valoracionJefe
      })
    });

    if (!response.ok) {
      throw new Error("Error al subir valoraciones");
    }

    const data = await response.json();
    console.log("Respuesta del backend:", data);
    return data;
  } catch (error) {
    console.error("Error al subir valoraciones:", error);
    throw error;
  }
};

export default obtenerHistoriaDesempeno;