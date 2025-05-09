import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, TextField, Button, Box, Switch, FormControlLabel,
    Divider, FormGroup, FormControl, InputLabel, Select, MenuItem, Grid,
    Accordion, AccordionSummary, AccordionDetails, IconButton, List, ListItem, ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

// Simulación de carga de configuración (en un caso real, vendría de la BD)
const initialConfig = {
    nombreEmpresa: 'H.RLearning',
    emailContacto: 'soporte@hrlearning.com',
    notificacionesGeneralesActivas: true,
    // Parámetros de Evaluación de Desempeño
    periodoEvaluacionDefault: 'semestral', // trimestral, semestral, anual
    factoresClaveDesempeno: [ 
        { id: 1, nombre: 'Productividad', descripcion: 'Capacidad para alcanzar los objetivos de producción.' },
        { id: 2, nombre: 'Calidad del Trabajo', descripcion: 'Nivel de precisión y ausencia de errores.' },
        { id: 3, nombre: 'Trabajo en Equipo', descripcion: 'Colaboración efectiva con compañeros.' },
        { id: 4, nombre: 'Proactividad', descripcion: 'Iniciativa y anticipación a necesidades.' },
        { id: 5, nombre: 'Comunicación', descripcion: 'Habilidad para transmitir y recibir información.' },
    ],
    permitirAutoevaluacion: true,
    escalaCalificacion: [ // Ejemplo de escala
        { valor: 1, etiqueta: 'Necesita Mejorar Mucho' },
        { valor: 2, etiqueta: 'Necesita Mejorar' },
        { valor: 3, etiqueta: 'Cumple Expectativas' },
        { valor: 4, etiqueta: 'Supera Expectativas' },
        { valor: 5, etiqueta: 'Sobresaliente' },
    ],
    // Parámetros de Encuestas
    anonimatoEncuestasDefault: true,
    recordatorioEncuestasActivo: true,
    frecuenciaRecordatorioDias: 3, // Días antes de la fecha límite
    // Parámetros de Módulo de Licencias (Ausentismos)
    tiposAusentismoHabilitados: [ // Basado en la tabla ausentismo_por_empleados (tipo_ausentismo)
        { id: 'medica', nombre: 'Licencia Médica', requiereAdjunto: true },
        { id: 'vacaciones', nombre: 'Vacaciones', requiereAdjunto: false },
        { id: 'estudio', nombre: 'Licencia por Estudio', requiereAdjunto: true },
        { id: 'personal', nombre: 'Asuntos Personales', requiereAdjunto: false },
        { id: 'mudanza', nombre: 'Licencia por Mudanza', requiereAdjunto: false },
    ],
    maxDiasVacacionesAnualesBase: 21,
};

export default function ConfiguracionSistemaAdmin() {
    const [config, setConfig] = useState(initialConfig);
    const [newFactorNombre, setNewFactorNombre] = useState('');
    const [newFactorDescripcion, setNewFactorDescripcion] = useState('');
    const [newEscalaValor, setNewEscalaValor] = useState('');
    const [newEscalaEtiqueta, setNewEscalaEtiqueta] = useState('');
    const [newTipoAusentismoNombre, setNewTipoAusentismoNombre] = useState('');
    const [newTipoAusentismoId, setNewTipoAusentismoId] = useState('');
    const [newTipoAusentismoRequiereAdjunto, setNewTipoAusentismoRequiereAdjunto] = useState(false);


    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setConfig(prevConfig => ({
            ...prevConfig,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleListChange = (listName, index, field, value) => {
        setConfig(prevConfig => {
            const newList = [...prevConfig[listName]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prevConfig, [listName]: newList };
        });
    };
    
    const handleAddItemToList = (listName, newItem) => {
        if (listName === 'factoresClaveDesempeno' && (!newItem.nombre || !newItem.descripcion)) {
            alert('El nombre y la descripción del factor son obligatorios.');
            return;
        }
        if (listName === 'escalaCalificacion' && (!newItem.valor || !newItem.etiqueta)) {
            alert('El valor y la etiqueta de la escala son obligatorios.');
            return;
        }
         if (listName === 'tiposAusentismoHabilitados' && (!newItem.id || !newItem.nombre)) {
            alert('El ID y el Nombre del tipo de ausentismo son obligatorios.');
            return;
        }

        setConfig(prevConfig => ({
            ...prevConfig,
            [listName]: [...prevConfig[listName], { id: Date.now(), ...newItem }], // Usar Date.now() para ID simple en factores
        }));
    };

    const handleRemoveItemFromList = (listName, indexToRemove) => {
        setConfig(prevConfig => ({
            ...prevConfig,
            [listName]: prevConfig[listName].filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleGuardarConfiguracion = () => {
        console.log("Configuración Guardada:", config);
        // Aquí iría la lógica para enviar `config` al backend/Supabase
        alert("Configuración guardada exitosamente (simulado).");
    };

    useEffect(() => {
        // Simulación: Cargar configuración desde el backend al montar el componente
        // const fetchConfig = async () => {
        //     // const { data, error } = await supabase.from('configuracion_sistema').select('*').single();
        //     // if (data) setConfig(data);
        // };
        // fetchConfig();
    }, []);


    return (
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Configuración General del Sistema
            </Typography>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Parámetros Generales</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <TextField
                            label="Nombre de la Empresa"
                            name="nombreEmpresa"
                            value={config.nombreEmpresa}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            label="Email de Contacto del Sistema"
                            name="emailContacto"
                            value={config.emailContacto}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <FormControlLabel
                            control={<Switch checked={config.notificacionesGeneralesActivas} onChange={handleChange} name="notificacionesGeneralesActivas" />}
                            label="Notificaciones Generales del Sistema Activas"
                            sx={{ mt: 1 }}
                        />
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Parámetros de Evaluación de Desempeño</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <FormControl margin="normal" variant="outlined" fullWidth>
                            <InputLabel id="periodo-eval-label">Período de Evaluación por Defecto</InputLabel>
                            <Select
                                labelId="periodo-eval-label"
                                name="periodoEvaluacionDefault"
                                value={config.periodoEvaluacionDefault}
                                label="Período de Evaluación por Defecto"
                                onChange={handleChange}
                            >
                                <MenuItem value="trimestral">Trimestral</MenuItem>
                                <MenuItem value="semestral">Semestral</MenuItem>
                                <MenuItem value="anual">Anual</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Factores Clave de Desempeño Base:</Typography>
                        <List dense>
                            {config.factoresClaveDesempeno.map((factor, index) => (
                                <ListItem
                                    key={factor.id || index}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItemFromList('factoresClaveDesempeno', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={factor.nombre} secondary={factor.descripcion} />
                                </ListItem>
                            ))}
                        </List>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt:1 }}>
                            <TextField label="Nuevo Factor (Nombre)" size="small" value={newFactorNombre} onChange={(e) => setNewFactorNombre(e.target.value)} />
                            <TextField label="Descripción Factor" size="small" value={newFactorDescripcion} onChange={(e) => setNewFactorDescripcion(e.target.value)} />
                            <IconButton color="primary" onClick={() => {
                                handleAddItemToList('factoresClaveDesempeno', { nombre: newFactorNombre, descripcion: newFactorDescripcion });
                                setNewFactorNombre(''); setNewFactorDescripcion('');
                            }}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </Box>

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Escala de Calificación:</Typography>
                        <List dense>
                            {config.escalaCalificacion.map((escala, index) => (
                                 <ListItem
                                    key={escala.valor || index}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItemFromList('escalaCalificacion', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={`Valor: ${escala.valor} - Etiqueta: ${escala.etiqueta}`} />
                                </ListItem>
                            ))}
                        </List>
                         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt:1 }}>
                            <TextField label="Valor Escala (Ej: 1)" type="number" size="small" value={newEscalaValor} onChange={(e) => setNewEscalaValor(e.target.value)} />
                            <TextField label="Etiqueta Escala (Ej: Malo)" size="small" value={newEscalaEtiqueta} onChange={(e) => setNewEscalaEtiqueta(e.target.value)} />
                            <IconButton color="primary" onClick={() => {
                                handleAddItemToList('escalaCalificacion', { valor: parseInt(newEscalaValor), etiqueta: newEscalaEtiqueta });
                                setNewEscalaValor(''); setNewEscalaEtiqueta('');
                            }}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </Box>

                        <FormControlLabel
                            control={<Switch checked={config.permitirAutoevaluacion} onChange={handleChange} name="permitirAutoevaluacion" />}
                            label="Permitir Autoevaluación de Empleados"
                            sx={{ mt: 2 }}
                        />
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Parámetros de Encuestas</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={config.anonimatoEncuestasDefault} onChange={handleChange} name="anonimatoEncuestasDefault" />}
                            label="Encuestas Anónimas por Defecto"
                            sx={{ mt: 1 }}
                        />
                        <FormControlLabel
                            control={<Switch checked={config.recordatorioEncuestasActivo} onChange={handleChange} name="recordatorioEncuestasActivo" />}
                            label="Activar Recordatorios para Encuestas Pendientes"
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            label="Frecuencia de Recordatorio para Encuestas (días antes del cierre)"
                            name="frecuenciaRecordatorioDias"
                            type="number"
                            value={config.frecuenciaRecordatorioDias}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            InputProps={{ inputProps: { min: 1, max: 30 } }}
                            disabled={!config.recordatorioEncuestasActivo}
                        />
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Parámetros de Ausentismos (Licencias)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                         <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>Tipos de Ausentismo Habilitados:</Typography>
                        <List dense>
                            {config.tiposAusentismoHabilitados.map((tipo, index) => (
                                 <ListItem
                                    key={tipo.id || index}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItemFromList('tiposAusentismoHabilitados', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={`${tipo.nombre} (ID: ${tipo.id})`} secondary={tipo.requiereAdjunto ? "Requiere adjunto" : "No requiere adjunto"} />
                                </ListItem>
                            ))}
                        </List>
                        <Grid container spacing={1} alignItems="center" sx={{mt:1}}>
                            <Grid item xs={12} sm={3}>
                                <TextField label="ID Tipo Ausentismo" size="small" fullWidth value={newTipoAusentismoId} onChange={(e) => setNewTipoAusentismoId(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Nombre Tipo Ausentismo" size="small" fullWidth value={newTipoAusentismoNombre} onChange={(e) => setNewTipoAusentismoNombre(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControlLabel
                                    control={<Switch checked={newTipoAusentismoRequiereAdjunto} onChange={(e) => setNewTipoAusentismoRequiereAdjunto(e.target.checked)} />}
                                    label="Requiere Adjunto"
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <IconButton color="primary" onClick={() => {
                                    handleAddItemToList('tiposAusentismoHabilitados', { id: newTipoAusentismoId, nombre: newTipoAusentismoNombre, requiereAdjunto: newTipoAusentismoRequiereAdjunto });
                                    setNewTipoAusentismoId(''); setNewTipoAusentismoNombre(''); setNewTipoAusentismoRequiereAdjunto(false);
                                }}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Grid>
                        </Grid>

                        <TextField
                            label="Máx. Días de Vacaciones Anuales Base (antes de antigüedad)"
                            name="maxDiasVacacionesAnualesBase"
                            type="number"
                            value={config.maxDiasVacacionesAnualesBase}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" size="large" onClick={handleGuardarConfiguracion}>
                    Guardar Configuración
                </Button>
            </Box>
        </Paper>
    );
}