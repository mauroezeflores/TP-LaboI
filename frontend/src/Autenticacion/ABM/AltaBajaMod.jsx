import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField } from "@mui/material";
import styles from "./AltaBajaMod.module.css"; // Archivo CSS para estilos personalizados

const AltaBajaMod = () => {
  const [empleados, setEmpleados] = useState([
    { id: 1, nombre: "Juan", apellido: "Pérez", email: "juan.perez@example.com", telefono: "123456789" },
    { id: 2, nombre: "María", apellido: "Gómez", email: "maria.gomez@example.com", telefono: "987654321" },
  ]);

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
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell>{empleado.nombre}</TableCell>
                  <TableCell>{empleado.apellido}</TableCell>
                  <TableCell>{empleado.email}</TableCell>
                  <TableCell>{empleado.telefono}</TableCell>
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