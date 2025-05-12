// desempeNoService.js

let desempenosHistoricos = {
  1: [
    { fecha: "2024-01-15", porcentaje: 70 },
    { fecha: "2024-02-15", porcentaje: 75 },
    { fecha: "2024-03-15", porcentaje: 100 }, // posible anomalia
  ],
  2: [
    { fecha: "2024-01-15", porcentaje: 60 },
    { fecha: "2024-03-15", porcentaje: 62 },
    { fecha: "2024-04-15", porcentaje: 65 },
  ],
  3: [
    { fecha: "2024-01-15", porcentaje: 80 },
    { fecha: "2024-02-15", porcentaje: 85 },
    { fecha: "2024-03-15", porcentaje: 90 },
  ],
};

export const obtenerHistoriaDesempeno = (idEmpleado) => {
  return Promise.resolve(desempenosHistoricos[idEmpleado] || []);
};

export const agregarDesempeno = (idEmpleado, porcentaje) => {
  const fecha = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
  if (!desempenosHistoricos[idEmpleado]) {
    desempenosHistoricos[idEmpleado] = [];
  }
  desempenosHistoricos[idEmpleado].push({ fecha, porcentaje });
  return Promise.resolve();
};
