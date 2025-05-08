import React from 'react';
import { Typography, Paper, Grid, Card, CardContent, CardHeader } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';

export default function AdminHome() {
    return (
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Bienvenido al Panel de Administración
            </Typography>
            <Typography paragraph>
                Desde aquí puedes gestionar todos los aspectos del sistema SIGRH+.
                Utiliza el menú lateral para navegar por las diferentes secciones.
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardHeader title="Estadísticas Rápidas" avatar={<BarChartIcon color="primary"/>} />
                        <CardContent>
                            <Typography variant="body2">Total Empleados: <strong>150</strong></Typography>
                            <Typography variant="body2">Convocatorias Activas: <strong>5</strong></Typography>
                            <Typography variant="body2">Usuarios Nuevos Hoy: <strong>2</strong></Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                         <CardHeader title="Accesos Directos" avatar={<PeopleAltIcon color="primary"/>} />
                        <CardContent>
                            <Typography variant="body2">» Gestionar Usuarios</Typography>
                            <Typography variant="body2">» Configurar Sistema</Typography>
                            <Typography variant="body2">» Ver Reportes</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                 <Grid item xs={12} md={4}>
                    <Card>
                         <CardHeader title="Últimas Alertas" avatar={<SettingsIcon color="primary"/>} />
                        <CardContent>
                            <Typography variant="body2" color="error">Anomalía: Alta rotación en Ventas</Typography>
                            <Typography variant="body2">Pendiente: Aprobar 3 licencias</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
}