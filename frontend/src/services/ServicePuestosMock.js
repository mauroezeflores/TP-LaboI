const puestosMock = [
  { id: 1, nombre: 'Programador Senior', descripcion: 'Desaprofesional experimentado con amplia experiencia en el desarrollo de software',
    rendimientoMinimo: 45,
    rendimientoAceptable: 80,
  },
  { id: 2, nombre: 'Programador Junior', descripcion: 'Profesional de tecnología de nivel básico que trabaja en el desarrollo de software', 
    rendimientoMinimo: 20,
    rendimientoAceptable: 40,
  },
  { id: 3, nombre: 'Diseñador Grafico', descripcion: 'Responsable del desarrollo de imagenes y diseños de marketing.',
    rendimientoMinimo: 40,
    rendimientoAceptable: 70,
   },

]; 
const getPuestos = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(puestosMock);
    }, 1000); // Simula un retraso de 1 segundo
  });
}

export const getUnPuesto = (index) => {
  return puestosMock[index-1];
}

export const setRendimiento = (index, rendimientoMinimo, rendimientoAceptable) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      puestosMock[index].rendimientoMinimo = rendimientoMinimo;
      puestosMock[index].rendimientoAceptable = rendimientoAceptable;
      resolve(puestosMock[index]);
    }, 1000); // Simula un retraso de 1 segundo
  });
}

export default getPuestos;
// Este archivo simula la obtención de datos de puestos desde un servicio externo.