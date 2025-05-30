import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from "@mui/material";
import styles from "./PantallaRiesgos.module.css";
import { getEmpleadosDetalle, predecirRiesgoEmpleado } from "../services/RiesgosEmpleadosMock";
import { getDetalleRotacionEmpleado } from "../services/RiesgosEmpleadosMock";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function PantallaDeRiesgosEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculando, setCalculando] = useState({});
  const [orden, setOrden] = useState("desc");
  const [detalle, setDetalle] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleMostrarDetalles = async (id_empleado) => {
        const data = await getDetalleRotacionEmpleado(id_empleado);
        setDetalle(data);
        setModalAbierto(true);
};

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const data = await getEmpleadosDetalle();
        setEmpleados(data);
      } catch (error) {
        console.error("Error al obtener empleados:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmpleados();
  }, []);

  const getColorDesempeno = (riesgo) => {
    if (riesgo < 30) return styles.green;
    if (riesgo >= 30 && riesgo < 70) return styles.orange;
    if (riesgo >= 70) return styles.red;
    return styles.default;
  };

  const handleCalcularRiesgo = async (id_empleado) => {
    setCalculando((prev) => ({ ...prev, [id_empleado]: true }));
    try {
      const resultado = await predecirRiesgoEmpleado(id_empleado);
      setEmpleados((prev) =>
        prev.map((emp) =>
          emp.id_empleado === id_empleado
            ? { ...emp, riesgo: resultado.probabilidad ? Math.round(resultado.probabilidad * 100) : 0 }
            : emp
        )
      );
    } catch (error) {
      console.error("Error al predecir riesgo:", error.message);
    } finally {
      setCalculando((prev) => ({ ...prev, [id_empleado]: false }));
    }
  };

  const calcularTodos = async () => {
    for (let emp of empleados) {
      await handleCalcularRiesgo(emp.id_empleado);
    }
  };

  const empleadosOrdenados = [...empleados].sort((a, b) => {
    if (orden === "desc") return (b.riesgo || 0) - (a.riesgo || 0);
    return (a.riesgo || 0) - (b.riesgo || 0);
  });

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Button variant="contained" color="secondary" onClick={calcularTodos}>
          Calcular Todos
        </Button>
        <label>
          Ordenar por riesgo:&nbsp;
          <select value={orden} onChange={e => setOrden(e.target.value)}>
            <option value="desc">Mayor a menor</option>
            <option value="asc">Menor a mayor</option>
          </select>
        </label>
      </div>
      <h2 className="text-xl font-bold mb-4">Predicción de riesgo de Desercion Empleados</h2>
      <Table className="min-w-full bg-white border border-gray-300">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Puesto</TableCell>
            <TableCell>Riesgo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {empleadosOrdenados.map((empleado) => (
            <TableRow key={empleado.id_empleado}>
              <TableCell>{empleado.nombre}</TableCell>
              <TableCell>{empleado.apellido}</TableCell>
              <TableCell>{empleado.puesto_trabajo || empleado.puesto || "-"}</TableCell>
              <TableCell>
                <div className={`${styles.desempenoBox} ${getColorDesempeno(empleado.riesgo)}`}>
                  {empleado.riesgo !== undefined
                    ? `${empleado.riesgo}%`
                    : "N/A"}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCalcularRiesgo(empleado.id_empleado)}
                  disabled={calculando[empleado.id_empleado]}
                >
                  {calculando[empleado.id_empleado] ? "Calculando..." : "Calcular Riesgo"}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleMostrarDetalles(empleado.id_empleado)}
                >
                    Mostrar detalles
                </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
<Dialog open={modalAbierto} onClose={() => setModalAbierto(false)}>
  <DialogTitle>Detalles del riesgo</DialogTitle>
  <DialogContent>
    {detalle ? (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><b>Ausencias (90d)</b></TableCell>
              <TableCell>{detalle.ausencias_90d}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Llegadas tarde (90d)</b></TableCell>
              <TableCell>{detalle.llegadas_tarde_90d}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Salidas tempranas (90d)</b></TableCell>
              <TableCell>{detalle.salidas_tempranas_90d}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Horas extra trabajadas (90d)</b></TableCell>
              <TableCell>{detalle.hs_extras_trabajadas_90d}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <p>No hay datos.</p>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setModalAbierto(false)}>Cerrar</Button>
  </DialogActions>
</Dialog>
    </div>
  );
}