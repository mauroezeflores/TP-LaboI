import React from 'react';
import { Typography, Paper, Button, Box, TextField, Chip } from '@mui/material';

export default function GestionLicenciasAdmin() {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Gestión de Licencias (Administrador)
            </Typography>
            <Typography paragraph>
                Configuración de los tipos de licencias permitidos en el sistema,
                políticas asociadas, y supervisión general de las solicitudes de licencia.
                Capacidad de aprobación/rechazo global si es necesario.
            </Typography>
             <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Button variant="contained">Configurar Tipos de Licencia</Button>
                <Button variant="outlined">Ver Todas las Solicitudes <Chip label="5 Pendientes" color="info" size="small" /></Button>
                <TextField label="Buscar solicitud..." variant="outlined" size="small" />
            </Box>
            <Typography variant="body1" color="text.secondary">
                (Listado/Tabla de solicitudes de licencia, filtros, y opciones de gestión aquí...)
            </Typography>
        </Paper>
    );
}