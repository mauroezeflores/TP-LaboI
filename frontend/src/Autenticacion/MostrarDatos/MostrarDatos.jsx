import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from "@mui/material";
import supabase from "../../services/SupaBaseService"; // Importa la conexión a Supabase
import styles from "./MostrarDatos.module.css"; // Archivo CSS para estilos personalizados

const MostrarDatos = () => {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar los empleados
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga

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

  // Función para calcular un desempeño usando el backend local
  const calcularDesempeno = (id_empleado) => {
    fetch(`http://127.0.0.1:8000/predecir/${id_empleado}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.prediccion !== undefined) {
          // Si la predicción es válida, actualizar el estado
          setEmpleados((prevEmpleados) =>
            prevEmpleados.map((empleado) =>
              empleado.id_empleado === id_empleado
                ? { ...empleado, desempeño: data.prediccion } // Usamos la predicción del backend
                : empleado
            )
          );
        } else {
          console.error('Error en la predicción:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error al hacer la solicitud al backend:', error);
      });
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
                        {empleado.desempeño !== null ? `${empleado.desempeño}%` : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => calcularDesempeno(empleado.id_empleado)} // Pasar el id_empleado
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