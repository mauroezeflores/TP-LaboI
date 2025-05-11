const empleados = [
  {
    id_empleado: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: " juan@gmail.com",
    nivel_educativo: "Secundario",
    telefono: "123456789",
    fecha_de_ingreso: "2022-01-01",},
    {
    id_empleado: 2,
    nombre: "María",
    apellido: "Gómez",
    email: "mariag@gmail.com",
    nivel_educativo: "Terciario",
    telefono: "987654321",
    fecha_de_ingreso: "2021-05-15",
    },
    {
    id_empleado: 3,
    nombre: "Pedro",
    apellido: "López",
    email: "PedroLpz@gmail.com",
    nivel_educativo: "Secundario",
    telefono: "456789123",
    fecha_de_ingreso: "2020-03-10",
    }
]

const getEmpleados = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(empleados);
    }, 1000); // Simula un retraso de 1 segundo
  });
}

export default getEmpleados;