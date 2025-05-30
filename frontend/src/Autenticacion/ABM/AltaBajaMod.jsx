import React, { useState, useEffect, } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField } from "@mui/material";
import styles from "./AltaBajaMod.module.css"; // Archivo CSS para estilos personalizados

const AltaBajaMod = () => {
  const [empleados, setEmpleados] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);

  const getEmpleados = async () => {
  const response = await fetch("http://localhost:8000/empleados");
  if (!response.ok) {
    throw new Error("Error al obtener empleados");
  }
  const empleados = await response.json();
  return empleados;
};
  useEffect(() => {
    const fetchEmpleados = async () => {
      setIsLoading(true);
      try {
        const data = await getEmpleados(); // Llama a la función mock para obtener empleados
        setEmpleados(data); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error("Error al obtener empleados:", error.message);
        setError(error.message); // Set the error state
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpleados(); 
  }, []);


  // Renderizado condicional basado en los estados
  if (isLoading) {
    return <div>Cargando empleados...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>Alta, Baja y Modificación de Empleados</h1>

        {/* Formulario de Alta/Modificación */}
        <Paper className={styles.formContainer}>
          <h2>Formulario de Empleado</h2>
          <form className={styles.form}>
            <TextField label="Nombre" variant="outlined" fullWidth margin="normal" />
            <TextField label="Apellido" variant="outlined" fullWidth margin="normal" />
            <TextField label="Email" variant="outlined" fullWidth margin="normal" />
            <TextField label="Teléfono" variant="outlined" fullWidth margin="normal" />
            <TextField label="Puesto de trabajo" variant="outlined" fullWidth margin="normal" />
            <TextField label="Jordana laboral" variant="outlined" fullWidth margin="normal" />
            <div className={styles.formActions}>
              <Button variant="contained" color="primary">
                Guardar
              </Button>
              <Button variant="outlined" color="secondary">
                Cancelar
              </Button>
            </div>
          </form>
        </Paper>

        {/* Tabla de Empleados */}
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Puesto de Trabajo</TableCell>
                <TableCell>Jornada Laboral</TableCell>
                <TableCell>Acciones</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((empleado) => (
                <TableRow key={empleado.id_empleado}>
                  <TableCell>{empleado.nombre}</TableCell>
                  <TableCell>{empleado.apellido}</TableCell>
                  <TableCell>{empleado.email_personal}</TableCell>
                  <TableCell>{empleado.telefono}</TableCell>
                  <TableCell>{empleado.id_jornada}</TableCell>
                  <TableCell>{empleado.id_jornada}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" size="small" style={{ marginRight: "10px" }}>
                      Editar
                    </Button>
                    <Button variant="contained" color="secondary" size="small">
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AltaBajaMod;