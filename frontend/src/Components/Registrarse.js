import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap para el estilo

const Registrarse = () => {
    // Definición de estados para los datos del formulario
    const [celular, setCelular] = useState('');
    const [direccion, setDireccion] = useState('');
    const [apellido, setApellido] = useState('');
    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false); // Estado para controlar si se muestra la contraseña
    const [errores, setErrores] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Función para manejar el registro del usuario
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrores('');
        setMensajeExito('');

        console.log("Intentando registrar usuario..."); // Para verificar cuando comienza el registro

        // Validación de campos vacíos
        if (!nombre || !apellido || !username || !email || !contrasena || !celular || !direccion) {
            setErrores('Todos los campos son obligatorios');
            console.log("Error: Faltan campos obligatorios."); // Mensaje para revisar campos incompletos
            return;
        }

        try {
            console.log("Datos enviados al backend:", { nombre, apellido, username, email, celular, direccion }); // Muestra los datos que se van a enviar

            // Solicitud HTTP POST al backend
            const response = await axios.post('http://127.0.0.1:8000/register/', {
                nombre,
                apellido,
                username,
                email,
                password: contrasena,
                celular,
                direccion
            });

            console.log("Respuesta exitosa:", response.data); // Muestra la respuesta del backend
            setMensajeExito('Registro exitoso, ya puedes iniciar sesión');

            // Aquí puedes agregar alguna redirección o limpiar el formulario si es necesario
        } catch (error) {
            console.log("Error al registrar el usuario:", error); // Muestra el error en caso de fallo
            setErrores('Ocurrió un error al registrar el usuario');
        }
    };

    // Función para manejar la redirección al hacer clic en "Volver"
    const handleVolver = () => {
        window.location.href = 'http://localhost:3000/'; // Redirige a la página de inicio
    };

    return (
        <div className="bg-white text-dark min-vh-100"> {/* Aplica el mismo estilo que el menú */}
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-center">Registrarse</h2>
                            </div>
                            <div className="card-body">
                                {/* Mostrar mensajes de error o éxito */}
                                {errores && <div className="alert alert-danger">{errores}</div>}
                                {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}

                                <form onSubmit={handleRegister}>
                                    {/* Campos del formulario */}
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellido</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={apellido}
                                            onChange={(e) => setApellido(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contraseña</label>
                                        <input
                                            type={mostrarContrasena ? "text" : "password"} // Controla si se muestra como texto o password
                                            className="form-control"
                                            value={contrasena}
                                            onChange={(e) => setContrasena(e.target.value)}
                                            autoComplete="new-password" // Desactiva el autocompletado para la contraseña
                                        />
                                    </div>
                                    <div className="form-group form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="mostrarContrasena"
                                            checked={mostrarContrasena}
                                            onChange={() => setMostrarContrasena(!mostrarContrasena)} // Alterna el estado
                                        />
                                        <label className="form-check-label" htmlFor="mostrarContrasena">
                                            Mostrar contraseña
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>Celular</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={celular}
                                            onChange={(e) => setCelular(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Dirección</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
                                        />
                                    </div>

                                    {/* Fila flexible para los botones */}
                                    <div className="d-flex justify-content-between mt-3">
                                        {/* Botón para enviar el formulario */}
                                        <button type="submit" className="btn btn-primary">
                                            Registrarse
                                        </button>
                                        {/* Botón para redirigir a la página principal */}
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleVolver}
                                        >
                                            Volver
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registrarse;
