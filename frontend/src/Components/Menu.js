import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importamos Link para navegación y useNavigate para redirección
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'; // Importamos componentes de react-bootstrap para usar la barra de navegación

// Recibe userInfo como prop para mostrar el nombre del usuario logueado
const Menu = ({ userInfo }) => {  
    const navegar = useNavigate(); // Hook de navegación para redirigir después de cerrar sesión

    // Función que se ejecuta al hacer clic en "Cerrar Sesión"
    const cerrarsesion = () => {
        localStorage.removeItem('access_token'); // Remueve el token de autenticación del localStorage
        navegar('/', { replace: true }); // Redirige al usuario a la página de inicio de sesión
    };

    return (
        // Navbar es el contenedor principal de la barra de navegación
        <Navbar 
            bg="dark" 
            expand="lg" 
            variant="dark" 
            style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} // Hace el menú estático
        >
            {/* Título de la aplicación, que redirige al dashboard */}
            <Navbar.Brand as={Link} to="/dashboard" style={{ color: '#00e0ff' }}>TASK MASTER</Navbar.Brand>
            
            {/* Botón para colapsar el menú en pantallas pequeñas */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
            {/* Navbar.Collapse para contener los enlaces que se mostrarán en la barra */}
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto"> {/* ms-auto para alinear todos los elementos a la derecha */}
                    
                    {/* Dropdown para las opciones relacionadas con la gestión de tareas */}
                    <NavDropdown 
                        title={<span style={{ color: '#00e0ff' }}>Tareas</span>} 
                        id="tareas-dropdown" 
                        menuVariant="dark" // Fondo negro para el dropdown                        
                    >
                        {/* Opción para gestionar tipos de tareas, redirige a /tareas */}
                        <NavDropdown.Item as={Link} to="/tareas" style={{ color: '#00e0ff' }}>Gestionar Tareas</NavDropdown.Item>

                        {/* Opción para gestionar etiquetas, redirige a /etiquetas */}
                        <NavDropdown.Item as={Link} to="/etiquetas" style={{ color: '#00e0ff' }}>Gestionar Etiquetas</NavDropdown.Item>

                        {/* Opción para gestionar prioridades, redirige a /prioridades */}
                        <NavDropdown.Item as={Link} to="/prioridades" style={{ color: '#00e0ff' }}>Gestionar Prioridades</NavDropdown.Item>

                        {/* Opción para gestionar estados, redirige a /estados */}
                        <NavDropdown.Item as={Link} to="/estados" style={{ color: '#00e0ff' }}>Gestionar Estados</NavDropdown.Item>

                        {/* Opción para visualizar el tablero Kanban, redirige a /kanban */}
                        <NavDropdown.Item as={Link} to="/kanban" style={{ color: '#00e0ff' }}>Tablero Kanban</NavDropdown.Item>

                        {/* Enlace para descargar el archivo PDF */}
                        <NavDropdown.Item href="/Manual%20TASK%20MASTER%20APP.pdf" download style={{ color: '#00e0ff' }}>
                            Descargar Manual TASK MASTER APP
                        </NavDropdown.Item>
                    </NavDropdown>                   

                    {/* Submenú que muestra el nombre del usuario logueado, siempre al final */}
                    <NavDropdown 
                        title={<span style={{ color: '#00e0ff' }}>{userInfo ? `${userInfo.nombre} ${userInfo.apellido}` : 'Usuario'}</span>} 
                        id="usuario-dropdown" 
                        menuVariant="dark" // Fondo negro para el dropdown
                    >
                        {/* Opción para editar el perfil, redirige a /user-update */}
                        <NavDropdown.Item as={Link} to="/user-update" style={{ color: '#00e0ff' }}>Editar Perfil</NavDropdown.Item>
                        
                        {/* Opción para cambiar la contraseña, redirige a /change-password */}
                        <NavDropdown.Item as={Link} to="/change-password" style={{ color: '#00e0ff' }}>Cambiar Contraseña</NavDropdown.Item>

                        {/* Visuaización perfil usuario */}
                        <NavDropdown.Item as={Link} to="/user-profile" style={{ color: '#00e0ff' }}>Ver Perfil</NavDropdown.Item>

                        {/* Botón para cerrar sesión */}
                        <NavDropdown.Item onClick={cerrarsesion} style={{ color: '#00e0ff' }}>Cerrar Sesión</NavDropdown.Item>
                        
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Menu;
