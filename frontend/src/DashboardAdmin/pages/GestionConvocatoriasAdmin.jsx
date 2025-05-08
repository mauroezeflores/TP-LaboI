import React from 'react';
import { Typography, Paper, Button, Box, TextField, Chip } from '@mui/material';

export default function GestionConvocatoriasAdmin() {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Gestión de Convocatorias (Administrador)
            </Typography>
            <Typography paragraph>
                Supervisión de todas las convocatorias de talento. Creación, finalización,
                y aprobación de solicitudes de nuevas convocatorias (si el flujo lo requiere).
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Button variant="contained">Crear Convocatoria Global</Button>
                <Button variant="outlined">Aprobar Solicitudes <Chip label="3" color="warning" size="small" /></Button>
                <TextField label="Buscar convocatoria..." variant="outlined" size="small" />
            </Box>
            <Typography variant="body1" color="text.secondary">
                (Listado/Tabla de todas las convocatorias con su estado, opciones de gestión, etc. aquí...)
            </Typography>
        </Paper>
    );
}