import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import EditProfile from "./Components/EditProfile";
import RecuperarPassword from "./Components/RecuperarPassword";
import PasswordResetConfirm from "./Components/PasswordResetConfirm";
import Registrarse from "./Components/Registrarse";
import ChangePassword from "./Components/ChangePassword";
import Usuario from "./Components/Usuario";
import UserProfile from "./Components/UserProfile"; // Importar el componente de perfil de usuario

// Importamos los componentes actualizados para gestionar las tareas, etiquetas y prioridades
import TipoTareasCRUD from "./Components/TipoTareasCRUD"; // CRUD de tareas
import EtiquetaCRUD from "./Components/EtiquetaCRUD"; // CRUD de etiquetas
import PrioridadCRUD from "./Components/PrioridadCRUD"; // CRUD de prioridades
import EstadoCRUD from "./Components/EstadoCRUD"; // CRUD de estados
import KanbanBoard from "./Components/KanbanBoard";

function App() {
  const [token, setToken] = useState(null); // Hook de estado (useState) para almacenar el token de autenticación
  
  return (
    <Router>
      <Routes>
        {/* Ruta para el login, el token es gestionado usando setToken */}
        <Route path="/" element={<Login setToken={setToken} />} />
        
        {/* Ruta privada para el dashboard, que utiliza el token para verificar si el usuario está autenticado */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard token={token} /></PrivateRoute>} />
        
        {/* Ruta para editar el perfil del usuario */}
        <Route path="/user-update" element={<EditProfile />} /> 
        
        {/* Ruta para el perfil del usuario */}
        <Route path="/user-profile" element={<UserProfile />} /> {/* Nueva ruta para el perfil del usuario */}
        
        {/* Ruta para la gestión de usuarios */}
        <Route path="/usuario" element={<Usuario />} /> 
        
        {/* Ruta para la recuperación de contraseña */}
        <Route path="/recuperar-password" element={<RecuperarPassword />} /> 

        {/* Ruta para la confirmación de recuperación de contraseña, que incluye parámetros dinámicos */}
        <Route path="/password-reset-confirm/:uidb64/:token" element={<PasswordResetConfirm />} />

        {/* Ruta para el cambio de contraseña */}
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Ruta para el registro de usuarios */}
        <Route path="/register" element={<Registrarse />} />

        {/* Ruta para el CRUD de Tareas */}
        <Route path="/tareas" element={<PrivateRoute><TipoTareasCRUD /></PrivateRoute>} />

        {/* Nueva Ruta para el CRUD de Etiquetas */}
        <Route path="/etiquetas" element={<PrivateRoute><EtiquetaCRUD /></PrivateRoute>} />

        {/* Nueva Ruta para el CRUD de Prioridades */}
        <Route path="/prioridades" element={<PrivateRoute><PrioridadCRUD /></PrivateRoute>} />

        {/* Nueva Ruta para el CRUD de Estados */}
        <Route path="/estados" element={<PrivateRoute><EstadoCRUD /></PrivateRoute>} />

        {/* Nueva Ruta para el tablero Kanban */}
        <Route path="/kanban" element={<KanbanBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
