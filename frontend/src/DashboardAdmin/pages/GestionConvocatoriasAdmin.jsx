import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, Box, Grid, Button, IconButton, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle,
    Select, MenuItem, InputLabel, FormControl,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale/es';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Ver postulantes
import PublishIcon from '@mui/icons-material/Publish';
import CloseIcon from '@mui/icons-material/Close'; // Para cerrar convocatoria

import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Aprobar

import FilterListIcon from '@mui/icons-material/FilterList';
import { Link } from 'react-router-dom'; // Para enlazar a ver postulantes

// --- Datos de Ejemplo (Mocks) ---
const mockPuestosTrabajo = [ // Deberían venir del ABM de Puestos
    { idPuesto: 1, nombrePuesto: 'Desarrollador Frontend Jr.' },
    { idPuesto: 2, nombrePuesto: 'Desarrollador Backend Sr.' },
    { idPuesto: 3, nombrePuesto: 'Analista RRHH' },
    { idPuesto: 4, nombrePuesto: 'Ejecutivo de Cuentas Jr.' },
];

const mockEmpleadosRRHH = [ // Para asignar responsable
    { id_empleado: 'EMP002', nombreCompleto: 'Laura García (RRHH)' },
    { id_empleado: 'EMP007', nombreCompleto: 'Marcos Díaz (RRHH)' },
];

const mockInitialConvocatorias = [
    {
        id_convocatoria: 'CONV001', titulo_convocatoria: 'Desarrollador Frontend React Urgente',
        id_puesto_buscado: 1, fecha_publicacion: new Date(2025, 4, 1), fecha_cierre: new Date(2025, 4, 30, 23, 59),
        estado_convocatoria: 'Publicada', id_responsable_rrhh: 'EMP002', num_postulantes: 25,
        descripcion_publica: 'Buscamos un Dev Frontend con experiencia en React para unirse a nuestro equipo de innovación.',
        requisitos_excluyentes: 'React (2+ años), HTML5, CSS3, Git', visibilidad: 'Pública'
    },
    {
        id_convocatoria: 'CONV002', titulo_convocatoria: 'Líder Técnico Backend Java',
        id_puesto_buscado: 2, fecha_publicacion: new Date(2025, 3, 15), fecha_cierre: new Date(2025, 5, 15, 23, 59),
        estado_convocatoria: 'Publicada', id_responsable_rrhh: 'EMP007', num_postulantes: 12,
        descripcion_publica: 'Oportunidad para un Líder Técnico con sólida experiencia en Java y Spring Boot.',
        requisitos_excluyentes: 'Java, Spring Boot, Microservicios, Liderazgo de equipos', visibilidad: 'Pública'
    },
    {
        id_convocatoria: 'CONV003', titulo_convocatoria: 'Analista de Selección Jr.',
        id_puesto_buscado: 3, fecha_publicacion: null, fecha_cierre: null,
        estado_convocatoria: 'Pendiente Aprobación', id_responsable_rrhh: 'EMP002', num_postulantes: 0,
        descripcion_publica: 'Se busca Analista Jr. para el área de Reclutamiento y Selección. Ideal primer empleo.',
        requisitos_excluyentes: 'Estudiante avanzado o graduado RRHH/Psicología.', visibilidad: 'Pública'
    },
    {
        id_convocatoria: 'CONV004', titulo_convocatoria: 'Ejecutivo de Cuentas para LATAM',
        id_puesto_buscado: 4, fecha_publicacion: new Date(2024, 10, 1), fecha_cierre: new Date(2024, 11, 1),
        estado_convocatoria: 'Cerrada', id_responsable_rrhh: 'EMP007', num_postulantes: 55,
        descripcion_publica: 'Convocatoria cerrada para Ejecutivo de Cuentas.',
        requisitos_excluyentes: 'Experiencia en ventas B2B, Portugués avanzado', visibilidad: 'Pública'
    },
];

const estadosConvocatoria = ['Borrador', 'Pendiente Aprobación', 'Publicada', 'Pausada', 'Cerrada', 'Cancelada'];
const visibilidadOptions = ['Pública', 'Interna (Solo Empleados)'];

const initialFormState = {
    id_convocatoria: null, titulo_convocatoria: '', descripcion_publica: '',
    id_puesto_buscado: '', fecha_publicacion: null, fecha_cierre: null,
    estado_convocatoria: 'Borrador', id_responsable_rrhh: '', visibilidad: 'Pública',
    requisitos_excluyentes: '', requisitos_deseables: '', beneficios_ofrecidos: '',
    descripcion_interna: '',
};
// --- Fin Datos de Ejemplo ---

export default function GestionConvocatoriasAdmin() {
    const [convocatorias, setConvocatorias] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [responsablesRRHH, setResponsablesRRHH] = useState([]);
    const [filteredConvocatorias, setFilteredConvocatorias] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentConvocatoria, setCurrentConvocatoria] = useState(initialFormState);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterPuesto, setFilterPuesto] = useState('');

    useEffect(() => {
        setConvocatorias(mockInitialConvocatorias);
        setPuestos(mockPuestosTrabajo);
        setResponsablesRRHH(mockEmpleadosRRHH);
    }, []);

    useEffect(() => {
        let result = convocatorias;
        if (searchTerm) {
            result = result.filter(c => c.titulo_convocatoria.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filterEstado) {
            result = result.filter(c => c.estado_convocatoria === filterEstado);
        }
        if (filterPuesto) {
            result = result.filter(c => c.id_puesto_buscado === parseInt(filterPuesto));
        }
        setFilteredConvocatorias(result);
    }, [convocatorias, searchTerm, filterEstado, filterPuesto]);

    const getNombrePuesto = (id) => puestos.find(p => p.idPuesto === id)?.nombrePuesto || 'N/A';
    const formatDate = (date) => date ? new Date(date).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '-';

    const handleOpenDialog = (conv = null) => {
        setIsEditMode(!!conv);
        setCurrentConvocatoria(conv ? {
            ...conv,
            fecha_publicacion: conv.fecha_publicacion ? new Date(conv.fecha_publicacion) : null,
            fecha_cierre: conv.fecha_cierre ? new Date(conv.fecha_cierre) : null,
        } : initialFormState);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentConvocatoria(prev => ({ ...prev, [name]: value }));
    };
    const handleDateChange = (name, date) => {
        setCurrentConvocatoria(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = () => {
        if (!currentConvocatoria.titulo_convocatoria || !currentConvocatoria.id_puesto_buscado || !currentConvocatoria.descripcion_publica) {
            alert("Título, Puesto Buscado y Descripción Pública son obligatorios.");
            return;
        }
        if (isEditMode) {
            setConvocatorias(prev => prev.map(c => c.id_convocatoria === currentConvocatoria.id_convocatoria ? currentConvocatoria : c));
            alert("Convocatoria actualizada (simulado).");
        } else {
            const nuevaConv = { ...currentConvocatoria, id_convocatoria: `CONV${Date.now().toString().slice(-4)}`, num_postulantes: 0, fecha_creacion: new Date() };
            setConvocatorias(prev => [nuevaConv, ...prev]);
            alert("Convocatoria creada como Borrador (simulado).");
        }
        handleCloseDialog();
    };

    const handleEstadoChange = (id, nuevoEstado) => {
        setConvocatorias(prev => prev.map(c =>
            c.id_convocatoria === id ? {
                ...c,
                estado_convocatoria: nuevoEstado,
                // Si se publica y no tiene fecha, se pone la actual
                fecha_publicacion: (nuevoEstado === 'Publicada' && !c.fecha_publicacion) ? new Date() : c.fecha_publicacion,
                // Si se cierra y no tiene fecha, se pone la actual
                fecha_cierre: (nuevoEstado === 'Cerrada' && !c.fecha_cierre) ? new Date() : c.fecha_cierre,
            } : c
        ));
        alert(`Convocatoria ${id} actualizada a ${nuevoEstado} (simulado).`);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterEstado('');
        setFilterPuesto('');
    };

    const getEstadoChipColor = (estado) => {
        switch (estado) {
            case 'Publicada': return 'success';
            case 'Borrador': return 'default';
            case 'Pendiente Aprobación': return 'warning';
            case 'Cerrada': return 'secondary';
            case 'Pausada': return 'info';
            case 'Cancelada': return 'error';
            default: return 'default';
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>Gestión Global de Convocatorias</Typography>

                <Grid container spacing={2} alignItems="center" sx={{ mb: 2, p:2, border: '1px solid', borderColor:'divider', borderRadius: 1}}>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Buscar por Título..." size="small" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Estado</InputLabel>
                            <Select value={filterEstado} label="Estado" onChange={e => setFilterEstado(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {estadosConvocatoria.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                         <FormControl fullWidth size="small">
                            <InputLabel>Puesto Buscado</InputLabel>
                            <Select value={filterPuesto} label="Puesto Buscado" onChange={e => setFilterPuesto(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {puestos.map(p => <MenuItem key={p.idPuesto} value={p.idPuesto}>{p.nombrePuesto}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}><Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleClearFilters} fullWidth>Limpiar</Button></Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Crear Nueva Convocatoria</Button>
                </Box>

                <TableContainer component={Paper} elevation={2}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Título Convocatoria</TableCell>
                                <TableCell>Puesto Buscado</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Publicación</TableCell>
                                <TableCell>Cierre</TableCell>
                                <TableCell align="center">Postulantes</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredConvocatorias.map((conv) => (
                                <TableRow hover key={conv.id_convocatoria}>
                                    <TableCell sx={{fontWeight: 500}}>{conv.titulo_convocatoria}</TableCell>
                                    <TableCell>{getNombrePuesto(conv.id_puesto_buscado)}</TableCell>
                                    <TableCell><Chip label={conv.estado_convocatoria} size="small" color={getEstadoChipColor(conv.estado_convocatoria)}/></TableCell>
                                    <TableCell>{formatDate(conv.fecha_publicacion)}</TableCell>
                                    <TableCell>{formatDate(conv.fecha_cierre)}</TableCell>
                                    <TableCell align="center">{conv.num_postulantes}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Editar Convocatoria"><IconButton size="small" onClick={() => handleOpenDialog(conv)}><EditIcon /></IconButton></Tooltip>
                                        <Tooltip title="Ver Postulantes">
                                            {/* TODO: Enlazar a una vista de postulantes para ESTA convocatoria */}
                                            <IconButton size="small" component={Link} to={`/admin/convocatorias/${conv.id_convocatoria}/postulantes`}><VisibilityIcon /></IconButton>
                                        </Tooltip>
                                        {conv.estado_convocatoria === 'Borrador' && <Tooltip title="Publicar"><IconButton size="small" color="success" onClick={() => handleEstadoChange(conv.id_convocatoria, 'Publicada')}><PublishIcon/></IconButton></Tooltip>}
                                        {conv.estado_convocatoria === 'Pendiente Aprobación' && <Tooltip title="Aprobar y Publicar"><IconButton size="small" color="success" onClick={() => handleEstadoChange(conv.id_convocatoria, 'Publicada')}><CheckCircleIcon/></IconButton></Tooltip>}
                                        {conv.estado_convocatoria === 'Publicada' && <Tooltip title="Cerrar Convocatoria"><IconButton size="small" color="warning" onClick={() => handleEstadoChange(conv.id_convocatoria, 'Cerrada')}><CloseIcon/></IconButton></Tooltip>}
                                        {/* Añadir Pausar/Cancelar, etc. */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>{isEditMode ? 'Editar Convocatoria' : 'Crear Nueva Convocatoria'}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{pt:1}}>
                            <Grid item xs={12}><TextField required fullWidth label="Título de la Convocatoria" name="titulo_convocatoria" value={currentConvocatoria.titulo_convocatoria} onChange={handleChange}/></Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Puesto Buscado</InputLabel>
                                    <Select name="id_puesto_buscado" value={currentConvocatoria.id_puesto_buscado} label="Puesto Buscado" onChange={handleChange}>
                                        {puestos.map(p=><MenuItem key={p.idPuesto} value={p.idPuesto}>{p.nombrePuesto}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Responsable RRHH (Opcional)</InputLabel>
                                    <Select name="id_responsable_rrhh" value={currentConvocatoria.id_responsable_rrhh} label="Responsable RRHH (Opcional)" onChange={handleChange}>
                                        <MenuItem value=""><em>Ninguno Asignado</em></MenuItem>
                                        {responsablesRRHH.map(r=><MenuItem key={r.id_empleado} value={r.id_empleado}>{r.nombreCompleto}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}><TextField required fullWidth multiline rows={4} label="Descripción Pública (para candidatos)" name="descripcion_publica" value={currentConvocatoria.descripcion_publica} onChange={handleChange}/></Grid>
                            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Requisitos Excluyentes" name="requisitos_excluyentes" value={currentConvocatoria.requisitos_excluyentes} onChange={handleChange} helperText="Separar por comas o uno por línea"/></Grid>
                            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Requisitos Deseables (Opcional)" name="requisitos_deseables" value={currentConvocatoria.requisitos_deseables} onChange={handleChange}/></Grid>
                            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Beneficios Ofrecidos (Opcional)" name="beneficios_ofrecidos" value={currentConvocatoria.beneficios_ofrecidos} onChange={handleChange}/></Grid>
                            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Descripción Interna / Notas (Opcional)" name="descripcion_interna" value={currentConvocatoria.descripcion_interna} onChange={handleChange}/></Grid>
                            <Grid item xs={12} sm={6}>
                                <DateTimePicker label="Fecha Publicación (Opcional)" value={currentConvocatoria.fecha_publicacion} onChange={(d)=>handleDateChange('fecha_publicacion', d)} slotProps={{textField:{fullWidth:true, helperText:"Si vacía, se publica al cambiar estado"}}}/></Grid>
                            <Grid item xs={12} sm={6}>
                                <DateTimePicker label="Fecha Cierre (Opcional)" value={currentConvocatoria.fecha_cierre} onChange={(d)=>handleDateChange('fecha_cierre', d)} slotProps={{textField:{fullWidth:true, helperText:"Si vacía, se cierra manualmente"}}}/></Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Estado</InputLabel>
                                    <Select name="estado_convocatoria" value={currentConvocatoria.estado_convocatoria} label="Estado" onChange={handleChange}>
                                        {estadosConvocatoria.map(e=><MenuItem key={e} value={e}>{e}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Visibilidad</InputLabel>
                                    <Select name="visibilidad" value={currentConvocatoria.visibilidad} label="Visibilidad" onChange={handleChange}>
                                        {visibilidadOptions.map(v=><MenuItem key={v} value={v}>{v}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{p:'16px 24px'}}>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">{isEditMode ? 'Guardar Cambios' : 'Crear Convocatoria'}</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </LocalizationProvider>
    );
}