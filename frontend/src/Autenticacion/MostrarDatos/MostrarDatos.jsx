import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import supabase from "../../services/SupaBaseService"; // Importa la conexión a Supabase
import styles from "./MostrarDatos.module.css"; // Archivo CSS para estilos personalizados
import getEmpleados from "../../services/ServiceEmpleadosMock";
import  {obtenerHistoriaDesempeno, agregarDesempeno} from "../../services/DesempenoServiceMock"; // Importa la función mock para obtener la historia de desempeño
import GraficoDesempeno from "./GraficoDesempeno";

const MostrarDatos = () => {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar los empleados
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga general
  const [loadingEmpleado, setLoadingEmpleado] = useState(null); // Estado para manejar el cálculo de desempeño por empleado

  // Función para obtener los datos de empleados desde Supabase
  // const fetchEmpleados = async () => {
  //   setLoading(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from("empleado") // Nombre de la tabla en Supabase
  //       .select("id_empleado, nombre, apellido, email, nivel_educativo, telefono, fecha_de_ingreso"); // Selecciona las columnas necesarias
  //     if (error) throw error; // Manejo de errores
  //     setEmpleados(data); // Actualiza el estado con los datos obtenidos
  //   } catch (error) {
  //     console.error("Error al obtener empleados:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const [historiaActual, setHistoriaActual] = useState([]);
const [modalAbierto, setModalAbierto] = useState(false);

const handleVerHistoria = async (idEmpleado) => {
  const historia = await obtenerHistoriaDesempeno(idEmpleado);
  setHistoriaActual(historia);
  setModalAbierto(true);
};


  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const data = await getEmpleados(); // Llama a la función mock para obtener empleados
      setEmpleados(data); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener empleados:", error.message);
    } finally {
      setLoading(false);
    }
  };


  const manejarCalculoDesempeno = (id_empleado) => {
  setLoadingEmpleado(id_empleado);

  setTimeout(() => {
    const nuevoDesempeno = Math.floor(Math.random() * 101); // del 0 al 100

    // 1. Actualizás el estado
    setEmpleados((prevEmpleados) =>
      prevEmpleados.map((empleado) =>
        empleado.id_empleado === id_empleado
          ? { ...empleado, desempeño: nuevoDesempeno }
          : empleado
      )
    );

    // 2. Agregás el nuevo desempeño al historial
    agregarDesempeno(id_empleado, nuevoDesempeno)
      .then(() => {
        console.log("Desempeño agregado al historial");
      })
      .catch((err) => {
        console.error("Error al agregar desempeño:", err);
      });

    setLoadingEmpleado(null);
  }, 1500);
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
        {empleados.length > 0 &&
          Object.keys(empleados[0]).map((key) => (
            key !== "id_empleado" && key !== "desempeño" && (
              <TableCell key={key}>
                {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </TableCell>
            )
          ))}
        <TableCell>Desempeño</TableCell>
        <TableCell>Acciones</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {empleados.map((empleado) => (
        <TableRow key={empleado.id_empleado}>
          {Object.entries(empleado).map(([key, value]) =>
            key !== "id_empleado" && key !== "desempeño" ? (
              <TableCell key={key}>{value}</TableCell>
            ) : null
          )}
          <TableCell>
            <div
              className={`${styles.desempenoBox} ${getColorDesempeno(empleado.desempeño)}`}
            >
              {loadingEmpleado === empleado.id_empleado ? (
                <CircularProgress size={20} />
              ) : empleado.desempeño !== null && empleado.desempeño !== undefined ? (
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
              onClick={() => manejarCalculoDesempeno(empleado.id_empleado)}
              
              disabled={loadingEmpleado === empleado.id_empleado}
            >
              Calcular Desempeño
            </Button>
          </TableCell>
          <TableCell>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleVerHistoria(empleado.id_empleado)}
            >
              Ver Historia
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>



        )}
      </div>

      {modalAbierto && (
  <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} fullWidth maxWidth="sm">
    <DialogTitle>Historial de Desempeño</DialogTitle>
    <DialogContent>
        <GraficoDesempeno data={historiaActual} />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setModalAbierto(false)}>Cerrar</Button>
    </DialogActions>
  </Dialog>
)}
    </div>
  );
};

export default MostrarDatos;