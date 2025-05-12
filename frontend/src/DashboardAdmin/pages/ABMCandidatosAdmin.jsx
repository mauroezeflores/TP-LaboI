import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, Button, Box, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Switch, FormControlLabel, Select,
    MenuItem, InputLabel, FormControl, Chip, Tooltip, Grid, Avatar, Tabs, Tab,
    List, ListItem, ListItemText, ListItemAvatar, Divider, Link
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale/es'; // Importar locale español
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkIcon from '@mui/icons-material/Work'; // Portfolio / CV
import SchoolIcon from '@mui/icons-material/School'; // Educación
import ConstructionIcon from '@mui/icons-material/Construction'; // Habilidades
import HistoryIcon from '@mui/icons-material/History'; // Experiencia Laboral
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'; // Postulaciones

// --- Datos de Ejemplo (Mocks) ---
const mockEstadosPostulanteGeneral = [
    { id: 1, nombre: 'Nuevo' },
    { id: 2, nombre: 'En Revisión por RRHH' },
    { id: 3, nombre: 'Preseleccionado' },
    { id: 4, nombre: 'Contactado' },
    { id: 5, nombre: 'En Proceso de Entrevista' },
    { id: 6, nombre: 'Oferta Realizada' },
    { id: 7, nombre: 'Contratado (Convertir a Empleado)' },
    { id: 8, nombre: 'Descartado General' },
    { id: 9, nombre: 'Archivado' },
];

const mockHabilidadesMaestro = [
    { id: 1, nombre: 'React', tipo: 'Técnica' }, { id: 2, nombre: 'Node.js', tipo: 'Técnica' },
    { id: 3, nombre: 'Comunicación Efectiva', tipo: 'Blanda' }, { id: 4, nombre: 'Trabajo en Equipo', tipo: 'Blanda' },
    { id: 5, nombre: 'SQL', tipo: 'Técnica' }, { id: 6, nombre: 'Project Management', tipo: 'Gestión' },
];

const mockInitialCandidatos = [
    {
        id_postulante: 'POST001', nombre: 'Elena', apellido: 'Nito', email: 'elena.nito@example.com',
        telefono: '11-2233-4455', linkedin_url: 'https://linkedin.com/in/elenanito', github_url: 'https://github.com/elenanito',
        portfolio_url: 'https://elenanito.dev', cv_adjunto_url: '/cvs/elena_nito_cv.pdf',
        fecha_registro: new Date(2024, 0, 15), id_estado_postulante_general: 1,
        habilidades: [
            { id_habilidad: 1, nivel_experiencia: 'Avanzado' },
            { id_habilidad: 3, nivel_experiencia: 'Intermedio' }
        ],
        educacion: [
            { id_educacion: 1, institucion: 'Universidad de la Web', titulo: 'Lic. en Desarrollo Web', fecha_inicio: new Date(2018, 2, 1), fecha_fin: new Date(2022, 11, 20), descripcion: 'Especialización en Frontend.' }
        ],
        experiencia_laboral: [
            { id_experiencia_laboral: 1, empresa: 'Tech Solutions SA', puesto: 'Desarrolladora Frontend Jr.', fecha_inicio: new Date(2023, 0, 10), fecha_fin: null, descripcion_responsabilidades: 'Desarrollo y mantenimiento de interfaces de usuario.' }
        ],
        postulaciones: [
            { id_postulante_convocatoria: 'PC001', id_convocatoria: 'CONV001', nombre_convocatoria: 'Desarrollador Frontend Sr.', fecha_postulacion: new Date(2024, 0, 20), estado_especifico: 'CV Recibido' }
        ]
    },
    {
        id_postulante: 'POST002', nombre: 'Armando', apellido: 'Bronca Segura', email: 'armando.bronca@example.com',
        telefono: '11-6677-8899', linkedin_url: 'https://linkedin.com/in/armandobronca', github_url: '',
        portfolio_url: '', cv_adjunto_url: '/cvs/armando_bronca_cv.docx',
        fecha_registro: new Date(2023, 11, 1), id_estado_postulante_general: 3,
        habilidades: [
            { id_habilidad: 2, nivel_experiencia: 'Senior' },
            { id_habilidad: 5, nivel_experiencia: 'Avanzado' },
            { id_habilidad: 6, nivel_experiencia: 'Intermedio'}
        ],
        educacion: [
            { id_educacion: 2, institucion: 'Instituto Coder', titulo: 'Bootcamp Fullstack', fecha_inicio: new Date(2020, 0, 1), fecha_fin: new Date(2020, 5, 30), descripcion: 'Desarrollo web intensivo.' }
        ],
        experiencia_laboral: [
            { id_experiencia_laboral: 2, empresa: 'Innovatec', puesto: 'Backend Developer', fecha_inicio: new Date(2020, 6, 1), fecha_fin: new Date(2023, 10, 1), descripcion_responsabilidades: 'API Rest y bases de datos.' }
        ],
        postulaciones: [
            { id_postulante_convocatoria: 'PC002', id_convocatoria: 'CONV002', nombre_convocatoria: 'Backend Team Lead', fecha_postulacion: new Date(2023, 11, 5), estado_especifico: 'En Entrevista Técnica' },
            { id_postulante_convocatoria: 'PC003', id_convocatoria: 'CONV003', nombre_convocatoria: 'Arquitecto de Software', fecha_postulacion: new Date(2024, 1, 1), estado_especifico: 'Preseleccionado' }
        ]
    },
];

const initialCandidatoForm = {
    id_postulante: null, nombre: '', apellido: '', email: '', telefono: '',
    linkedin_url: '', github_url: '', portfolio_url: '', cv_adjunto_url: '',
    fecha_registro: new Date(), id_estado_postulante_general: 1, // Por defecto 'Nuevo'
    habilidades: [], educacion: [], experiencia_laboral: [], postulaciones: []
};

// --- Fin Datos de Ejemplo ---

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`candidato-tabpanel-${index}`} aria-labelledby={`candidato-tab-${index}`} {...other}>
            {value === index && (<Box sx={{ p: 3 }}>{children}</Box>)}
        </div>
    );
}

export default function ABMCandidatosAdmin() {
    const [candidatos, setCandidatos] = useState([]);
    const [estadosPostulante, setEstadosPostulante] = useState([]);
    const [habilidadesMaestro, setHabilidadesMaestro] = useState([]);
    const [filteredCandidatos, setFilteredCandidatos] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCandidato, setCurrentCandidato] = useState(initialCandidatoForm);
    const [viewMode, setViewMode] = useState(false);
    const [dialogTabValue, setDialogTabValue] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    useEffect(() => {
        setCandidatos(mockInitialCandidatos);
        setEstadosPostulante(mockEstadosPostulanteGeneral);
        setHabilidadesMaestro(mockHabilidadesMaestro);
    }, []);

    useEffect(() => {
        let result = candidatos;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.nombre.toLowerCase().includes(lowerSearchTerm) ||
                c.apellido.toLowerCase().includes(lowerSearchTerm) ||
                c.email.toLowerCase().includes(lowerSearchTerm)
            );
        }
        if (filterEstado) {
            result = result.filter(c => c.id_estado_postulante_general === parseInt(filterEstado));
        }
        setFilteredCandidatos(result);
    }, [candidatos, searchTerm, filterEstado]);

    const getNombreEstado = (id) => estadosPostulante.find(e => e.id === id)?.nombre || 'N/A';
    const getNombreHabilidad = (id) => habilidadesMaestro.find(h => h.id === id)?.nombre || 'Desconocida';

    const handleOpenDialog = (candidato = null, isView = false) => {
        setViewMode(isView);
        setIsEditMode(!!candidato);
        setCurrentCandidato(candidato ? { ...candidato, fecha_registro: new Date(candidato.fecha_registro) } : { ...initialCandidatoForm, fecha_registro: new Date() });
        setDialogTabValue(0); // Reset tab to first
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCandidato(initialCandidatoForm);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCurrentCandidato(prev => ({ ...prev, [name]: value }));
    };
    
    const handleDateChange = (name, date) => {
        setCurrentCandidato(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = () => {
        if (!currentCandidato.nombre || !currentCandidato.apellido || !currentCandidato.email) {
            alert("Nombre, Apellido y Email son obligatorios.");
            return;
        }
        if (isEditMode) {
            setCandidatos(prev => prev.map(c => c.id_postulante === currentCandidato.id_postulante ? currentCandidato : c));
            alert("Candidato actualizado exitosamente (simulado).");
        } else {
            const nuevoCandidato = {
                ...currentCandidato,
                id_postulante: `POST${Date.now().toString().slice(-4)}`,
            };
            setCandidatos(prev => [nuevoCandidato, ...prev]);
            alert("Candidato creado exitosamente (simulado).");
        }
        handleCloseDialog();
    };
    
    const handleDialogTabChange = (event, newValue) => {
        setDialogTabValue(newValue);
    };

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('es-AR') : 'N/A';
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    ABM de Talentos/Candidatos
                </Typography>

                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField fullWidth label="Buscar candidato..." variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{endAdornment: <PersonSearchIcon/>}}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filtrar por Estado</InputLabel>
                            <Select value={filterEstado} label="Filtrar por Estado" onChange={(e) => setFilterEstado(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {estadosPostulante.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: {md: 'right', xs: 'left'} }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog(null, false)} fullWidth>
                            Registrar Candidato
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} elevation={2}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre Completo</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Estado General</TableCell>
                                <TableCell>Fecha Registro</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCandidatos.length > 0 ? filteredCandidatos.map((cand) => (
                                <TableRow hover key={cand.id_postulante}>
                                    <TableCell>{cand.nombre} {cand.apellido}</TableCell>
                                    <TableCell>{cand.email}</TableCell>
                                    <TableCell>{cand.telefono || '-'}</TableCell>
                                    <TableCell><Chip label={getNombreEstado(cand.id_estado_postulante_general)} size="small" /></TableCell>
                                    <TableCell>{formatDate(cand.fecha_registro)}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Ver Detalles">
                                            <IconButton size="small" onClick={() => handleOpenDialog(cand, true)}><VisibilityIcon /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar Candidato">
                                            <IconButton size="small" onClick={() => handleOpenDialog(cand, false)}><EditIcon /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={6} align="center">No se encontraron candidatos.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {viewMode ? <VisibilityIcon /> : isEditMode ? <EditIcon /> : <AddIcon />}
                        {viewMode ? 'Detalles del Candidato' : isEditMode ? 'Editar Candidato' : 'Registrar Nuevo Candidato'}
                    </DialogTitle>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={dialogTabValue} onChange={handleDialogTabChange} aria-label="Detalles candidato tabs" variant="scrollable" scrollButtons="auto">
                            <Tab label="Información Personal" icon={<AssignmentIndIcon />} iconPosition="start" id="candidato-tab-0" aria-controls="candidato-tabpanel-0" />
                            <Tab label="Perfil Profesional" icon={<WorkIcon />} iconPosition="start" id="candidato-tab-1" aria-controls="candidato-tabpanel-1" />
                            <Tab label="Habilidades" icon={<ConstructionIcon />} iconPosition="start" id="candidato-tab-2" aria-controls="candidato-tabpanel-2" />
                            <Tab label="Educación" icon={<SchoolIcon />} iconPosition="start" id="candidato-tab-3" aria-controls="candidato-tabpanel-3" />
                            <Tab label="Experiencia Laboral" icon={<HistoryIcon />} iconPosition="start" id="candidato-tab-4" aria-controls="candidato-tabpanel-4" />
                            <Tab label="Postulaciones" icon={<AssignmentIndIcon />} iconPosition="start" id="candidato-tab-5" aria-controls="candidato-tabpanel-5" />
                        </Tabs>
                    </Box>
                    <DialogContent>
                        <TabPanel value={dialogTabValue} index={0}> {/* Información Personal */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}><TextField label="Nombre *" name="nombre" value={currentCandidato.nombre} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} /></Grid>
                                <Grid item xs={12} sm={6}><TextField label="Apellido *" name="apellido" value={currentCandidato.apellido} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} /></Grid>
                                <Grid item xs={12} sm={6}><TextField label="Email *" name="email" type="email" value={currentCandidato.email} onChange={handleChange} fullWidth margin="dense" disabled={isEditMode || viewMode} /></Grid>
                                <Grid item xs={12} sm={6}><TextField label="Teléfono" name="telefono" value={currentCandidato.telefono} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} /></Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="dense" required>
                                        <InputLabel>Estado General *</InputLabel>
                                        <Select name="id_estado_postulante_general" value={currentCandidato.id_estado_postulante_general} label="Estado General *" onChange={handleChange} disabled={viewMode}>
                                            {estadosPostulante.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker label="Fecha Registro" value={currentCandidato.fecha_registro} onChange={(date) => handleDateChange('fecha_registro', date)} slotProps={{ textField: { fullWidth: true, margin: "dense", helperText: "DD/MM/AAAA" } }} disabled={isEditMode || viewMode}/>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={dialogTabValue} index={1}> {/* Perfil Profesional */}
                             <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}><TextField label="LinkedIn URL" name="linkedin_url" value={currentCandidato.linkedin_url} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} InputProps={{startAdornment: <LinkedInIcon sx={{mr:1}}/>}}/></Grid>
                                <Grid item xs={12} sm={6}><TextField label="GitHub URL" name="github_url" value={currentCandidato.github_url} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} InputProps={{startAdornment: <GitHubIcon sx={{mr:1}}/>}} /></Grid>
                                <Grid item xs={12} sm={6}><TextField label="Portfolio URL" name="portfolio_url" value={currentCandidato.portfolio_url} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} /></Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="CV Adjunto URL" name="cv_adjunto_url" value={currentCandidato.cv_adjunto_url} onChange={handleChange} fullWidth margin="dense" disabled={viewMode} helperText={viewMode && currentCandidato.cv_adjunto_url ? "Ver CV" : "Ingrese URL o se simulará subida"} 
                                        InputProps={{ endAdornment: viewMode && currentCandidato.cv_adjunto_url ? <IconButton component={Link} href={currentCandidato.cv_adjunto_url} target="_blank"><VisibilityIcon /></IconButton> : null }}
                                    />
                                    {/* En un caso real, aquí iría un componente de subida de archivos */}
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={dialogTabValue} index={2}> {/* Habilidades */}
                            <Typography variant="subtitle1" gutterBottom>Habilidades del Candidato</Typography>
                            {(!viewMode && !isEditMode) && <Typography variant="caption" display="block" gutterBottom>Las habilidades se podrán agregar/editar una vez creado el candidato.</Typography> }
                            {(viewMode || isEditMode) && currentCandidato.habilidades?.length > 0 ? (
                                <List dense>
                                    {currentCandidato.habilidades.map(h => (
                                        <ListItem key={h.id_habilidad}>
                                            <ListItemText primary={getNombreHabilidad(h.id_habilidad)} secondary={`Nivel: ${h.nivel_experiencia || 'No especificado'}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : <Typography>No hay habilidades registradas.</Typography>}
                            {/* Aquí iría un ABM de habilidades para el candidato si no es viewMode */}
                        </TabPanel>
                        <TabPanel value={dialogTabValue} index={3}> {/* Educación */}
                            <Typography variant="subtitle1" gutterBottom>Historial Educativo</Typography>
                             {(!viewMode && !isEditMode) && <Typography variant="caption" display="block" gutterBottom>La educación se podrá agregar/editar una vez creado el candidato.</Typography> }
                            {(viewMode || isEditMode) && currentCandidato.educacion?.length > 0 ? (
                                <List>
                                    {currentCandidato.educacion.map(edu => (
                                        <React.Fragment key={edu.id_educacion}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar><SchoolIcon /></ListItemAvatar>
                                                <ListItemText primary={`${edu.titulo} en ${edu.institucion}`} secondary={`${formatDate(edu.fecha_inicio)} - ${edu.fecha_fin ? formatDate(edu.fecha_fin) : 'Actualidad'}. ${edu.descripcion || ''}`} />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : <Typography>No hay historial educativo registrado.</Typography>}
                        </TabPanel>
                        <TabPanel value={dialogTabValue} index={4}> {/* Experiencia Laboral */}
                             <Typography variant="subtitle1" gutterBottom>Experiencia Laboral</Typography>
                             {(!viewMode && !isEditMode) && <Typography variant="caption" display="block" gutterBottom>La experiencia laboral se podrá agregar/editar una vez creado el candidato.</Typography> }
                            {(viewMode || isEditMode) && currentCandidato.experiencia_laboral?.length > 0 ? (
                                <List>
                                    {currentCandidato.experiencia_laboral.map(exp => (
                                        <React.Fragment key={exp.id_experiencia_laboral}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar><HistoryIcon /></ListItemAvatar>
                                                <ListItemText primary={`${exp.puesto} en ${exp.empresa}`} secondary={`${formatDate(exp.fecha_inicio)} - ${exp.fecha_fin ? formatDate(exp.fecha_fin) : 'Actualidad'}. ${exp.descripcion_responsabilidades || ''}`} />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : <Typography>No hay experiencia laboral registrada.</Typography>}
                        </TabPanel>
                         <TabPanel value={dialogTabValue} index={5}> {/* Postulaciones */}
                            <Typography variant="subtitle1" gutterBottom>Postulaciones a Convocatorias</Typography>
                             {(!viewMode && !isEditMode) && <Typography variant="caption" display="block" gutterBottom>Las postulaciones aparecerán aquí una vez que el candidato aplique.</Typography> }
                            {(viewMode || isEditMode) && currentCandidato.postulaciones?.length > 0 ? (
                                <List dense>
                                    {currentCandidato.postulaciones.map(p => (
                                        <ListItem key={p.id_postulante_convocatoria}>
                                            <ListItemText primary={`Convocatoria: ${p.nombre_convocatoria || p.id_convocatoria}`} secondary={`Fecha: ${formatDate(p.fecha_postulacion)} - Estado: ${p.estado_especifico}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : <Typography>No se ha postulado a ninguna convocatoria.</Typography>}
                        </TabPanel>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        {!viewMode && (
                            <Button onClick={handleSubmit} variant="contained" color="primary">
                                {isEditMode ? 'Guardar Cambios' : 'Registrar Candidato'}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Paper>
        </LocalizationProvider>
    );
}