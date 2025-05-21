import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from "@mui/material";
import styles from "./PantallaRiesgos.module.css";
import { getEmpleadosDetalle, predecirRiesgoEmpleado } from "../services/RiesgosEmpleadosMock";

export default function PantallaDeRiesgosEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculando, setCalculando] = useState({}); // Para mostrar loading por empleado

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
    if (riesgo < 30) return styles.red;
    if (riesgo >= 30 && riesgo < 70) return styles.orange;
    if (riesgo >= 70) return styles.green;
    return styles.default;
  };

  const handleCalcularRiesgo = async (id_empleado, index) => {
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

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Predicción de rotación de empleados</h2>
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
          {empleados.map((empleado) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}