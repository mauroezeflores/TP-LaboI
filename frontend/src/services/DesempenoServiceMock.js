// desempeNoService.js

let desempenosHistoricos = {
  1: [
    { fecha: "2024-01-15", porcentaje: 57 },
    { fecha: "2024-02-15", porcentaje: 65 },
    { fecha: "2024-03-15", porcentaje: 100 }, // posible anomalia
    { fecha: "2024-04-15", porcentaje: 67 },
    { fecha: "2024-05-15", porcentaje: 70 },
    { fecha: "2024-06-15", porcentaje: 75 },
    { fecha: "2024-07-15", porcentaje: 70 },
    { fecha: "2024-08-15", porcentaje: 74 },
    { fecha: "2024-09-15", porcentaje: 67 },
    { fecha: "2024-10-15", porcentaje: 65 },
    { fecha: "2024-11-15", porcentaje: 55 },
    { fecha: "2024-12-15", porcentaje: 50 }, // posible anomalia
  ],
  2: [
    { fecha: "2024-01-15", porcentaje: 60 },
    { fecha: "2024-03-15", porcentaje: 62 },
    { fecha: "2024-04-15", porcentaje: 65 },
    { fecha: "2024-05-15", porcentaje: 70 },
    { fecha: "2024-06-15", porcentaje: 75 },
    { fecha: "2024-07-15", porcentaje: 80 },
    { fecha: "2024-08-15", porcentaje: 85 },
    { fecha: "2024-09-15", porcentaje: 90 },
    { fecha: "2024-10-15", porcentaje: 95 },
    { fecha: "2024-11-15", porcentaje: 100 }, // posible anomalia
    { fecha: "2024-12-15", porcentaje: 100 }, // posible anomalia
  ],
  3: [
    { fecha: "2024-01-15", porcentaje: 80 },
    { fecha: "2024-02-15", porcentaje: 85 },
    { fecha: "2024-03-15", porcentaje: 90 },
    { fecha: "2024-04-15", porcentaje: 95 },
    { fecha: "2024-05-15", porcentaje: 91 }, // posible anomalia
    { fecha: "2024-06-15", porcentaje: 87 }, // posible anomalia
    { fecha: "2024-07-15", porcentaje: 95 },
    { fecha: "2024-08-15", porcentaje: 90 },
    { fecha: "2024-09-15", porcentaje: 85 },
    { fecha: "2024-10-15", porcentaje: 80 },
    { fecha: "2024-11-15", porcentaje: 75 },
    { fecha: "2024-12-15", porcentaje: 70 },
  ],
};

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

export const agregarDesempeno = (idEmpleado, porcentaje) => {
  const fecha = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
  if (!desempenosHistoricos[idEmpleado]) {
    desempenosHistoricos[idEmpleado] = [];
  }
  desempenosHistoricos[idEmpleado].push({ fecha, porcentaje });
  return Promise.resolve();
};
