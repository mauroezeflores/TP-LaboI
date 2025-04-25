import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from "@mui/material";

import styles from "./MostrarDatos.module.css"; // Archivo CSS para estilos personalizados

const MostrarDatos = () => {
  // Datos ficticios de empleados
  const [empleados, setEmpleados] = useState([
    { id: 1, nombre: "Juan", apellido: "Pérez", legajo: "1234", dni: "12345678", cargo: "Analista", desempeño: null },
    { id: 2, nombre: "María", apellido: "Gómez", legajo: "5678", dni: "87654321", cargo: "Desarrolladora", desempeño: null },
    { id: 3, nombre: "Carlos", apellido: "López", legajo: "9101", dni: "11223344", cargo: "Gerente", desempeño: null },
  ]);

  // Función para calcular un desempeño ficticio
  const calcularDesempeno = (id) => {
    setEmpleados((prevEmpleados) =>
      prevEmpleados.map((empleado) =>
        empleado.id === id
          ? { ...empleado, desempeño: Math.floor(Math.random() * 101) } // Número aleatorio entre 0 y 100
          : empleado
      )
    );
  };

  // Función para determinar el color del desempeño
  const getColorDesempeno = (desempeno) => {
    if (desempeno < 30) return styles.red;
    if (desempeno >= 30 && desempeno < 70) return styles.orange;
    if (desempeno >= 70) return styles.green;
    return styles.default;
  };

  return (
    <div className={styles.pageContainer}>

      <div className={styles.content}>
        <h1 className={styles.title}>Lista de Empleados</h1>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Legajo</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Desempeño</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell>{empleado.nombre}</TableCell>
                  <TableCell>{empleado.apellido}</TableCell>
                  <TableCell>{empleado.legajo}</TableCell>
                  <TableCell>{empleado.dni}</TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell>
                    <div className={`${styles.desempenoBox} ${getColorDesempeno(empleado.desempeño)}`}>
                      {empleado.desempeño !== null ? `${empleado.desempeño}%` : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => calcularDesempeno(empleado.id)}
                    >
                      Calcular Desempeño
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>    </div>
  );
};

export default MostrarDatos;