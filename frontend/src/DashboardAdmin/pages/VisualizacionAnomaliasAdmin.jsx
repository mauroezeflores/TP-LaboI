import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography, Paper, Box, Grid, Card, CardContent, Select,
    MenuItem, InputLabel, FormControl, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Tooltip, Link as MuiLink, // Renombrar Link a MuiLink
    Button, IconButton, useTheme
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
// Importar componentes de Recharts
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
    Legend, ResponsiveContainer, LabelList
} from 'recharts';
// Importar Link de react-router-dom si lo usas para navegar
import { Link } from 'react-router-dom';


// --- Datos de Ejemplo (Mocks) ---
// Datos SIN la columna/referencia explícita a Departamento en este nivel
const mockAnomalias = [
    {
        id_empleado: 'EMP005', legajo: 'L005', nombreCompleto: 'Pedro Ramírez',
        puesto: 'Ejecutivo de Cuentas Jr.', id_puesto: 4, // id_departamento: 3 (ignorado)
        riesgoScore: 85, nivelRiesgo: 'Alto',
        factoresRiesgo: ['Bajo Desempeño Últ. Evaluación', 'Salario por debajo media puesto', 'Alta Tasa Ausentismo (Personal)'],
        edad: 28, antiguedadMeses: 14
    },
    {
        id_empleado: 'EMP008', legajo: 'L008', nombreCompleto: 'Sofía Castro',
        puesto: 'Desarrollador Frontend Jr.', id_puesto: 1, // id_departamento: 1
        riesgoScore: 65, nivelRiesgo: 'Medio',
        factoresRiesgo: ['Poca participación en proyectos clave', 'Feedback regular en encuesta clima'],
        edad: 24, antiguedadMeses: 8
    },
    {
        id_empleado: 'EMP012', legajo: 'L012', nombreCompleto: 'Martín Torres',
        puesto: 'Contador Público', id_puesto: 6, // id_departamento: 5
        riesgoScore: 75, nivelRiesgo: 'Medio',
        factoresRiesgo: ['Sin aumento salarial reciente', 'Ausencias frecuentes (justificadas médicamente)'],
        edad: 35, antiguedadMeses: 48
    },
    {
        id_empleado: 'EMP001', legajo: 'L001', nombreCompleto: 'Ana Pérez',
        puesto: 'Desarrollador Backend Sr.', id_puesto: 2, // id_departamento: 1
        riesgoScore: 30, nivelRiesgo: 'Bajo',
        factoresRiesgo: ['Alto desempeño reciente'],
        edad: 34, antiguedadMeses: 64
    },
     {
        id_empleado: 'EMP015', legajo: 'L015', nombreCompleto: 'Julia Benítez',
        puesto: 'Especialista en Marketing Digital', id_puesto: 5, // id_departamento: 4
        riesgoScore: 90, nivelRiesgo: 'Alto',
        factoresRiesgo: ['Expresó disconformidad salarial', 'Búsqueda activa detectada (hipotético)', 'Desempeño decreciente'],
        edad: 31, antiguedadMeses: 25
    },
      {
        id_empleado: 'EMP018', legajo: 'L018', nombreCompleto: 'Daniel Soto',
        puesto: 'Analista RRHH', id_puesto: 3, // id_departamento: 2
        riesgoScore: 70, nivelRiesgo: 'Medio',
        factoresRiesgo: ['Alta cantidad de faltas injustificadas'],
        edad: 29, antiguedadMeses: 18
    },
];
// Lista de puestos para filtros (debería venir de la BD o del ABM de Puestos)
const mockPuestosFiltro = [
     { idPuesto: 1, nombrePuesto: 'Desarrollador Frontend Jr.'},
     { idPuesto: 2, nombrePuesto: 'Desarrollador Backend Sr.'},
     { idPuesto: 3, nombrePuesto: 'Analista RRHH'},
     { idPuesto: 4, nombrePuesto: 'Ejecutivo de Cuentas Jr.'},
     { idPuesto: 5, nombrePuesto: 'Especialista en Marketing Digital'},
     { idPuesto: 6, nombrePuesto: 'Contador Público'},
     // ... otros puestos ...
];
const nivelesRiesgoFiltro = ['Alto', 'Medio', 'Bajo'];
// --- Fin Datos de Ejemplo ---


export default function VisualizacionAnomaliasAdmin() {
    const theme = useTheme();
    const [anomalias, setAnomalias] = useState([]);
    const [puestos, setPuestos] = useState([]); // Solo necesitamos Puestos ahora
    const [filteredAnomalias, setFilteredAnomalias] = useState([]);

    // Estados para Filtros
    // const [filterDepartamento, setFilterDepartamento] = useState(''); // <-- Eliminado
    const [filterPuesto, setFilterPuesto] = useState('');
    const [filterNivelRiesgo, setFilterNivelRiesgo] = useState('');

    useEffect(() => {
        setAnomalias(mockAnomalias);
        setPuestos(mockPuestosFiltro);
    }, []);

    useEffect(() => {
        let result = anomalias;
        // if (filterDepartamento) result = result.filter(a => a.id_departamento === parseInt(filterDepartamento)); // <-- Eliminado
        if (filterPuesto) {
             result = result.filter(a => a.id_puesto === parseInt(filterPuesto));
        }
        if (filterNivelRiesgo) {
             result = result.filter(a => a.nivelRiesgo === filterNivelRiesgo);
        }
        setFilteredAnomalias(result);
    }, [anomalias, filterPuesto, filterNivelRiesgo]); // Quitar filterDepartamento de dependencias

    // --- Calcular Datos para Gráficos (Agrupados por Puesto) ---
    const dataGraficoPuestosGeneral = useMemo(() => {
        // Usamos los puestos del filtro para asegurar que todos aparezcan en el cálculo base
        return puestos.map(puesto => {
            const anomaliasPuesto = filteredAnomalias.filter(a => a.id_puesto === puesto.idPuesto);
            const nombreCorto = puesto.nombrePuesto.length > 15 ? puesto.nombrePuesto.substring(0, 12) + '...' : puesto.nombrePuesto;
            return {
                name: nombreCorto, // Usar nombre del puesto
                puestoCompleto: puesto.nombrePuesto, // Guardar nombre completo para Tooltip
                'Riesgo Alto': anomaliasPuesto.filter(a => a.nivelRiesgo === 'Alto').length,
                'Riesgo Medio': anomaliasPuesto.filter(a => a.nivelRiesgo === 'Medio').length,
            };
            // Opcional: Filtrar puestos sin riesgo solo después del cálculo si quieres verlos en Tooltip
        }).filter(d => d['Riesgo Alto'] > 0 || d['Riesgo Medio'] > 0); // Filtrar para mostrar solo puestos con algún riesgo en el gráfico
    }, [filteredAnomalias, puestos]);

    const dataGraficoAusentismoPuesto = useMemo(() => {
        const keywordsAusentismo = ['ausentismo', 'ausencia', 'faltas'];
        return puestos.map(puesto => {
            const empleadosConRiesgoAusencia = filteredAnomalias.filter(a =>
                a.id_puesto === puesto.idPuesto &&
                a.factoresRiesgo.some(factor =>
                    keywordsAusentismo.some(keyword => factor.toLowerCase().includes(keyword))
                )
            ).length;
            const nombreCorto = puesto.nombrePuesto.length > 15 ? puesto.nombrePuesto.substring(0, 12) + '...' : puesto.nombrePuesto;
            return {
                name: nombreCorto,
                puestoCompleto: puesto.nombrePuesto,
                'Riesgo Ausentismo': empleadosConRiesgoAusencia,
            };
        }).filter(d => d['Riesgo Ausentismo'] > 0); // Mostrar solo puestos con casos
    }, [filteredAnomalias, puestos]);
    // --- Fin Cálculo Datos Gráficos ---


    const totalEmpleados = 150; // Simulado
    const empleadosAltoRiesgo = useMemo(() => filteredAnomalias.filter(a => a.nivelRiesgo === 'Alto').length, [filteredAnomalias]);
    const empleadosMedioRiesgo = useMemo(() => filteredAnomalias.filter(a => a.nivelRiesgo === 'Medio').length, [filteredAnomalias]);

    const handleClearFilters = () => {
        // setFilterDepartamento(''); // <-- Eliminado
        setFilterPuesto('');
        setFilterNivelRiesgo('');
    };

    const getRiskChip = (level) => {
         let color = 'default';
        let icon = <InfoOutlinedIcon fontSize="inherit" sx={{ mr: 0.5 }} />;
        if (level === 'Alto') { color = 'error'; icon = <ErrorOutlineIcon fontSize="inherit" sx={{ mr: 0.5 }}/>; }
        else if (level === 'Medio') { color = 'warning'; icon = <WarningAmberIcon fontSize="inherit" sx={{ mr: 0.5 }}/>; }
        return <Chip icon={icon} label={level} color={color} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }}/>;
    };

    // Tooltip personalizado para mostrar nombre completo del puesto en gráficos
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Buscar el nombre completo del puesto basado en el label (nombre corto)
            const puestoCompleto = dataGraficoPuestosGeneral.find(d => d.name === label)?.puestoCompleto || dataGraficoAusentismoPuesto.find(d => d.name === label)?.puestoCompleto || label;
            return (
            <Paper sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>{puestoCompleto}</Typography>
                {payload.map((entry, index) => (
                <Typography key={`item-${index}`} variant="caption" sx={{ color: entry.color, display: 'block' }}>
                    {`${entry.name}: ${entry.value}`}
                </Typography>
                ))}
            </Paper>
            );
        }
        return null;
    };


    return (
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ReportProblemIcon color="warning" sx={{ fontSize: '2.2rem' }} />
                <Typography variant="h4" component="h1">Visualización de Anomalías y Riesgos</Typography>
            </Box>

            {/* Sección de Resumen */}
            <Grid container spacing={3}>
                 <Grid item xs={12} sm={4}>
                    <Card elevation={2}> {/* Alto Riesgo */}
                        <CardContent>
                             <Typography variant="h6" sx={{ color: theme.palette.error.main }}>Alto Riesgo</Typography>
                            <Typography variant="h3" component="p" sx={{ my: 1 }}>{empleadosAltoRiesgo}</Typography>
                             <Typography variant="body2" color="textSecondary">Empleados ({totalEmpleados > 0 ? ((empleadosAltoRiesgo / totalEmpleados) * 100).toFixed(1) : 0}%)</Typography>
                         </CardContent>
                    </Card>
                 </Grid>
                  <Grid item xs={12} sm={4}>
                     <Card elevation={2}> {/* Medio Riesgo */}
                         <CardContent>
                             <Typography variant="h6" sx={{ color: theme.palette.warning.main }}>Medio Riesgo</Typography>
                             <Typography variant="h3" component="p" sx={{ my: 1 }}>{empleadosMedioRiesgo}</Typography>
                             <Typography variant="body2" color="textSecondary">Empleados ({totalEmpleados > 0 ? ((empleadosMedioRiesgo / totalEmpleados) * 100).toFixed(1) : 0}%)</Typography>
                         </CardContent>
                     </Card>
                 </Grid>
                  <Grid item xs={12} sm={4}>
                      <Card elevation={2}> {/* Total Empleados */}
                          <CardContent>
                             <Typography variant="h6" color="textSecondary">Total Empleados</Typography>
                             <Typography variant="h3" component="p" sx={{ my: 1 }}>{totalEmpleados}</Typography>
                             <Typography variant="body2" color="textSecondary">Plantilla activa</Typography>
                         </CardContent>
                      </Card>
                 </Grid>
            </Grid>

            {/* Sección de Filtros (Sin Departamento) */}
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item><Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Filtros:</Typography></Grid>
                    <Grid item xs={12} sm={5}> {/* Ajustar tamaño */}
                        <FormControl fullWidth size="small">
                            <InputLabel>Puesto</InputLabel>
                            <Select value={filterPuesto} label="Puesto" onChange={(e) => setFilterPuesto(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {puestos.map(p => <MenuItem key={p.idPuesto} value={p.idPuesto}>{p.nombrePuesto}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                     <Grid item xs={12} sm={4}> {/* Ajustar tamaño */}
                        <FormControl fullWidth size="small">
                            <InputLabel>Nivel de Riesgo</InputLabel>
                            <Select value={filterNivelRiesgo} label="Nivel de Riesgo" onChange={(e) => setFilterNivelRiesgo(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {nivelesRiesgoFiltro.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3} md="auto"> {/* Botón Limpiar */}
                        <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleClearFilters} fullWidth>Limpiar</Button>
                    </Grid>
                </Grid>
            </Paper>

             {/* Sección de Gráficos (Agrupados por Puesto) */}
             <Grid container spacing={3}>
                 <Grid item xs={12} md={6}>
                     <Paper elevation={2} sx={{ p: 2, height: { xs: 300, md: 400 } }}>
                        <Typography variant="h6" gutterBottom>Distribución General de Riesgo por Puesto</Typography>
                        <Box sx={{ height: 'calc(100% - 40px)'}}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dataGraficoPuestosGeneral} // Usa datos por puesto
                                    margin={{ top: 5, right: 10, left: -20, bottom: 25 }} // Más margen inferior
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider}/>
                                    <XAxis
                                        dataKey="name" // Nombre corto del puesto
                                        tick={{ fontSize: 10 }}
                                        interval={0}
                                        angle={-30} // Inclinar para más espacio
                                        textAnchor="end"
                                     />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }}/>
                                    {/* Usar Tooltip personalizado */}
                                    <ChartTooltip cursor={{fill: theme.palette.action.hover}} content={<CustomTooltip />}/>
                                    <Legend wrapperStyle={{fontSize: "12px", paddingTop: "15px"}}/>
                                    <Bar dataKey="Riesgo Alto" fill={theme.palette.error.main} name="Alto Riesgo" />
                                    <Bar dataKey="Riesgo Medio" fill={theme.palette.warning.main} name="Medio Riesgo"/>
                                </BarChart>
                            </ResponsiveContainer>
                         </Box>
                    </Paper>
                 </Grid>
                  <Grid item xs={12} md={6}>
                     <Paper elevation={2} sx={{ p: 2, height: { xs: 300, md: 400 } }}>
                        <Typography variant="h6" gutterBottom>Riesgo por Ausentismo Frecuente (por Puesto)</Typography>
                         <Box sx={{ height: 'calc(100% - 40px)'}}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dataGraficoAusentismoPuesto} // Usa datos de ausentismo por puesto
                                    margin={{ top: 20, right: 10, left: -20, bottom: 25 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider}/>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10 }}
                                        interval={0}
                                        angle={-30}
                                        textAnchor="end"
                                     />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                    <ChartTooltip cursor={{fill: theme.palette.action.hover}} content={<CustomTooltip />}/>
                                    {/* <Legend wrapperStyle={{fontSize: "12px", paddingTop: "15px"}}/> */}
                                    <Bar dataKey="Riesgo Ausentismo" fill={theme.palette.info.main} name="Nº Empleados con Riesgo Ausentismo">
                                        <LabelList dataKey="Riesgo Ausentismo" position="top" style={{ fontSize: '10px' }} formatter={(value) => value > 0 ? value : ''} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                         </Box>
                    </Paper>
                 </Grid>
            </Grid>


            {/* Tabla de Empleados en Riesgo (Sin Columna Departamento) */}
            <Typography variant="h6" component="h3" sx={{mt: 2}}>
                 Detalle de Empleados ({filteredAnomalias.length} encontrados con filtros actuales)
            </Typography>
            <TableContainer component={Paper} elevation={2}>
                 <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Empleado (Legajo)</TableCell>
                            <TableCell>Puesto</TableCell>
                            {/* <TableCell>Departamento</TableCell> <-- Columna eliminada */}
                            <TableCell align="center">Nivel Riesgo</TableCell>
                            <TableCell>Factores Principales</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAnomalias.length > 0 ? filteredAnomalias.map((emp) => (
                            <TableRow hover key={emp.id_empleado}>
                                <TableCell>
                                    <Typography variant="body2" sx={{fontWeight: 500}}>{emp.nombreCompleto}</Typography>
                                    <Typography variant="caption" color="textSecondary">({emp.legajo})</Typography>
                                </TableCell>
                                <TableCell><Typography variant="body2">{emp.puesto}</Typography></TableCell>
                                {/* <TableCell><Typography variant="body2">{emp.departamento}</Typography></TableCell> <-- Celda eliminada */}
                                <TableCell align="center">{getRiskChip(emp.nivelRiesgo)}</TableCell>
                                <TableCell>
                                     <Tooltip title={emp.factoresRiesgo.join(' | ')}>
                                         <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '350px' }}>
                                            {emp.factoresRiesgo.join(', ')}
                                         </Typography>
                                     </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Ver Ficha Completa Empleado">
                                        <IconButton size="small" component={Link} to={`/admin/empleados/${emp.id_empleado}`} >
                                            <VisibilityIcon fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} align="center">No se encontraron empleados con los filtros aplicados.</TableCell></TableRow> 
                        )}
                        
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}