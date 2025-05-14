const API_URL = "http://localhost:8000/empleados/detalle";
const empleados = [
  {
    id_empleado: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: " juan@gmail.com",
    nivel_educativo: "Secundario",
    telefono: "123456789",
    fecha_de_ingreso: "2022-01-01",
    puesto:"Programador Junior",
},
    {
    id_empleado: 2,
    nombre: "María",
    apellido: "Gómez",
    email: "mariag@gmail.com",
    nivel_educativo: "Terciario",
    telefono: "987654321",
    fecha_de_ingreso: "2021-05-15",
    puesto:"Programador Senior",

    },
    {
    id_empleado: 3,
    nombre: "Pedro",
    apellido: "López",
    email: "PedroLpz@gmail.com",
    nivel_educativo: "Secundario",
    telefono: "456789123",
    fecha_de_ingreso: "2020-03-10",
    puesto:"Diseñador Grafico",

    }
]
const getEmpleados = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener empleados");
  }
  const empleados = await response.json();
  return empleados;
};

export default getEmpleados;