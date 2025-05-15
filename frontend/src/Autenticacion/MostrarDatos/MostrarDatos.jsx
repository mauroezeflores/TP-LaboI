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


const [historiaActual, setHistoriaActual] = useState([]);
const [modalAbierto, setModalAbierto] = useState(false);

const handleVerHistoria = async (idEmpleado) => {
  const historia = await obtenerHistoriaDesempeno(idEmpleado);
  console.log("Historia de desempeño:", historia);
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

const manejarCalculoDesempeno = async (id_empleado) => {
  setLoadingEmpleado(id_empleado);

  try {
    // Llama a tu backend para obtener la predicción real
    const response = await fetch(`http://localhost:8000/predecir/desempeno/${id_empleado}`);
    if (!response.ok) throw new Error("Error al obtener desempeño");
    const data = await response.json();

    setEmpleados((prevEmpleados) =>
      prevEmpleados.map((empleado) =>
        empleado.id_empleado === id_empleado
          ? { ...empleado, desempeño: data.prediccion }
          : empleado
      )
    );

    // Opcional: agregar al historial si lo deseas
    agregarDesempeno(id_empleado, data.prediccion)
      .then(() => {
        console.log("Desempeño agregado al historial");
      })
      .catch((err) => {
        console.error("Error al agregar desempeño:", err);
      });

  } catch (error) {
    console.error(error);
  } finally {
    setLoadingEmpleado(null);
  }
};

  // Función para determinar el color del desempeño
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
                  Object.keys(empleados[0]).map((key) =>
                    key !== "id_empleado" && key !== "desempeño" && (
                      <TableCell key={`header-${key}`}>
                        {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </TableCell>
                    )
                  )}
                <TableCell key="header-desempeno">Desempeño</TableCell>
                <TableCell key="header-acciones">Acciones</TableCell>
              </TableRow>
            </TableHead>

              <TableBody>
  {empleados.map((empleado) => (
    <TableRow key={`row-${empleado.id_empleado}`}>
      {Object.entries(empleado).map(([key, value]) =>
        key !== "id_empleado" && key !== "desempeño" ? (
          <TableCell key={`cell-${empleado.id_empleado}-${key}`}>{value}</TableCell>
        ) : null
      )}
      <TableCell key={`cell-desempeno-${empleado.id_empleado}`}>
        <div className={`${styles.desempenoBox} ${getColorDesempeno(empleado.desempeño)}`}>
          {loadingEmpleado === empleado.id_empleado ? (
            <CircularProgress size={20} />
          ) : empleado.desempeño !== null && empleado.desempeño !== undefined ? (
            `${empleado.desempeño}%`
          ) : (
            "N/A"
          )}
        </div>
      </TableCell>
      <TableCell key={`cell-acciones-${empleado.id_empleado}`}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => manejarCalculoDesempeno(empleado.id_empleado)}
          disabled={loadingEmpleado === empleado.id_empleado}
        >
          Calcular Desempeño
        </Button>
      </TableCell>
      <TableCell key={`cell-historia-${empleado.id_empleado}`}>
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