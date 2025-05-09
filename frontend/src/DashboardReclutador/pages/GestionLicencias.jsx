import React, { useState, useEffect, useCallback } from 'react';
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Button,Typography,CircularProgress,Box,TextField,Dialog,
    DialogActions,DialogContent,DialogContentText,DialogTitle,IconButton} from '@mui/material';
import { CheckCircleOutline, CancelOutlined, Visibility } from '@mui/icons-material';
import styles from '../DashboardReclutador.module.css';

// Datos de ejemplo
const mockLicencias = [
    {
        id: 1,
        empleadoId: 101,
        empleadoNombre: "Ana Pérez",
        fechaSolicitud: "2025-05-01",
        motivo: "Médica",
        fechaInicio: "2025-05-10",
        fechaFin: "2025-05-12",
        estado: "Pendiente Aprobación",
        documentoUrl: "#", // Simulado
        comentariosEmpleado: "Adjunto certificado médico."
    },
    {
        id: 2,
        empleadoId: 102,
        empleadoNombre: "Carlos López",
        fechaSolicitud: "2025-04-28",
        motivo: "Estudio",
        fechaInicio: "2025-06-01",
        fechaFin: "2025-06-05",
        estado: "Pendiente Aprobación",
        documentoUrl: null,
        comentariosEmpleado: "Solicito días para rendir examen final."
    },
    {
        id: 3,
        empleadoId: 103,
        empleadoNombre: "Laura Gómez",
        fechaSolicitud: "2025-05-03",
        motivo: "Personal",
        fechaInicio: "2025-05-20",
        fechaFin: "2025-05-20",
        estado: "Aprobada",
        documentoUrl: null,
        comentariosEmpleado: "Día por asuntos personales.",
        comentariosRRHH: "Aprobado por equipo."
    },
];

export default function GestionLicencias() {
    const [licencias, setLicencias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLicencia, setSelectedLicencia] = useState(null);
    const [comentarioRRHH, setComentarioRRHH] = useState('');
    const [accion, setAccion] = useState(''); // 'aprobar' o 'rechazar'

    const fetchLicenciasPendientes = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLicencias(mockLicencias);
        } catch (err) {
            console.error("Error al obtener licencias:", err);
            setError("No se pudieron cargar las solicitudes de licencia. Intente más tarde.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLicenciasPendientes();
    }, [fetchLicenciasPendientes]);

    const handleOpenDialog = (licencia, tipoAccion) => {
        setSelectedLicencia(licencia);
        setAccion(tipoAccion);
        setComentarioRRHH(licencia.comentariosRRHH || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedLicencia(null);
        setComentarioRRHH('');
        setAccion('');
    };

    const handleSubmitDecision = async () => {
        if (!selectedLicencia) return;

        const nuevoEstado = accion === 'aprobar' ? 'Aprobada' : 'Rechazada';
        
        // Lógica para actualizar el estado de la licencia (simulada)
        setLicencias(prevLicencias =>
            prevLicencias.map(lic =>
                lic.id === selectedLicencia.id
                    ? { ...lic, estado: nuevoEstado, comentariosRRHH: comentarioRRHH }
                    : lic
            )
        );
        
        console.log(`Licencia ID ${selectedLicencia.id} ${nuevoEstado} con comentario: ${comentarioRRHH}`);
        handleCloseDialog();
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
                <Typography variant="h6" style={{ marginLeft: '1rem' }}>Cargando solicitudes...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" mt={5}>
                <Typography color="error" variant="h6">{error}</Typography>
                <Button variant="contained" onClick={fetchLicenciasPendientes} style={{ marginTop: '1rem' }}>Reintentar</Button>
            </Box>
        );
    }
    
    const licenciasAMostrar = licencias.filter(lic => lic.estado === "Pendiente Aprobación");

    return (
        <section className={styles.section}>
            <Typography variant="h4" component="h2" gutterBottom style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Gestión de Solicitudes de Licencia
            </Typography>

            {licenciasAMostrar.length === 0 && !isLoading ? (
                <Typography variant="subtitle1" style={{marginTop: '2rem', textAlign: 'center'}}>
                    No hay solicitudes de licencia pendientes de aprobación en este momento.
                </Typography>
            ) : (
                <TableContainer component={Paper} className={styles.tableContainer} style={{marginTop: '2rem'}}>
                    <Table stickyHeader aria-label="tabla de licencias pendientes">
                        <TableHead>
                            <TableRow>
                                <TableCell>Empleado</TableCell>
                                <TableCell>Fecha Solicitud</TableCell>
                                <TableCell>Motivo</TableCell>
                                <TableCell>Período Solicitado</TableCell>
                                <TableCell>Comentario Empleado</TableCell>
                                <TableCell>Documento</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {licenciasAMostrar.map((lic) => (
                                <TableRow hover key={lic.id}>
                                    <TableCell>{lic.empleadoNombre}</TableCell>
                                    <TableCell>{new Date(lic.fechaSolicitud).toLocaleDateString()}</TableCell>
                                    <TableCell>{lic.motivo}</TableCell>
                                    <TableCell>
                                        {new Date(lic.fechaInicio).toLocaleDateString()} - {new Date(lic.fechaFin).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell style={{maxWidth: '200px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                                        {lic.comentariosEmpleado || '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                        {lic.documentoUrl && lic.documentoUrl !== '#' ? (
                                            <IconButton
                                                href={lic.documentoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                color="primary"
                                                aria-label="ver documento"
                                            >
                                                <Visibility />
                                            </IconButton>
                                        ) : (
                                            lic.documentoUrl === '#' ? <Visibility color="disabled"/> : '-' // Ejemplo si el link es #
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            startIcon={<CheckCircleOutline />}
                                            onClick={() => handleOpenDialog(lic, 'aprobar')}
                                            style={{ marginRight: 8 }}
                                            disabled={lic.estado !== "Pendiente Aprobación"}
                                        >
                                            Aprobar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            startIcon={<CancelOutlined />}
                                            onClick={() => handleOpenDialog(lic, 'rechazar')}
                                            disabled={lic.estado !== "Pendiente Aprobación"}
                                        >
                                            Rechazar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {accion === 'aprobar' ? 'Aprobar Solicitud de Licencia' : 'Rechazar Solicitud de Licencia'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{marginBottom: '1rem'}}>
                        Empleado: <strong>{selectedLicencia?.empleadoNombre}</strong> <br/>
                        Motivo: {selectedLicencia?.motivo} <br/>
                        Período: {selectedLicencia ? `${new Date(selectedLicencia.fechaInicio).toLocaleDateString()} - ${new Date(selectedLicencia.fechaFin).toLocaleDateString()}` : ''}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="comentarioRRHH"
                        label="Comentario RRHH (Opcional)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={comentarioRRHH}
                        onChange={(e) => setComentarioRRHH(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
                    <Button onClick={handleSubmitDecision} color="primary" variant="contained">
                        Confirmar {accion === 'aprobar' ? 'Aprobación' : 'Rechazo'}
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
}