import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, CircularProgress } from "@mui/material";
import supabase from "../../services/SupaBaseService"; // Importa la conexión a Supabase

const MostrarDatos = () => {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar los empleados
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga general
  const [loadingEmpleado, setLoadingEmpleado] = useState(null); // Estado para manejar el cálculo de desempeño por empleado

  // Función para obtener los datos de empleados desde Supabase
  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("empleado") // Nombre de la tabla en Supabase
        .select("id_empleado, nombre, apellido, email, nivel_educativo, telefono, fecha_de_ingreso"); // Selecciona las columnas necesarias
      if (error) throw error; // Manejo de errores
      setEmpleados(data); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener empleados:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular un desempeño ficticio con retraso
  const calcularDesempeno = (id_empleado) => {
    setLoadingEmpleado(id_empleado); // Establece el empleado en proceso de cálculo
    setTimeout(() => {
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((empleado) =>
          empleado.id_empleado === id_empleado
            ? { ...empleado, desempeño: Math.floor(Math.random() * 101) } // Número aleatorio entre 0 y 100
            : empleado
        )
      );
      setLoadingEmpleado(null); // Finaliza el estado de carga para este empleado
    }, 1500); // Retraso de 1.5 segundos
  };

  // Función para determinar el color del desempeño
  const getColorDesempeno = (desempeno) => {
    if (desempeno < 30) return styles.red;
    if (desempeno >= 30 && desempeno < 70) return styles.orange;
    if (desempeno >= 70) return styles.green;
    return styles.default;
  };

  // useEffect para cargar los datos al montar el componente
  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>Lista de Empleados</h1>
        {loading ? (
          <p>Cargando empleados...</p>
        ) : (
          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Mail</TableCell>
                  <TableCell>Nivel Educativo</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Fecha de Ingreso</TableCell>
                  <TableCell>Desempeño</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empleados.map((empleado) => (
                  <TableRow key={empleado.id_empleado}>
                    <TableCell>{empleado.nombre}</TableCell>
                    <TableCell>{empleado.apellido}</TableCell>
                    <TableCell>{empleado.email}</TableCell>
                    <TableCell>{empleado.nivel_educativo}</TableCell>
                    <TableCell>{empleado.telefono}</TableCell>
                    <TableCell>{empleado.fecha_de_ingreso}</TableCell>
                    <TableCell>
                      <div className={`${styles.desempenoBox} ${getColorDesempeno(empleado.desempeño)}`}>
                        {loadingEmpleado === empleado.id_empleado ? (
                          <CircularProgress size={20} /> // Indicador de carga
                        ) : empleado.desempeño !== null ? (
                          `${empleado.desempeño}%`
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => calcularDesempeno(empleado.id_empleado)} // Pasar el id_empleado
                        disabled={loadingEmpleado === empleado.id_empleado} // Deshabilitar mientras se calcula
                      >
                        Calcular Desempeño
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default MostrarDatos;