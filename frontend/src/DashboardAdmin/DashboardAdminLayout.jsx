import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem,
    ListItemIcon, ListItemText, CssBaseline, Box, Divider, useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; 
import {
    Home as HomeIcon, PeopleAlt as PeopleAltIcon, Work as WorkIcon, Assignment as AssignmentIcon,
    Settings as SettingsIcon, BarChart as BarChartIcon, ReportProblem as ReportProblemIcon,
    DynamicFeed as DynamicFeedIcon, FactCheck as FactCheckIcon, AccountCircle as AccountCircleIcon,
    Badge as BadgeIcon, Poll as PollIcon, VpnKey as VpnKeyIcon, Construction as ConstructionIcon
} from '@mui/icons-material';

const drawerWidth = 280;

export default function DashboardAdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Inicio Admin', icon: <HomeIcon />, path: '/dashboard/admin' },
        { text: 'Gestión de Usuarios', icon: <AccountCircleIcon />, path: 'usuarios' },
        { text: 'ABM Empleados', icon: <PeopleAltIcon />, path: 'empleados' },
        { text: 'ABM Candidatos', icon: <BadgeIcon />, path: 'candidatos' },
        { text: 'Gestión Convocatorias', icon: <DynamicFeedIcon />, path: 'convocatorias' },
        { text: 'Gestión Licencias', icon: <FactCheckIcon />, path: 'licencias' },
        { text: 'Gestión Encuestas', icon: <PollIcon />, path: 'encuestas' },
        { text: 'Reportes Avanzados', icon: <BarChartIcon />, path: 'reportes' },
        { text: 'Visualizar Anomalías', icon: <ReportProblemIcon />, path: 'anomalias' },
        { text: 'Configuración Sistema', icon: <SettingsIcon />, path: 'configuracion' },
        
    ];

    const drawerContent = (
        <div>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                <ConstructionIcon sx={{ mr: 1 }} />
                <Typography variant="h6" noWrap component="div">
                    SIGRH+ Admin
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        component={NavLink}
                        to={item.path}
                        end={item.path === '/dashboard/admin'} // `end` es importante para que la ruta base no esté siempre activa
                        onClick={isSmUp ? null : handleDrawerToggle} // Cierra el drawer en móvil al hacer clic
                        sx={{
                            '&.active': {
                                backgroundColor: theme.palette.action.selected,
                                color: theme.palette.primary.main,
                                '& .MuiListItemIcon-root': {
                                    color: theme.palette.primary.main,
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                 <ListItem button onClick={() => {
                    navigate('/'); // Redirige a la página de login o inicio pública
                 }}>
                    <ListItemIcon sx={{minWidth: '40px'}}><VpnKeyIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Panel de Administración
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant={isSmUp ? "permanent" : "temporary"}
                    open={isSmUp ? true : mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: theme.palette.grey[100], // Un fondo suave para el área de contenido
                    minHeight: '100vh'
                }}
            >
                <Toolbar /> {/* Spacer for the AppBar */}
                <Outlet /> {/* Aquí se renderizarán los componentes de las rutas anidadas */}
            </Box>
        </Box>
    );
}