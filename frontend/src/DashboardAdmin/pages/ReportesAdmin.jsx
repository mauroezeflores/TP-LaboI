import React from 'react';
import { Typography, Paper, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function ReportesAdmin() {
    const [tipoReporte, setTipoReporte] = React.useState('');
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Reportes Avanzados del Sistema
            </Typography>
            <Typography paragraph>
                Acceso a reportes detallados y consolidados sobre diversos aspectos del sistema:
                empleados, desempeño, rotación, contrataciones, uso de la plataforma, etc.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel id="tipo-reporte-label">Seleccionar Tipo de Reporte</InputLabel>
                    <Select
                        labelId="tipo-reporte-label"
                        value={tipoReporte}
                        label="Seleccionar Tipo de Reporte"
                        onChange={(e) => setTipoReporte(e.target.value)}
                    >
                        <MenuItem value=""><em>Ninguno</em></MenuItem>
                        <MenuItem value="rotacion">Reporte de Rotación</MenuItem>
                        <MenuItem value="desempeno">Reporte de Desempeño General</MenuItem>
                        <MenuItem value="contrataciones">Reporte de Contrataciones</MenuItem>
                        <MenuItem value="uso_sistema">Reporte de Uso del Sistema</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" disabled={!tipoReporte}>Generar Reporte</Button>
            </Box>
            <Typography variant="body1" color="text.secondary">
                (Área para mostrar el reporte generado o sus filtros y visualizaciones aquí...)
            </Typography>
        </Paper>
    );
}