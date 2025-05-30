import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Paper, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Switch, FormControlLabel, Select,
    MenuItem, InputLabel, FormControl,CircularProgress, Alert, Grid, TextField, Avatar, Tooltip
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale/es';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styles from '../DashboardReclutador.module.css';
import {
    getEmpleadosDetalle,
    getEmpleadoById,
    registrarEmpleado,
    actualizarEmpleado,
    toggleActivoEmpleado,
    getPuestos
} from '../../services/ServiceEmpleadosMock'; 
const initialEmpleadoFormRRHH_Create = {
    nombre: '',
    apellido: '',
    fecha_de_nacimiento: null, // Se convertirá a string 'YYYY-MM-DD'
    email_personal: '',
    estado_civil: '',
    tiene_hijos: false,
    nivel_educativo: '',
    id_direccion: '',
    id_puesto_trabajo: '',
    id_jornada: '',
    estado: 'Activo', 
    hace_horas_extra: false,
    tiene_movilidad_propia: false,
    dni: '',
    tiene_presentismo: false,
    id_usuario: null, // Falta poner esto
    activo_en_sistema: true,
};


export default function GestionEmpleados() {
    const [empleados, setEmpleados] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [jornadas, setJornadas] = useState([ // Deberías cargar esto desde el backend
        { id_jornada: 1, descripcion: 'Completa (9hs)'},
        { id_jornada: 2, descripcion: 'Reducida (6hs)' },
        { id_jornada: 3, descripcion: 'Part-time (4hs)' },
    ]); 
    const [direcciones, setDirecciones] = useState([ // Deberías cargar esto manualmente. FALTA
        { id_direccion: 1, descripcion_corta: 'Av. Corrientes 123, CABA' },
        { id_direccion: 2, descripcion_corta: 'Calle Falsa 456, Provincia X' },    ]);
    // const [usuarios, setUsuarios] = useState([]); // Para el selector de id_usuario FALTA


    const [filteredEmpleados, setFilteredEmpleados] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEmpleado, setCurrentEmpleado] = useState(initialEmpleadoFormRRHH_Create);
    const [viewMode, setViewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'info' });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPuesto, setFilterPuesto] = useState('');
    const [filterEstadoActivo, setFilterEstadoActivo] = useState(''); // Para filtrar por empleado.activo_en_sistema

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const [empleadosData, puestosData ] = await Promise.all([
                getEmpleadosDetalle(),
                getPuestos(),
            ]);
            setEmpleados(empleadosData.map(e => ({ ...e, activo_en_sistema: e.activo_en_sistema !== undefined ? e.activo_en_sistema : true })));
            setPuestos(puestosData);
            setAlertInfo({ open: false, message: '', severity: 'info' });
        } catch (error) {
            console.error("Error cargando datos iniciales:", error);
            setAlertInfo({ open: true, message: error.message || 'Error al cargar datos.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    useEffect(() => {
        let result = empleados;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(e =>
                (e.nombre && e.nombre.toLowerCase().includes(lowerSearchTerm)) ||
                (e.apellido && e.apellido.toLowerCase().includes(lowerSearchTerm)) ||
                (e.email_personal && e.email_personal.toLowerCase().includes(lowerSearchTerm))
            );
        }
        if (filterPuesto) {
            result = result.filter(e => e.id_puesto_trabajo === parseInt(filterPuesto));
        }
        if (filterEstadoActivo !== '') {
            result = result.filter(e => e.activo_en_sistema === (filterEstadoActivo === 'activos'));
        }
        setFilteredEmpleados(result);
    }, [empleados, searchTerm, filterPuesto, filterEstadoActivo]);


    const getNombrePuesto = (idPuesto) => puestos.find(p => p.id_puesto_trabajo === idPuesto)?.nombre || 'N/A';
    const getNombreJornada = (idJornada) => jornadas.find(j => j.id_jornada === idJornada)?.descripcion || 'N/A';


    const handleOpenDialog = async (empleado = null, isView = false) => {
        setViewMode(isView);
        setIsEditMode(!!empleado);
        if (empleado) { // Modo Edición o Vista
            setDialogLoading(true);
            try {
                const fullEmpleadoData = await getEmpleadoById(empleado.id_empleado); 
                setCurrentEmpleado({
                    ...initialEmpleadoFormRRHH_Create,
                    ...fullEmpleadoData,
                    fecha_de_nacimiento: fullEmpleadoData.fecha_de_nacimiento ? new Date(fullEmpleadoData.fecha_de_nacimiento) : null,
                    id_puesto_trabajo: fullEmpleadoData.id_puesto_trabajo || '',
                    id_jornada: fullEmpleadoData.id_jornada || '',
                    id_direccion: fullEmpleadoData.id_direccion || '',
                    id_usuario: fullEmpleadoData.id_usuario || null,
                });
                setAlertInfo({ open: false, message: '', severity: 'info' });
            } catch (error) {
                 console.error("Error al cargar datos del empleado para editar/ver:", error);
                 setAlertInfo({ open: true, message: 'Error al cargar datos del empleado.', severity: 'error' });
                 handleCloseDialog(); // Cierra el diálogo si hay error al cargar
            } finally {
                setDialogLoading(false);
            }
        } else { // Modo Creación
            setCurrentEmpleado(initialEmpleadoFormRRHH_Create); // Usar el formulario específico de creación
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCurrentEmpleado(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDateChange = (name, date) => {
        setCurrentEmpleado(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async () => {
        console.log("handleSubmit para RRHH. Modo Edición:", isEditMode);
        console.log("Datos del formulario (currentEmpleado):", currentEmpleado);

        // Validación para creación
        if (!isEditMode && (
            !currentEmpleado.nombre || !currentEmpleado.apellido || 
            !currentEmpleado.fecha_de_nacimiento || !currentEmpleado.email_personal ||
            !currentEmpleado.id_direccion || !currentEmpleado.id_puesto_trabajo ||
            !currentEmpleado.id_jornada || !currentEmpleado.estado
            )) {
            setAlertInfo({open: true, message: "Para crear: Nombre, Apellido, Fecha Nac., Email, Dirección, Puesto, Jornada y Estado Laboral son obligatorios.", severity: "error"});
            return;
        }
        // Validación para edición (podría ser más laxa o específica)
        if (isEditMode && (
            !currentEmpleado.email_personal || !currentEmpleado.id_direccion ||
            !currentEmpleado.id_puesto_trabajo || !currentEmpleado.id_jornada || !currentEmpleado.estado
            )) {
             setAlertInfo({open: true, message: "Para editar: Email, Dirección, Puesto, Jornada y Estado Laboral son obligatorios.", severity: "error"});
            return;
        }

        setDialogLoading(true);

        const datosParaEnviar = {
            nombre: currentEmpleado.nombre,
            apellido: currentEmpleado.apellido,
            fecha_de_nacimiento: currentEmpleado.fecha_de_nacimiento
                ? new Date(currentEmpleado.fecha_de_nacimiento).toISOString().split('T')[0] // Formato YYYY-MM-DD
                : null,
            email_personal: currentEmpleado.email_personal,
            estado_civil: currentEmpleado.estado_civil,
            tiene_hijos: currentEmpleado.tiene_hijos,
            nivel_educativo: currentEmpleado.nivel_educativo,
            id_direccion: parseInt(currentEmpleado.id_direccion, 10),
            id_puesto_trabajo: parseInt(currentEmpleado.id_puesto_trabajo, 10),
            id_jornada: parseInt(currentEmpleado.id_jornada, 10),
            estado: currentEmpleado.estado,
            hace_horas_extra: currentEmpleado.hace_horas_extra,
            tiene_movilidad_propia: currentEmpleado.tiene_movilidad_propia,
            dni: currentEmpleado.dni,
            tiene_presentismo: currentEmpleado.tiene_presentismo,
            id_usuario: currentEmpleado.id_usuario ? parseInt(currentEmpleado.id_usuario, 10) : null,
        };
        
        console.log("Datos formateados para enviar al backend:", datosParaEnviar);

        try {
            if (isEditMode) {
                await actualizarEmpleado(currentEmpleado.id_empleado, datosParaEnviar);
                setAlertInfo({open: true, message: "Empleado actualizado con éxito.", severity: "success"});
            } else {
                await registrarEmpleado(datosParaEnviar); // Esta es la función que usa POST /empleado
                setAlertInfo({open: true, message: "Empleado registrado con éxito.", severity: "success"});
            }
            fetchPageData(); // Recargar la lista de empleados
            handleCloseDialog();
        } catch (error) {
            console.error("Error en handleSubmit (RRHH):", error);
            setAlertInfo({open: true, message: error.message || "Error al procesar la solicitud.", severity: "error"});
        } finally {
            setDialogLoading(false);
        }
    };
    
    const handleToggleActivoSistema = async (empleadoId, currentActivoStatus) => {
        const newActivoStatus = !currentActivoStatus;
        try {
            await toggleActivoEmpleado(empleadoId, newActivoStatus); 
            setEmpleados(prev =>
                prev.map(e =>
                    // Actualiza el campo correcto que indica el estado de activo en sistema
                    e.id_empleado === empleadoId ? { ...e, activo_en_sistema: newActivoStatus } : e
                )
            );
            setAlertInfo({open: true, message: `Acceso al sistema del empleado ${newActivoStatus ? 'activado' : 'desactivado'}.`, severity: "success"});
        } catch (error) {
            console.error("Error al cambiar estado de acceso al sistema:", error);
            setAlertInfo({open: true, message: error.message || "Error al cambiar estado de acceso.", severity: "error"});
        }
    };
    
    // Renderizado del componente
    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <section className={styles.section}> {/* Estilo general de sección del DashboardReclutador */}
                <Typography variant="h5" component="h2" gutterBottom sx={{color: 'var(--primary)', fontWeight: '600'}}>
                    Gestión de Empleados
                </Typography>
                {alertInfo.open && (
                    <Alert severity={alertInfo.severity} onClose={() => setAlertInfo({ ...alertInfo, open: false })} sx={{ mb: 2 }}>
                        {alertInfo.message}
                    </Alert>
                )}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2, p:1, border: '1px solid var(--border-soft)', borderRadius: '4px' }}>
                    <Grid ><TextField fullWidth label="Buscar por nombre, apellido..." variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></Grid>
                    <Grid >
                        <FormControl fullWidth size="small">
                            <InputLabel id="filter-puesto-label">Puesto</InputLabel>
                            <Select labelId="filter-puesto-label" value={filterPuesto} label="Puesto" onChange={(e) => setFilterPuesto(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {puestos.map(p => <MenuItem key={p.id_puesto_trabajo} value={p.id_puesto_trabajo}>{p.nombre}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid >
                        <FormControl fullWidth size="small">
                            <InputLabel id="filter-estado-activo-label">Acceso Sistema</InputLabel>
                            <Select labelId="filter-estado-activo-label" value={filterEstadoActivo} label="Acceso Sistema" onChange={(e) => setFilterEstadoActivo(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                <MenuItem value="activos">Activos</MenuItem>
                                <MenuItem value="inactivos">Inactivos</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid >
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog(null, false)} fullWidth>
                            Nuevo
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} className={styles.tableContainer} elevation={1}>
                    <Table stickyHeader size="small">
                        <TableHead>
                             <TableRow>
                                <TableCell sx={{pl:1, pr:0, width: '40px'}}></TableCell>
                                <TableCell>Nombre Completo</TableCell>
                                <TableCell>Puesto</TableCell>
                                <TableCell>Email Personal</TableCell>
                                <TableCell align="center">Acceso Sistema</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmpleados.length > 0 ? filteredEmpleados.map((emp) => (
                                <TableRow hover key={emp.id_empleado}>
                                    <TableCell sx={{pl:1, pr:0}}>
                                        <Avatar src={emp.imagen_perfil_url} sx={{ width: 28, height: 28, fontSize:'0.75rem' }}>
                                            {!emp.imagen_perfil_url && emp.nombre && emp.apellido && emp.nombre[0] + emp.apellido[0]}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{emp.nombre} {emp.apellido}</TableCell>
                                    <TableCell>{emp.puesto_trabajo}</TableCell> 
                                    <TableCell>{emp.email_personal}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={emp.activo_en_sistema ? "Desactivar acceso" : "Activar acceso"}>
                                            <Switch checked={emp.activo_en_sistema} onChange={() => handleToggleActivoSistema(emp.id_empleado, emp.activo_en_sistema)} size="small" />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Ver Detalles"><IconButton size="small" onClick={() => handleOpenDialog(emp, true)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Editar Empleado"><IconButton size="small" onClick={() => handleOpenDialog(emp, false)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={6} align="center" sx={{color: 'var(--text-light)'}}>No se encontraron empleados.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialogo para Crear/Editar/Ver Empleado */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{sx: {overflowY: 'visible' }}}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--primary)'}}>
                        {viewMode ? <VisibilityIcon /> : isEditMode ? <EditIcon /> : <AddIcon />}
                        {viewMode ? 'Detalles del Empleado' : isEditMode ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
                    </DialogTitle>
                    <DialogContent sx={{overflowY: 'visible'}}>
                        {dialogLoading ? <CircularProgress sx={{ display: 'block', margin: 'auto', my: 2 }} /> : (
                        <Grid container spacing={2} sx={{ pt: 1 }}>
                            <Grid><Typography variant="subtitle2" color="primary">DATOS PERSONALES</Typography></Grid>
                            <Grid><TextField required={!isEditMode} label="Nombre" name="nombre" value={currentEmpleado.nombre} onChange={handleChange} fullWidth margin="dense" disabled={viewMode || isEditMode} /></Grid>
                            <Grid><TextField required={!isEditMode} label="Apellido" name="apellido" value={currentEmpleado.apellido} onChange={handleChange} fullWidth margin="dense" disabled={viewMode || isEditMode} /></Grid>
                            <Grid ><TextField label="DNI" name="dni" value={currentEmpleado.dni} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} /></Grid>
                            <Grid ><DatePicker label="Fecha Nacimiento" required={!isEditMode} value={currentEmpleado.fecha_de_nacimiento} onChange={(d) => handleDateChange('fecha_de_nacimiento', d)} slotProps={{ textField: { fullWidth: true, margin: "dense"} }} disabled={viewMode || isEditMode} /></Grid>
                            <Grid ><TextField label="Estado Civil" name="estado_civil" value={currentEmpleado.estado_civil} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} /></Grid>
                            <Grid ><TextField label="Nivel Educativo" name="nivel_educativo" value={currentEmpleado.nivel_educativo} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} /></Grid>
                            <Grid  sx={{display:'flex', alignItems:'center'}}><FormControlLabel control={<Switch checked={currentEmpleado.tiene_hijos} onChange={handleChange} name="tiene_hijos"/>} label="Tiene Hijos/as" disabled={viewMode} /></Grid>
                            
                            <Grid ><Typography variant="subtitle2" color="primary" sx={{mt:1}}>DIRECCIÓN</Typography></Grid>
                            <Grid  ><FormControl fullWidth margin="dense" required><InputLabel>Dirección (Existente)</InputLabel><Select name="id_direccion" value={currentEmpleado.id_direccion} label="Dirección (Existente)" onChange={handleChange} disabled={viewMode}>{direcciones.map(d=><MenuItem key={d.id_direccion} value={d.id_direccion}>{d.descripcion_corta}</MenuItem>)}</Select></FormControl></Grid>

                            <Grid ><Typography variant="subtitle2" color="primary" sx={{mt:1}}>CONTACTO</Typography></Grid>
                            <Grid  ><TextField required label="Email Personal" name="email_personal" type="email" value={currentEmpleado.email_personal} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} /></Grid>

                            <Grid ><Typography variant="subtitle2" color="primary" sx={{mt:1}}>DATOS LABORALES</Typography></Grid>
                            <Grid  ><FormControl fullWidth margin="dense" required><InputLabel>Puesto de Trabajo</InputLabel><Select name="id_puesto_trabajo" value={currentEmpleado.id_puesto_trabajo} label="Puesto de Trabajo" onChange={handleChange} disabled={viewMode}>{puestos.map(p=><MenuItem key={p.id_puesto_trabajo} value={p.id_puesto_trabajo}>{p.nombre}</MenuItem>)}</Select></FormControl></Grid>
                            <Grid  ><FormControl fullWidth margin="dense" required><InputLabel>Jornada</InputLabel><Select name="id_jornada" value={currentEmpleado.id_jornada} label="Jornada" onChange={handleChange} disabled={viewMode}>{jornadas.map(j=><MenuItem key={j.id_jornada} value={j.id_jornada}>{j.descripcion}</MenuItem>)}</Select></FormControl></Grid>
                            <Grid  ><TextField required label="Estado Laboral" name="estado" value={currentEmpleado.estado} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} helperText="Ej: Contratado, Activo" /></Grid>
                            <Grid   sx={{display:'flex', alignItems:'flex-end'}}>
                                <FormControlLabel control={<Switch checked={currentEmpleado.hace_horas_extra} onChange={handleChange} name="hace_horas_extra" />} label="Realiza Horas Extra" disabled={viewMode} />
                                <FormControlLabel control={<Switch checked={currentEmpleado.tiene_movilidad_propia} onChange={handleChange} name="tiene_movilidad_propia" />} label="Movilidad Propia" disabled={viewMode} />
                                <FormControlLabel control={<Switch checked={currentEmpleado.tiene_presentismo} onChange={handleChange} name="tiene_presentismo" />} label="Presentismo OK" disabled={viewMode} />
                            </Grid>
                            
                            <Grid ><Typography variant="subtitle2" color="primary" sx={{mt:1}}>ACCESO AL SISTEMA</Typography></Grid>
                            <Grid  >
                              {/* <TextField label="ID Usuario (Opcional)" name="id_usuario" type="number" value={currentEmpleado.id_usuario || ''} onChange={handleChange} fullWidth margin="dense" disabled={viewMode || isEditMode} helperText="Si ya tiene cuenta de usuario en el sistema" /> */}
                            </Grid>
                            {/* El Switch para 'activo_en_sistema' (acceso) se maneja desde la tabla principal */}
                        </Grid>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
                        {!viewMode && (
                            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={dialogLoading}>
                                {dialogLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Guardar Cambios' : 'Registrar Empleado')}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </section>
        </LocalizationProvider>
    );
}