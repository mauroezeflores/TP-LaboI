import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, Button, Box, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Switch, FormControlLabel, Select,
    MenuItem, InputLabel, FormControl, Chip, Tooltip, Grid, Avatar,
    InputAdornment
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale/es'; // Importar locale español
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 


import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Para ver detalles
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // Puesto
import ApartmentIcon from '@mui/icons-material/Apartment'; // Departamento
import FingerprintIcon from '@mui/icons-material/Fingerprint'; // CUIL/Legajo

// --- Datos de Ejemplo (Mocks) ---
const mockDepartamentos = [
    { idDepartamento: 1, nombreDepartamento: 'Tecnología' },
    { idDepartamento: 2, nombreDepartamento: 'Recursos Humanos' },
    { idDepartamento: 3, nombreDepartamento: 'Ventas' },
    { idDepartamento: 4, nombreDepartamento: 'Marketing' },
    { idDepartamento: 5, nombreDepartamento: 'Finanzas' },
];

const mockPuestos = [
    { idPuesto: 1, nombrePuesto: 'Desarrollador Frontend Jr.', idDepartamento: 1, sueldoBase: 180000 },
    { idPuesto: 2, nombrePuesto: 'Desarrollador Backend Sr.', idDepartamento: 1, sueldoBase: 350000 },
    { idPuesto: 3, nombrePuesto: 'Analista RRHH', idDepartamento: 2, sueldoBase: 220000 },
    { idPuesto: 4, nombrePuesto: 'Ejecutivo de Cuentas', idDepartamento: 3, sueldoBase: 200000 },
    { idPuesto: 5, nombrePuesto: 'Especialista en Marketing Digital', idDepartamento: 4, sueldoBase: 250000 },
    { idPuesto: 6, nombrePuesto: 'Contador Público', idDepartamento: 5, sueldoBase: 280000 },
];

const mockRoles = [ // Reutilizamos o definimos roles específicos para empleados
    { idRol: 1, nombreRol: 'Administrador del Sistema' },
    { idRol: 2, nombreRol: 'Gerente RRHH' },
    { idRol: 3, nombreRol: 'Empleado RRHH' },
    { idRol: 4, nombreRol: 'Gerente General' },
    { idRol: 5, nombreRol: 'Empleado Operativo' },
    { idRol: 6, nombreRol: 'Líder de Proyecto' },
];

const mockTiposContrato = ['Indeterminado', 'Plazo Fijo', 'Pasantía', 'Por Proyecto'];
const mockJornadasLaborales = ['Completa (9hs)', 'Reducida (6hs)', 'Part-time (4hs)', 'Flexible'];

const initialEmpleados = [
    {
        id_empleado: 'EMP001', legajo: 'L001', nombre: 'Ana', apellido: 'Pérez', cuil: '27-30123456-5',
        fecha_nacimiento: new Date(1990, 5, 15), direccion: 'Av. Siempre Viva 742', telefono: '11-5555-1234',
        email: 'ana.perez@example.com', id_puesto: 2, id_departamento: 1,
        contratacion: {
            id_contratacion: 'C001', fecha_inicio: new Date(2020, 0, 10), tipo_contrato: 'Indeterminado',
            id_puesto_contratado: 2, jornada_laboral: 'Completa (9hs)'
        },
        fecha_alta_sistema: new Date(2020, 0, 1), activo: true, imagen_perfil_url: '',
        desempeno_actual: null, id_rol: 6
    },
    {
        id_empleado: 'EMP002', legajo: 'L002', nombre: 'Carlos', apellido: 'Gómez', cuil: '20-32123789-3',
        fecha_nacimiento: new Date(1985, 8, 22), direccion: 'Calle Falsa 123', telefono: '11-5555-5678',
        email: 'carlos.gomez@example.com', id_puesto: 3, id_departamento: 2,
        contratacion: {
            id_contratacion: 'C002', fecha_inicio: new Date(2019, 6, 1), tipo_contrato: 'Indeterminado',
            id_puesto_contratado: 3, jornada_laboral: 'Completa (9hs)'
        },
        fecha_alta_sistema: new Date(2019, 6, 1), activo: true, imagen_perfil_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        desempeno_actual: null, id_rol: 3
    },
];

const initialEmpleadoForm = {
    id_empleado: null, legajo: '', nombre: '', apellido: '', cuil: '',
    fecha_nacimiento: null, direccion: '', telefono: '', email: '',
    id_puesto: '', id_departamento: '', // id_departamento se autocompleta con el puesto
    contratacion: {
        id_contratacion: null, fecha_inicio: null, tipo_contrato: '',
        id_puesto_contratado: '', jornada_laboral: ''
    },
    fecha_alta_sistema: new Date(), 
    activo: true, imagen_perfil_url: '',
    desempeno_actual: null, id_rol: ''
};
// --- Fin Datos de Ejemplo ---

export default function ABMEmpleadosAdmin() {
    const [empleados, setEmpleados] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEmpleado, setCurrentEmpleado] = useState(initialEmpleadoForm);
    const [viewMode, setViewMode] = useState(false); // Para diálogo de solo visualización

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPuesto, setFilterPuesto] = useState('');
    const [filterDepartamento, setFilterDepartamento] = useState('');

    useEffect(() => {
        setEmpleados(initialEmpleados);
        setPuestos(mockPuestos);
        setDepartamentos(mockDepartamentos);
        setRoles(mockRoles);
    }, []);

    useEffect(() => {
        let result = empleados;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(e =>
                e.nombre.toLowerCase().includes(lowerSearchTerm) ||
                e.apellido.toLowerCase().includes(lowerSearchTerm) ||
                e.email.toLowerCase().includes(lowerSearchTerm) ||
                e.legajo.toLowerCase().includes(lowerSearchTerm) ||
                (e.cuil && e.cuil.includes(searchTerm))
            );
        }
        if (filterPuesto) {
            result = result.filter(e => e.id_puesto === parseInt(filterPuesto));
        }
        if (filterDepartamento) {
            result = result.filter(e => e.id_departamento === parseInt(filterDepartamento));
        }
        setFilteredEmpleados(result);
    }, [empleados, searchTerm, filterPuesto, filterDepartamento]);

    const getNombrePuesto = (idPuesto) => puestos.find(p => p.idPuesto === idPuesto)?.nombrePuesto || 'N/A';
    const getNombreDepartamento = (idDepartamento) => departamentos.find(d => d.idDepartamento === idDepartamento)?.nombreDepartamento || 'N/A';
    const getNombreRol = (idRol) => roles.find(r => r.idRol === idRol)?.nombreRol || 'N/A';

    const handleOpenDialog = (empleado = null, isViewMode = false) => {
        setViewMode(isViewMode);
        if (empleado) {
            setIsEditMode(true);
            // Asegurarse de que las fechas sean objetos Date válidos para los DatePickers
            const empleadoData = {
                ...empleado,
                fecha_nacimiento: empleado.fecha_nacimiento ? new Date(empleado.fecha_nacimiento) : null,
                fecha_alta_sistema: empleado.fecha_alta_sistema ? new Date(empleado.fecha_alta_sistema) : new Date(),
                contratacion: {
                    ...empleado.contratacion,
                    fecha_inicio: empleado.contratacion?.fecha_inicio ? new Date(empleado.contratacion.fecha_inicio) : null,
                }
            };
            setCurrentEmpleado(empleadoData);
        } else {
            setIsEditMode(false);
            setCurrentEmpleado({
                ...initialEmpleadoForm,
                fecha_alta_sistema: new Date(), // Resetear fecha alta para nuevo empleado
                contratacion: { ...initialEmpleadoForm.contratacion }
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentEmpleado(initialEmpleadoForm);
        setViewMode(false);
    };

    const handleChange = (event, path = null) => {
        const { name, value, type, checked } = event.target;
        const val = type === 'checkbox' ? checked : value;

        if (path) { // Para campos anidados como 'contratacion'
            setCurrentEmpleado(prev => ({
                ...prev,
                [path]: {
                    ...prev[path],
                    [name]: val
                }
            }));
        } else {
            setCurrentEmpleado(prev => ({ ...prev, [name]: val }));
        }

        // Auto-actualizar departamento si se cambia el puesto
        if (name === 'id_puesto') {
            const puestoSeleccionado = puestos.find(p => p.idPuesto === parseInt(val));
            if (puestoSeleccionado) {
                setCurrentEmpleado(prev => ({
                    ...prev,
                    id_departamento: puestoSeleccionado.idDepartamento,
                    contratacion: { // También actualizar el puesto contratado
                        ...prev.contratacion,
                        id_puesto_contratado: puestoSeleccionado.idPuesto
                    }
                }));
            }
        }
    };

    const handleDateChange = (name, date, path = null) => {
         if (path) {
            setCurrentEmpleado(prev => ({
                ...prev,
                [path]: { ...prev[path], [name]: date }
            }));
        } else {
            setCurrentEmpleado(prev => ({ ...prev, [name]: date }));
        }
    };

    const handleSubmit = () => {
        // Validaciones básicas
        if (!currentEmpleado.nombre || !currentEmpleado.apellido || !currentEmpleado.email || !currentEmpleado.id_puesto || !currentEmpleado.id_rol || !currentEmpleado.contratacion.tipo_contrato || !currentEmpleado.contratacion.jornada_laboral || !currentEmpleado.contratacion.fecha_inicio) {
            alert("Por favor, complete todos los campos obligatorios (*).");
            return;
        }

        if (isEditMode) {
            setEmpleados(prev => prev.map(e => e.id_empleado === currentEmpleado.id_empleado ? currentEmpleado : e));
            alert("Empleado actualizado exitosamente (simulado).");
        } else {
            const nuevoEmpleado = {
                ...currentEmpleado,
                id_empleado: `EMP${Date.now().toString().slice(-4)}`,
                legajo: currentEmpleado.legajo || `L${Date.now().toString().slice(-3)}`,
                contratacion: {
                    ...currentEmpleado.contratacion,
                    id_contratacion: `C${Date.now().toString().slice(-4)}`
                }
            };
            setEmpleados(prev => [nuevoEmpleado, ...prev]);
            alert("Empleado creado exitosamente (simulado).");
        }
        handleCloseDialog();
    };
    
    const handleToggleActivo = (empleadoId, event) => {
        event.stopPropagation(); // Evita que se abra el diálogo si el switch está en una fila clickeable
        setEmpleados(prev =>
            prev.map(e =>
                e.id_empleado === empleadoId ? { ...e, activo: !e.activo } : e
            )
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    ABM de Empleados
                </Typography>
                       
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4} md={3}>
                        <TextField fullWidth label="Buscar empleado..." variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filtrar por Puesto</InputLabel>
                            <Select value={filterPuesto} label="Filtrar por Puesto" onChange={(e) => setFilterPuesto(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {puestos.map(p => <MenuItem key={p.idPuesto} value={p.idPuesto}>{p.nombrePuesto}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filtrar por Departamento</InputLabel>
                            <Select value={filterDepartamento} label="Filtrar por Departamento" onChange={(e) => setFilterDepartamento(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {departamentos.map(d => <MenuItem key={d.idDepartamento} value={d.idDepartamento}>{d.nombreDepartamento}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} sx={{ textAlign: {md: 'right', xs: 'left'} }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog(null, false)} fullWidth>
                            Registrar Empleado
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} elevation={2}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{pl:1, pr:0}}></TableCell>
                                <TableCell>Legajo</TableCell>
                                <TableCell>Nombre Completo</TableCell>
                                <TableCell>Puesto</TableCell>
                                <TableCell>Departamento</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center">Activo</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmpleados.length > 0 ? filteredEmpleados.map((emp) => (
                                <TableRow hover key={emp.id_empleado} >
                                    <TableCell sx={{pl:1, pr:0}}>
                                        <Avatar src={emp.imagen_perfil_url} sx={{ width: 30, height: 30, fontSize:'0.8rem' }}>
                                            {!emp.imagen_perfil_url && emp.nombre[0] + emp.apellido[0]}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{emp.legajo}</TableCell>
                                    <TableCell>{emp.nombre} {emp.apellido}</TableCell>
                                    <TableCell>{getNombrePuesto(emp.id_puesto)}</TableCell>
                                    <TableCell>{getNombreDepartamento(emp.id_departamento)}</TableCell>
                                    <TableCell>{emp.email}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={emp.activo ? "Desactivar" : "Activar"}>
                                            <Switch checked={emp.activo} onChange={(e) => handleToggleActivo(emp.id_empleado, e)} size="small" />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Ver Detalles">
                                            <IconButton size="small" onClick={() => handleOpenDialog(emp, true)}><VisibilityIcon /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar Empleado">
                                            <IconButton size="small" onClick={() => handleOpenDialog(emp, false)}><EditIcon /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">No se encontraron empleados.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* --- DIALOGO PARA CREAR/EDITAR/VER EMPLEADO --- */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{sx: {overflowY: 'visible' }}}> {/* Allow DatePicker to overflow */}
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {viewMode ? <VisibilityIcon /> : isEditMode ? <EditIcon /> : <AddIcon />}
                        {viewMode ? 'Detalles del Empleado' : isEditMode ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
                    </DialogTitle>
                    <DialogContent sx={{overflowY: 'visible'}}> {/* Allow DatePicker to overflow */}
                        <Grid container spacing={2} sx={{ pt: 1 }}>
                            {/* --- Datos Personales --- */}
                            <Grid item xs={12}><Typography variant="subtitle1" color="primary">Datos Personales</Typography></Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField InputProps={{startAdornment: <InputAdornment position="start"><FingerprintIcon fontSize="small" /></InputAdornment> }} label="Legajo *" name="legajo" value={currentEmpleado.legajo} onChange={handleChange} fullWidth margin="dense" disabled={isEditMode || viewMode} helperText={isEditMode ? "No editable" : "Opcional, se autogenera"}/>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <TextField label="Nombre *" name="nombre" value={currentEmpleado.nombre} onChange={handleChange} fullWidth margin="dense" disabled={viewMode}/>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <TextField label="Apellido *" name="apellido" value={currentEmpleado.apellido} onChange={handleChange} fullWidth margin="dense" disabled={viewMode}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField InputProps={{startAdornment: <InputAdornment position="start"><FingerprintIcon fontSize="small" /></InputAdornment> }} label="CUIL" name="cuil" value={currentEmpleado.cuil} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} helperText="Formato: XX-XXXXXXXX-X"/>
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Fecha de Nacimiento"
                                    value={currentEmpleado.fecha_nacimiento}
                                    onChange={(date) => handleDateChange('fecha_nacimiento', date)}
                                    slotProps={{ textField: { fullWidth: true, margin: "dense", helperText:"DD/MM/AAAA" } }}
                                    disabled={viewMode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Dirección" name="direccion" value={currentEmpleado.direccion} onChange={handleChange} fullWidth margin="dense" disabled={viewMode}/>
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <TextField InputProps={{startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" /></InputAdornment> }} label="Teléfono" name="telefono" value={currentEmpleado.telefono} onChange={handleChange} fullWidth margin="dense" disabled={viewMode}/>
                            </Grid>

                            {/* --- Datos de Contacto y Acceso --- */}
                            <Grid item xs={12}><Typography variant="subtitle1" color="primary" sx={{mt:1}}>Datos de Contacto y Acceso</Typography></Grid>
                             <Grid item xs={12} sm={6}>
                                <TextField InputProps={{startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment> }} label="Email *" name="email" type="email" value={currentEmpleado.email} onChange={handleChange} fullWidth margin="dense" disabled={isEditMode || viewMode} helperText={isEditMode ? "No editable" : ""}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="dense" required>
                                    <InputLabel id="rol-label">Rol en Sistema *</InputLabel>
                                    <Select labelId="rol-label" name="id_rol" value={currentEmpleado.id_rol} label="Rol en Sistema *" onChange={handleChange} disabled={viewMode}>
                                        {roles.map(r => <MenuItem key={r.idRol} value={r.idRol}>{r.nombreRol}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <TextField label="URL Imagen Perfil" name="imagen_perfil_url" value={currentEmpleado.imagen_perfil_url} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} helperText="Opcional"/>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:'center'}}>
                                <Avatar src={currentEmpleado.imagen_perfil_url || undefined} sx={{ width: 56, height: 56, mr: 2, mt:1 }}>
                                    {!currentEmpleado.imagen_perfil_url && <AccountCircleIcon sx={{ width: 40, height: 40 }}/>}
                                </Avatar>
                                <FormControlLabel control={<Switch checked={currentEmpleado.activo} onChange={handleChange} name="activo" />} label="Empleado Activo" disabled={viewMode} />
                            </Grid>


                            {/* --- Datos Laborales y Contratación --- */}
                            <Grid item xs={12}><Typography variant="subtitle1" color="primary" sx={{mt:1}}>Datos Laborales y Contratación</Typography></Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="dense" required>
                                    <InputLabel id="puesto-label">Puesto de Trabajo *</InputLabel>
                                    <Select labelId="puesto-label" name="id_puesto" value={currentEmpleado.id_puesto} label="Puesto de Trabajo *" onChange={handleChange} disabled={viewMode}>
                                        {puestos.map(p => <MenuItem key={p.idPuesto} value={p.idPuesto}>{p.nombrePuesto}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Departamento" name="direccion" value={currentEmpleado.direccion} onChange={handleChange} fullWidth margin="dense" disabled={viewMode}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Fecha Inicio Contrato *"
                                    name="fecha_inicio"
                                    value={currentEmpleado.contratacion.fecha_inicio}
                                    onChange={(date) => handleDateChange('fecha_inicio', date, 'contratacion')}
                                    slotProps={{ textField: { fullWidth: true, margin: "dense", required: true, helperText:"DD/MM/AAAA" } }}
                                    disabled={viewMode}
                                />
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="dense" required>
                                    <InputLabel id="tipo-contrato-label">Tipo de Contrato *</InputLabel>
                                    <Select labelId="tipo-contrato-label" name="tipo_contrato" value={currentEmpleado.contratacion.tipo_contrato} label="Tipo de Contrato *" onChange={(e) => handleChange(e, 'contratacion')} disabled={viewMode}>
                                        {mockTiposContrato.map(tc => <MenuItem key={tc} value={tc}>{tc}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="dense" required>
                                    <InputLabel id="jornada-label">Jornada Laboral *</InputLabel>
                                    <Select labelId="jornada-label" name="jornada_laboral" value={currentEmpleado.contratacion.jornada_laboral} label="Jornada Laboral *" onChange={(e) => handleChange(e, 'contratacion')} disabled={viewMode}>
                                        {mockJornadasLaborales.map(jl => <MenuItem key={jl} value={jl}>{jl}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                 <DatePicker
                                    label="Fecha Alta en Sistema"
                                    name="fecha_alta_sistema"
                                    value={currentEmpleado.fecha_alta_sistema}
                                    onChange={(date) => handleDateChange('fecha_alta_sistema', date)}
                                    slotProps={{ textField: { fullWidth: true, margin: "dense", helperText:"DD/MM/AAAA" } }}
                                    disabled={viewMode || isEditMode} /* Generalmente no se edita o se pone automático */
                                />
                            </Grid>

                        </Grid>

                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        {!viewMode && (
                            <Button onClick={handleSubmit} variant="contained" color="primary">
                                {isEditMode ? 'Guardar Cambios' : 'Registrar Empleado'}
                            </Button>
                        )}
                    </DialogActions>

                </Dialog>
                          
            </Paper>
            </LocalizationProvider>  

    );
}