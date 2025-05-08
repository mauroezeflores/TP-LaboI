import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, Button, Box, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Switch, FormControlLabel, Select,
    MenuItem, InputLabel, FormControl, Chip, Tooltip, Grid, Stepper, Step,
    StepLabel, StepContent, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale/es';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import CloseIcon from '@mui/icons-material/Close';
import AssessmentIcon from '@mui/icons-material/Assessment'; // Resultados
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import ShortTextIcon from '@mui/icons-material/ShortText';
import SubjectIcon from '@mui/icons-material/Subject'; // Texto largo

// --- Datos de Ejemplo (Mocks) ---
const mockEncuestas = [
    {
        id_encuesta: 'ENC001', titulo: 'Clima Laboral Q1 2025', descripcion: 'Encuesta trimestral sobre satisfacción y ambiente de trabajo.',
        fecha_creacion: new Date(2025, 0, 10), fecha_inicio_publicacion: new Date(2025, 0, 15, 9, 0),
        fecha_fin_publicacion: new Date(2025, 0, 31, 18, 0), estado: 'Cerrada', es_anonima: true,
        audiencia_tipo: 'Todos', audiencia_ids: [], creada_por: 'Admin',
        participacion: { respondieron: 135, total_audiencia: 150 }, // Simulado
        preguntas: [{id:1, texto:'Satisfacción General', tipo:'EscalaLikert'}, {id:2, texto:'Sugerencias', tipo:'TextoLibre'}]
    },
    {
        id_encuesta: 'ENC002', titulo: 'Feedback sobre Nuevas Oficinas', descripcion: 'Opiniones sobre las instalaciones recientemente inauguradas.',
        fecha_creacion: new Date(2025, 3, 1), fecha_inicio_publicacion: new Date(2025, 3, 5, 9, 0),
        fecha_fin_publicacion: new Date(2025, 3, 15, 18, 0), estado: 'Publicada', es_anonima: false,
        audiencia_tipo: 'Departamento', audiencia_ids: [1, 4], // IDs de Dpto Tecnología y Marketing
        creada_por: 'Gerente RRHH', participacion: { respondieron: 45, total_audiencia: 60 },
        preguntas: [{id:3, texto:'Valoración espacio', tipo:'EscalaLikert'}, {id:4, texto:'Comodidad sillas', tipo:'SeleccionUnica'}, {id:5, texto:'Aspectos a mejorar', tipo:'TextoLibre'}]
    },
     {
        id_encuesta: 'ENC003', titulo: 'Preferencias de Capacitación 2025', descripcion: 'Sondeo sobre intereses de formación.',
        fecha_creacion: new Date(2025, 4, 1), fecha_inicio_publicacion: null,
        fecha_fin_publicacion: null, estado: 'Borrador', es_anonima: false,
        audiencia_tipo: 'Todos', audiencia_ids: [], creada_por: 'Admin',
        participacion: null,
        preguntas: []
    },
];

const tiposPregunta = [
    { value: 'TextoLibre', label: 'Respuesta Corta', icon: <ShortTextIcon /> },
    { value: 'TextoLargo', label: 'Párrafo Largo', icon: <SubjectIcon /> },
    { value: 'SeleccionUnica', label: 'Opción Múltiple (una respuesta)', icon: <RadioButtonCheckedIcon /> },
    { value: 'SeleccionMultiple', label: 'Casillas de Verificación (varias respuestas)', icon: <CheckBoxIcon /> },
    { value: 'EscalaLikert', label: 'Escala Lineal (Likert 1-5)', icon: <LinearScaleIcon /> },
    // Se podrían añadir más tipos como Numérica, Fecha, etc.
];

const initialEncuestaForm = {
    id_encuesta: null, titulo: '', descripcion: '',
    fecha_inicio_publicacion: null, fecha_fin_publicacion: null,
    estado: 'Borrador', es_anonima: true,
    audiencia_tipo: 'Todos', audiencia_ids: [],
    preguntas: [],
};

const initialPreguntaForm = {
    id_pregunta: null, // Se generará
    texto_pregunta: '',
    tipo_pregunta: 'TextoLibre', // Default
    opciones: [], // [{ id_opcion: 1, texto_opcion: 'Opción A' }, ...]
    es_obligatoria: false,
    orden: 0,
};
// --- Fin Datos de Ejemplo ---

export default function GestionEncuestasAdmin() {
    const [encuestas, setEncuestas] = useState([]);
    const [filteredEncuestas, setFilteredEncuestas] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEncuesta, setCurrentEncuesta] = useState(initialEncuestaForm);
    const [activeStep, setActiveStep] = useState(0); // Para el Stepper del diálogo
    const [currentPregunta, setCurrentPregunta] = useState(initialPreguntaForm); // Para añadir/editar preguntas

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    useEffect(() => {
        setEncuestas(mockEncuestas);
    }, []);

    useEffect(() => {
        let result = encuestas;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(e => e.titulo.toLowerCase().includes(lowerSearchTerm));
        }
        if (filterEstado) {
            result = result.filter(e => e.estado === filterEstado);
        }
        setFilteredEncuestas(result);
    }, [encuestas, searchTerm, filterEstado]);

    const handleOpenDialog = (encuesta = null) => {
        setIsEditMode(!!encuesta);
        setCurrentEncuesta(encuesta ? {
             ...encuesta,
             fecha_inicio_publicacion: encuesta.fecha_inicio_publicacion ? new Date(encuesta.fecha_inicio_publicacion) : null,
             fecha_fin_publicacion: encuesta.fecha_fin_publicacion ? new Date(encuesta.fecha_fin_publicacion) : null,
             preguntas: encuesta.preguntas || [], // Asegurar que preguntas sea un array
        } : { ...initialEncuestaForm, preguntas: [] }); // Empezar con preguntas vacías
        setActiveStep(0);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCurrentEncuesta(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDateChange = (name, date) => {
        setCurrentEncuesta(prev => ({ ...prev, [name]: date }));
    };

    // --- Lógica del Stepper ---
    const handleNextStep = () => setActiveStep((prev) => prev + 1);
    const handleBackStep = () => setActiveStep((prev) => prev - 1);

    // --- Lógica para Preguntas (Simplificada) ---
    const handleAddPregunta = () => {
         // Validación simple de la pregunta actual
         if (!currentPregunta.texto_pregunta.trim()) {
             alert("El texto de la pregunta no puede estar vacío.");
             return;
         }
         if (['SeleccionUnica', 'SeleccionMultiple'].includes(currentPregunta.tipo_pregunta) && currentPregunta.opciones.length < 2) {
             alert("Las preguntas de opción múltiple o única deben tener al menos 2 opciones.");
             return;
         }

        setCurrentEncuesta(prev => ({
            ...prev,
            preguntas: [
                ...prev.preguntas,
                { ...currentPregunta, id_pregunta: `P${Date.now()}`, orden: prev.preguntas.length + 1 }
            ]
        }));
        // Resetear formulario de pregunta
        setCurrentPregunta({ ...initialPreguntaForm, opciones: [] });
    };

    const handleRemovePregunta = (indexToRemove) => {
        setCurrentEncuesta(prev => ({
            ...prev,
            preguntas: prev.preguntas.filter((_, index) => index !== indexToRemove)
                        .map((p, i) => ({ ...p, orden: i + 1 })) // Reordenar
        }));
    };
    
    const handlePreguntaChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCurrentPregunta(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
             // Limpiar opciones si cambiamos a un tipo que no las usa
             opciones: ['SeleccionUnica', 'SeleccionMultiple'].includes(value) && name === 'tipo_pregunta' ? prev.opciones : 
                       !['SeleccionUnica', 'SeleccionMultiple'].includes(prev.tipo_pregunta) && name === 'tipo_pregunta' ? [] : prev.opciones
        }));
    };

    const handleAddOpcionPregunta = () => {
        setCurrentPregunta(prev => ({
            ...prev,
            opciones: [...(prev.opciones || []), { id_opcion: `Opt${Date.now()}`, texto_opcion: '' }]
        }));
    };

    const handleOpcionPreguntaChange = (index, event) => {
        const { value } = event.target;
        setCurrentPregunta(prev => ({
            ...prev,
            opciones: prev.opciones.map((opt, i) => i === index ? { ...opt, texto_opcion: value } : opt)
        }));
    };
    
    const handleRemoveOpcionPregunta = (indexToRemove) => {
        setCurrentPregunta(prev => ({
            ...prev,
            opciones: prev.opciones.filter((_, i) => i !== indexToRemove)
        }));
    };

    // --- Lógica de Acciones Principales ---
    const handleSubmitEncuesta = () => {
        if (!currentEncuesta.titulo) {
             alert("El título de la encuesta es obligatorio.");
             setActiveStep(0); // Volver al primer paso
             return;
        }
         if (currentEncuesta.preguntas.length === 0) {
             alert("La encuesta debe tener al menos una pregunta.");
              setActiveStep(1); // Ir al paso de preguntas
             return;
        }
        
        if (isEditMode) {
            setEncuestas(prev => prev.map(e => e.id_encuesta === currentEncuesta.id_encuesta ? currentEncuesta : e));
            alert("Encuesta actualizada exitosamente (simulado).");
        } else {
            const nuevaEncuesta = { ...currentEncuesta, id_encuesta: `ENC${Date.now().toString().slice(-4)}`, fecha_creacion: new Date(), creada_por: 'Admin' };
            setEncuestas(prev => [nuevaEncuesta, ...prev]);
            alert("Encuesta creada exitosamente (simulado).");
        }
        handleCloseDialog();
    };

    const handlePublicar = (id) => {
         setEncuestas(prev => prev.map(e => e.id_encuesta === id ? { ...e, estado: 'Publicada', fecha_inicio_publicacion: e.fecha_inicio_publicacion || new Date() } : e));
         alert(`Encuesta ${id} publicada (simulado).`);
    };
    const handleCerrar = (id) => {
         setEncuestas(prev => prev.map(e => e.id_encuesta === id ? { ...e, estado: 'Cerrada', fecha_fin_publicacion: e.fecha_fin_publicacion || new Date() } : e));
         alert(`Encuesta ${id} cerrada (simulado).`);
    };
    const handleArchivar = (id) => {
         setEncuestas(prev => prev.map(e => e.id_encuesta === id ? { ...e, estado: 'Archivada' } : e));
         alert(`Encuesta ${id} archivada (simulado).`);
    };
    const handleVerResultados = (id) => {
         alert(`Navegando a resultados de encuesta ${id} (simulado).`);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Encuestas
                </Typography>

                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={5}>
                        <TextField fullWidth label="Buscar encuesta por título..." variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filtrar por Estado</InputLabel>
                            <Select value={filterEstado} label="Filtrar por Estado" onChange={(e) => setFilterEstado(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                <MenuItem value="Borrador">Borrador</MenuItem>
                                <MenuItem value="Publicada">Publicada</MenuItem>
                                <MenuItem value="Cerrada">Cerrada</MenuItem>
                                <MenuItem value="Archivada">Archivada</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ textAlign: {md: 'right', xs: 'left'} }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} fullWidth>
                            Crear Nueva Encuesta
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} elevation={2}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Título</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Publicación</TableCell>
                                <TableCell>Participación</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEncuestas.length > 0 ? filteredEncuestas.map((enc) => (
                                <TableRow hover key={enc.id_encuesta}>
                                    <TableCell>{enc.titulo}</TableCell>
                                    <TableCell><Chip label={enc.estado} size="small" color={
                                        enc.estado === 'Publicada' ? 'success' : enc.estado === 'Cerrada' ? 'default' : enc.estado === 'Borrador' ? 'warning' : 'secondary'
                                    } /></TableCell>
                                    <TableCell>
                                        {enc.fecha_inicio_publicacion ? new Date(enc.fecha_inicio_publicacion).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                                        {' / '}
                                        {enc.fecha_fin_publicacion ? new Date(enc.fecha_fin_publicacion).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {enc.participacion ? `${enc.participacion.respondieron} / ${enc.participacion.total_audiencia}` : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                        {enc.estado === 'Borrador' && (
                                            <Tooltip title="Editar Encuesta"><IconButton size="small" onClick={() => handleOpenDialog(enc)}><EditIcon /></IconButton></Tooltip>
                                        )}
                                        {enc.estado === 'Borrador' && (
                                            <Tooltip title="Publicar"><IconButton size="small" color="success" onClick={() => handlePublicar(enc.id_encuesta)}><PublishIcon /></IconButton></Tooltip>
                                        )}
                                        {enc.estado === 'Publicada' && (
                                            <Tooltip title="Cerrar Encuesta"><IconButton size="small" color="warning" onClick={() => handleCerrar(enc.id_encuesta)}><CloseIcon /></IconButton></Tooltip>
                                        )}
                                        {(enc.estado === 'Publicada' || enc.estado === 'Cerrada') && (
                                            <Tooltip title="Ver Resultados"><IconButton size="small" color="info" onClick={() => handleVerResultados(enc.id_encuesta)}><AssessmentIcon /></IconButton></Tooltip>
                                        )}
                                         {(enc.estado === 'Cerrada') && (
                                            <Tooltip title="Archivar"><IconButton size="small" onClick={() => handleArchivar(enc.id_encuesta)}><ArchiveIcon /></IconButton></Tooltip>
                                        )}
                                        {/* Se podría añadir un botón de eliminar si es necesario */}
                                         {/* <Tooltip title="Eliminar"><IconButton size="small" color="error"><DeleteIcon /></IconButton></Tooltip> */}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={5} align="center">No se encontraron encuestas.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* --- DIALOGO PARA CREAR/EDITAR ENCUESTA --- */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>{isEditMode ? 'Editar Encuesta' : 'Crear Nueva Encuesta'}</DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep} orientation="vertical">
                             {/* --- Paso 1: Información General --- */}
                            <Step key="info-general">
                                <StepLabel>Información General y Configuración</StepLabel>
                                <StepContent>
                                    <Grid container spacing={2} sx={{mt: 1}}>
                                        <Grid item xs={12}><TextField fullWidth label="Título de la Encuesta *" name="titulo" value={currentEncuesta.titulo} onChange={handleChange} /></Grid>
                                        <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Descripción (Opcional)" name="descripcion" value={currentEncuesta.descripcion} onChange={handleChange} /></Grid>
                                        <Grid item xs={12} sm={6}>
                                            <DateTimePicker label="Fecha Inicio Publicación (Opcional)" value={currentEncuesta.fecha_inicio_publicacion} onChange={(d) => handleDateChange('fecha_inicio_publicacion', d)} slotProps={{textField: {fullWidth: true, helperText: 'Si no se pone, se publica al Publicar'}}}/>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <DateTimePicker label="Fecha Fin Publicación (Opcional)" value={currentEncuesta.fecha_fin_publicacion} onChange={(d) => handleDateChange('fecha_fin_publicacion', d)} slotProps={{textField: {fullWidth: true, helperText: 'Si no se pone, se cierra manualmente'}}}/>
                                        </Grid>
                                         <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Audiencia</InputLabel>
                                                <Select name="audiencia_tipo" value={currentEncuesta.audiencia_tipo} label="Audiencia" onChange={handleChange}>
                                                    <MenuItem value="Todos">Todos los Empleados</MenuItem>
                                                    <MenuItem value="Departamento">Por Departamento(s)</MenuItem>
                                                    <MenuItem value="Puesto">Por Puesto(s) de Trabajo</MenuItem>
                                                    <MenuItem value="Manual">Selección Manual de Empleados</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:'center'}}>
                                            <FormControlLabel control={<Switch checked={currentEncuesta.es_anonima} onChange={handleChange} name="es_anonima" />} label="Encuesta Anónima"/>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="contained" onClick={handleNextStep}>Siguiente (Preguntas)</Button>
                                    </Box>
                                </StepContent>
                            </Step>
                            {/* --- Paso 2: Preguntas --- */}
                            <Step key="preguntas">
                                <StepLabel>Definir Preguntas</StepLabel>
                                <StepContent>
                                     <Typography variant="h6" gutterBottom>Preguntas Actuales:</Typography>
                                    {currentEncuesta.preguntas.length > 0 ? (
                                        <List dense>
                                            {currentEncuesta.preguntas.map((p, index) => (
                                                <ListItem key={p.id_pregunta || index} secondaryAction={
                                                    <IconButton edge="end" size="small" onClick={() => handleRemovePregunta(index)}><DeleteIcon fontSize="small"/></IconButton>
                                                }>
                                                    <ListItemText primary={`${p.orden}. ${p.texto_pregunta}`} secondary={`Tipo: ${tiposPregunta.find(t => t.value === p.tipo_pregunta)?.label || p.tipo_pregunta} ${p.es_obligatoria ? '(Obligatoria)' : ''}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : <Typography variant="body2" sx={{mb:2}}>Aún no hay preguntas.</Typography> }

                                    <Divider sx={{my:2}}/>

                                    <Typography variant="h6" gutterBottom>Añadir Nueva Pregunta:</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Texto de la Pregunta *" name="texto_pregunta" value={currentPregunta.texto_pregunta} onChange={handlePreguntaChange} /></Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Tipo de Pregunta</InputLabel>
                                                <Select name="tipo_pregunta" value={currentPregunta.tipo_pregunta} label="Tipo de Pregunta" onChange={handlePreguntaChange}>
                                                    {tiposPregunta.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                         <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:'center'}}>
                                            <FormControlLabel control={<Switch checked={currentPregunta.es_obligatoria} onChange={handlePreguntaChange} name="es_obligatoria" />} label="Es Obligatoria"/>
                                        </Grid>

                                        {/* Opciones para tipos Selección Única/Múltiple */}
                                        {['SeleccionUnica', 'SeleccionMultiple'].includes(currentPregunta.tipo_pregunta) && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{mb:1}}>Opciones de Respuesta:</Typography>
                                                {currentPregunta.opciones?.map((opt, index) => (
                                                    <Box key={opt.id_opcion || index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <TextField fullWidth size="small" label={`Opción ${index + 1}`} value={opt.texto_opcion} onChange={(e) => handleOpcionPreguntaChange(index, e)}/>
                                                        <IconButton size="small" color="error" onClick={() => handleRemoveOpcionPregunta(index)}><RemoveCircleOutlineIcon/></IconButton>
                                                    </Box>
                                                ))}
                                                <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAddOpcionPregunta}>Añadir Opción</Button>
                                            </Grid>
                                        )}
                                        {/* Placeholder para Escala Likert si se quiere configurar textos */}
                                         {currentPregunta.tipo_pregunta === 'EscalaLikert' && (
                                             <Grid item xs={12}>
                                                 <Typography variant="caption">Escala Likert de 1 a 5 (configurable en el futuro si se necesita).</Typography>
                                             </Grid>
                                         )}


                                        <Grid item xs={12} sx={{textAlign: 'right'}}>
                                             <Button variant="outlined" onClick={handleAddPregunta}>Añadir Pregunta a la Lista</Button>
                                        </Grid>
                                    </Grid>


                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                        <Button onClick={handleBackStep}>Atrás</Button>
                                        {/* El botón final de guardar estaría fuera del Stepper */}
                                    </Box>
                                </StepContent>
                            </Step>
                        </Stepper>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleSubmitEncuesta} variant="contained" color="primary" disabled={activeStep !== 1}> {/* Sólo se puede guardar desde el paso de preguntas */}
                            {isEditMode ? 'Guardar Cambios Encuesta' : 'Crear Encuesta'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </LocalizationProvider>
    );
}