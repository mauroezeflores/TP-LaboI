import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, Button, Box, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Switch, FormControlLabel, Select,
    MenuItem, InputLabel, FormControl, Chip, Tooltip, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // O VpnKeyOffIcon para desactivar
import LockResetIcon from '@mui/icons-material/LockReset';
import FilterListIcon from '@mui/icons-material/FilterList';

// Datos de ejemplo - en un caso real, vendrían de la BD
const mockRoles = [
    { idRol: 2, nombreRol: 'Gerente RRHH' },
    { idRol: 3, nombreRol: 'Empleado RRHH' },
    { idRol: 4, nombreRol: 'Gerente General' },
    { idRol: 5, nombreRol: 'Empleado General' },
    { idRol: 6, nombreRol: 'Candidato' }, // Rol para postulantes con acceso
];

const mockUsuarios = [
    { id: 'USR002', legajo: 'E1025', nombre: 'Laura', apellido: 'García (RRHH)', email: 'laura.garcia@example.com', idRol: 3, activo: true, tipo: 'Empleado' },
    { id: 'USR003', legajo: 'E2030', nombre: 'Carlos', apellido: 'Martínez', email: 'carlos.martinez@example.com', idRol: 5, activo: true, tipo: 'Empleado' },
    { id: 'USR004', legajo: 'C001', nombre: 'Ana', apellido: 'Postulante', email: 'ana.p@example.com', idRol: 6, activo: true, tipo: 'Candidato' },
    { id: 'USR005', legajo: 'E3050', nombre: 'Pedro', apellido: 'Ramírez', email: 'pedro.ramirez@example.com', idRol: 5, activo: false, tipo: 'Empleado' },
];

const initialUsuarioForm = {
    id: null,
    legajo: '', // Puede ser el username o identificador único
    nombre: '',
    apellido: '',
    email: '',
    idRol: '',
    activo: true,
    tipo: 'Empleado', // Empleado, Candidato, Sistema
    // No manejaremos la contraseña directamente en el frontend por seguridad
};

export default function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(initialUsuarioForm);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRol, setFilterRol] = useState('');
    const [filterEstado, setFilterEstado] = useState(''); // 'todos', 'activos', 'inactivos'

    useEffect(() => {
        // Simulación de carga de datos
        setUsuarios(mockUsuarios);
        setRoles(mockRoles);
    }, []);

    useEffect(() => {
        let result = usuarios;
        if (searchTerm) {
            result = result.filter(u =>
                u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.legajo && u.legajo.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        if (filterRol) {
            result = result.filter(u => u.idRol === parseInt(filterRol));
        }
        if (filterEstado) {
            if (filterEstado === 'activos') result = result.filter(u => u.activo);
            if (filterEstado === 'inactivos') result = result.filter(u => !u.activo);
        }
        setFilteredUsuarios(result);
    }, [usuarios, searchTerm, filterRol, filterEstado]);


    const handleOpenDialog = (usuario = null) => {
        if (usuario) {
            setIsEditMode(true);
            setCurrentUsuario({ ...usuario });
        } else {
            setIsEditMode(false);
            setCurrentUsuario(initialUsuarioForm);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUsuario(initialUsuarioForm);
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCurrentUsuario(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'idRol' ? parseInt(value) : value),
        }));
    };

    const handleSubmit = () => {
        if (!currentUsuario.email || !currentUsuario.idRol || !currentUsuario.nombre || !currentUsuario.apellido) {
            alert("Nombre, Apellido, Email y Rol son obligatorios.");
            return;
        }

        if (isEditMode) {
            setUsuarios(prevUsuarios => prevUsuarios.map(u => u.id === currentUsuario.id ? currentUsuario : u));
            alert("Usuario actualizado exitosamente (simulado).");
        } else {
            const nuevoUsuario = {
                ...currentUsuario,
                id: `USR${Date.now().toString().slice(-4)}`, // Simular ID único
                legajo: currentUsuario.legajo || `AUTOGEN${Date.now().toString().slice(-3)}`
            };
            setUsuarios(prevUsuarios => [nuevoUsuario, ...prevUsuarios]);
            alert("Usuario creado exitosamente (simulado). Se enviaría una invitación por email.");
        }
        handleCloseDialog();
    };

    const handleToggleActivo = (usuarioId) => {
        setUsuarios(prevUsuarios =>
            prevUsuarios.map(u =>
                u.id === usuarioId ? { ...u, activo: !u.activo } : u
            )
        );
    };
    
    const handleResetPassword = (email) => {
        alert(`(Simulado) Se ha enviado un enlace para restablecer la contraseña a ${email}.`);
    };

    const getRolNombre = (idRol) => {
        const rol = roles.find(r => r.idRol === idRol);
        return rol ? rol.nombreRol : 'Desconocido';
    };

    return (
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Usuarios y Roles
            </Typography>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                
                <Grid item xs={12} sm={4} >
                    <TextField
                        label="Buscar usuario (nombre, email, legajo)..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small" >
                        
                        <InputLabel id="filter-rol-label">Filtrar por Rol</InputLabel>

                        <Select
                            labelId="filter-rol-label"
                            value={filterRol}
                            label="Filtrar por Rol"
                            onChange={(e) => setFilterRol(e.target.value)}
                        >
                            <MenuItem value=""><em>Todos los Roles</em></MenuItem>
                            {roles.map(rol => (
                                <MenuItem key={rol.idRol} value={rol.idRol}>{rol.nombreRol}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                     <FormControl fullWidth size="small">
                        <InputLabel id="filter-estado-label">Filtrar por Estado</InputLabel>
                        <Select
                            labelId="filter-estado-label"
                            value={filterEstado}
                            label="Filtrar por Estado"
                            onChange={(e) => setFilterEstado(e.target.value)}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="activos">Activos</MenuItem>
                            <MenuItem value="inactivos">Inactivos</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} sx={{ textAlign: {sm: 'right', xs: 'left'} }}>
                     <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        fullWidth={true} // Ocupa todo el ancho en Grid item
                    >
                        Crear Usuario
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} elevation={2}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Legajo/ID</TableCell>
                            <TableCell>Nombre Completo</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsuarios.length > 0 ? filteredUsuarios.map((usuario) => (
                            <TableRow hover key={usuario.id}>
                                <TableCell>{usuario.legajo || usuario.id}</TableCell>
                                <TableCell>{usuario.nombre} {usuario.apellido}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>
                                    <Chip label={getRolNombre(usuario.idRol)} size="small" />
                                </TableCell>
                                <TableCell>{usuario.tipo}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title={usuario.activo ? "Desactivar Usuario" : "Activar Usuario"}>
                                        <Switch
                                            checked={usuario.activo}
                                            onChange={() => handleToggleActivo(usuario.id)}
                                            size="small"
                                        />
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Editar Usuario">
                                        <IconButton size="small" onClick={() => handleOpenDialog(usuario)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Restablecer Contraseña">
                                        <IconButton size="small" onClick={() => handleResetPassword(usuario.email)}>
                                            <LockResetIcon />
                                        </IconButton>
                                    </Tooltip>
                                   
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={7} align="center">No se encontraron usuarios con los filtros aplicados.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{pt: 1}}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nombre"
                                name="nombre"
                                value={currentUsuario.nombre}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <TextField
                                label="Apellido"
                                name="apellido"
                                value={currentUsuario.apellido}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                required
                            />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField
                                label="Legajo/ID (Opcional)"
                                name="legajo"
                                value={currentUsuario.legajo}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                helperText={isEditMode ? "No editable si ya existe" : "Se autogenerará si se deja vacío."}
                                disabled={isEditMode && !!currentUsuario.legajo}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={currentUsuario.email}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                required
                                disabled={isEditMode} // Generalmente el email no se cambia o requiere validación especial
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense" required>
                                <InputLabel id="rol-label">Rol</InputLabel>
                                <Select
                                    labelId="rol-label"
                                    name="idRol"
                                    value={currentUsuario.idRol}
                                    label="Rol"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" disabled><em>Seleccione un rol</em></MenuItem>
                                    {roles.map(rol => (
                                        <MenuItem key={rol.idRol} value={rol.idRol}>{rol.nombreRol}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <FormControl fullWidth margin="dense">
                                <InputLabel id="tipo-usuario-label">Tipo de Usuario</InputLabel>
                                <Select
                                    labelId="tipo-usuario-label"
                                    name="tipo"
                                    value={currentUsuario.tipo}
                                    label="Tipo de Usuario"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Empleado">Empleado</MenuItem>
                                    <MenuItem value="Candidato">Candidato</MenuItem>
                                    <MenuItem value="Sistema">Sistema (Otro)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                             <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentUsuario.activo}
                                        onChange={handleChange}
                                        name="activo"
                                    />
                                }
                                label="Usuario Activo"
                                sx={{mt:1}}
                            />
                        </Grid>
                        {!isEditMode && (
                            <Grid item xs={12}>
                                <Typography variant="caption" color="textSecondary">
                                    La contraseña se generará automáticamente y se enviará al email del usuario
                                    junto con las instrucciones para el primer inicio de sesión.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{p: '16px 24px'}}>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}