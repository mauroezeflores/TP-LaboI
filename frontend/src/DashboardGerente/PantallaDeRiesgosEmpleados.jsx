import { getEmpleadosRiesgo } from "../services/RiesgosEmpleadosMock";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import styles from "./PantallaRiesgos.module.css"; // Archivo CSS para estilos personalizados

export default function PantallaDeRiesgosEmpleados() {

    const [empleados, setEmpleados] = useState([]);
//         empleado.id_empleado === id_empleado

useEffect(() => {
    const fetchEmpleados = async () => {
        try {
            const data = await getEmpleadosRiesgo(); // Llama a la función mock para obtener empleados
            setEmpleados(data); // Actualiza el estado con los datos obtenidos
        } catch (error) {
            console.error("Error al obtener empleados:", error.message);
        }
    };

    fetchEmpleados();
}) // [], // Dependencias vacías para que se ejecute solo una vez al montar el componente
// ;

  const getColorDesempeno = (desempeno) => {
    if (desempeno < 30) return styles.red;
    if (desempeno >= 30 && desempeno < 70) return styles.orange;
    if (desempeno >= 70) return styles.green;
    return styles.default;
  };

    return (
    <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Riesgos de Empleados</h2>

        <Table className="min-w-full bg-white border border-gray-300">
            <TableHead>
                <TableRow>
                    <TableCell className="px-4 py-2">Nombre</TableCell>
                    <TableCell className="px-4 py-2">Apellido</TableCell>
                    <TableCell className="px-4 py-2">Puesto</TableCell>
                    <TableCell className="px-4 py-2">Riesgo</TableCell>
                    <TableCell className="px-4 py-2">Acciones</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {empleados.map((empleado) => (
                    <TableRow key={empleado.id_empleado}>
                        <TableCell className="border px-4 py-2">{empleado.nombre}</TableCell>
                        <TableCell className="border px-4 py-2">{empleado.apellido}</TableCell>
                        <TableCell className="border px-4 py-2">{empleado.puesto}</TableCell>
                        <TableCell className="border px-4 py-2">
                            
                            <div
                              className={`${styles.desempenoBox} ${getColorDesempeno(empleado.riesgo)}`}
                            >
                              {empleado.riesgo !== null && empleado.riesgo !== undefined ? (
                                `${empleado.riesgo}%`
                              ) : (
                                "N/A"
                              )}
                            </div>

                        </TableCell>
                        <TableCell className="border px-4 py-2">
                            <Button variant="contained" color="primary">
                                Calcular Riesgo
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    </div>
    );
}
    