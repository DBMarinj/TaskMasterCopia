import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para crear el enlace
import MensajeError from './MensajeError'; // Importa el componente de mensaje de error
import axios from 'axios'; // Integración con la API REST

// Desarrollando el componente
const Login = ({ setToken }) => { 
    const [usuario, setUsuario] = useState(''); // Hook de estado para manejar el nombre de usuario
    const [contrasena, setContrasena] = useState(''); // Hook de estado para manejar la contraseña
    const [mostrarContrasena, setMostrarContrasena] = useState(false); // Estado para controlar si se muestra la contraseña
    const [errores, setError] = useState(''); // Hook de estado para manejar los errores
    const navegar = useNavigate(); // Hook de navegación: usar para redirigir
    const APPI_URL = 'http://127.0.0.1:8000/token/'; // URL de la API para la autenticación

    // Función para validar los datos de inicio de sesión
    const validarDatos = async () => {   
        try {
            const respuesta = await axios.post(APPI_URL, { "username": usuario, "password": contrasena }); // Realiza la petición POST a la API con usuario y contraseña
            localStorage.setItem('access_token', respuesta.data.access); // Guardamos el token de acceso en el almacenamiento local
            setToken(respuesta.data.access); // Actualizamos el estado con el token
            navegar('/dashboard'); // Redirigimos al usuario al dashboard
        } catch (error) { 
            setError('Credenciales incorrectas'); // Si ocurre un error, se muestra el mensaje de error
        }
    };

    return (
        <div className="board-container d-flex justify-content-center align-items-center vh-100"> {/* Fondo estilo corcho */}
            {/* Tarjeta principal con sombra pronunciada y rotación leve */}
            <div className="card main-card">
                <div className="card-body text-center">
                    <h2 className="card-title">Task Master</h2>
                    {errores && <MensajeError message={errores} />}

                    <div className="form-group">
                        <label htmlFor="username"></label>
                        <input 
                            placeholder='Escriba el nombre de usuario' 
                            type="text" 
                            className="form-control" 
                            id="username" 
                            value={usuario} 
                            onChange={(e) => {setUsuario(e.target.value); setError('');}}
                            required 
                            autoComplete="off" 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password"></label>
                        <input 
                            placeholder='Escriba la contraseña'
                            type={mostrarContrasena ? "text" : "password"}
                            className="form-control"
                            id="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="mostrarContrasena"
                            checked={mostrarContrasena}
                            onChange={() => setMostrarContrasena(!mostrarContrasena)}
                        />
                        <label className="checkbox-label" htmlFor="mostrarContrasena">
                            Mostrar contraseña
                        </label>
                    </div>

                    <button className="btn btn-primary btn-block mt-3" onClick={validarDatos}>
                        Iniciar Sesión
                    </button>

                    <div className="mt-3">
                        <Link to="/recuperar-password" className="custom-link-black">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="mt-3">
                        <Link to="/register" className="custom-link-black">
                            ¿No tienes una cuenta? Regístrate aquí
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tarjetas pequeñas de fondo */}
            <div className="small-card bg-success" style={{ top: '20%', left: '10%' }}></div>
            <div className="small-card bg-warning" style={{ top: '40%', right: '15%', transform: 'rotate(-5deg)' }}></div>
            <div className="small-card bg-danger" style={{ bottom: '20%', left: '20%', transform: 'rotate(8deg)' }}></div>
            <div className="small-card bg-danger" style={{ bottom: '30%', right: '10%', transform: 'rotate(-10deg)' }}></div>
        </div>
    );
};

export default Login;
