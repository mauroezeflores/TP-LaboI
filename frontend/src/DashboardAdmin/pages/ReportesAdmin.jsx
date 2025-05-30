import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import Button from '@mui/material/Button'; 

export default function ReportesAdmin() {
    return (
        <Paper sx={{
            p: 4, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 'calc(100vh - 64px - 48px - 48px)', 
            backgroundColor: 'background.paper' 
        }}>
            <ConstructionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
                Reportes administrativos
            </Typography>
            <Typography variant="body1" color="text.secondary">
                ¡Estamos trabajando en esta sección!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Próximamente podrás generar reportes administrativos desde aquí.
            </Typography>
            <Box sx={{ mt: 4 }}>
             <Button variant="outlined" component={Link} to="/dashboard/admin">
                    Volver al Inicio Admin
                </Button> 
            </Box>
        </Paper>
    );
}