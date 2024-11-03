import React from 'react';
import { Navigate } from 'react-router-dom';
 
// Componente de ruta protegida
const PrivateRoute = ({ children }) => {//existe el token, existe el (cildren) va a ser nuestro componente 
    const token = localStorage.getItem('access_token');
 
    return token ? children : <Navigate to="/" replace />;//si no se cumple lo redirecciona al index, componente rta privada, el dashboard
};
export default PrivateRoute;