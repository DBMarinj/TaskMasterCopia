import React, { useState } from 'react'; // Importa React y el hook useState para manejar el estado del componente.
import axios from 'axios'; // Importa axios para realizar solicitudes HTTP.

const RecuperarPassword = () => {
    // Definición de estados locales del componente para manejar el email, mensajes y errores.
    const [email, setEmail] = useState(''); // Estado para almacenar el email ingresado por el usuario.
    const [mensaje, setMensaje] = useState(''); // Estado para almacenar un mensaje de éxito tras el envío de la solicitud.
    const [errores, setErrores] = useState(''); // Estado para almacenar posibles errores en la solicitud.

    // Función asíncrona que maneja la solicitud de recuperación de contraseña.
    const informacionRecuperacion = async () => {
        try {
            // Envía una solicitud POST a la API para enviar el enlace de recuperación.
            const respuesta = await axios.post('http://127.0.0.1:8000/password-reset/', { email });
            // Si la solicitud es exitosa, se muestra un mensaje informativo al usuario.
            setMensaje('Favor revisar la bandeja de entrada de tu correo y darle clic en el enlace.');
            setErrores(''); // Limpia los errores si la solicitud es exitosa.
        } catch (error) {
            // En caso de error, muestra un mensaje de error y lo registra en la consola.
            console.error('Error en la solicitud:', error.response || error.message);
            setErrores('Error al enviar el enlace de recuperación, por favor intenta nuevamente.');
        }
    };

    // Función para manejar la redirección al hacer clic en "Volver"
    const handleVolver = () => {
        window.location.href = 'http://localhost:3000/'; // Redirige a la página de inicio
    };

    // Retorna el componente JSX que renderiza el formulario para ingresar el email y enviar la solicitud.
    return (
        <div className="bg-white text-dark min-vh-100"> {/* Contenedor principal con estilos globales de fondo blanco y texto oscuro. */}            
            <div className="container mt-5"> {/* Contenedor que centra el contenido en la página. */}
                <div className="row justify-content-center"> {/* Centra el formulario horizontalmente. */}
                    <div className="col-md-6"> {/* Define un ancho de columna para el formulario. */}
                        <div className="card"> {/* Crea una tarjeta visual para el formulario. */}
                            <div className="card-header text-center">
                                <h2>Recuperación de contraseña</h2> {/* Título del formulario. */}
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Email</label> {/* Etiqueta para el campo de email. */}
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email} // El valor del input es el estado 'email'.
                                        onChange={(e) => setEmail(e.target.value)} // Actualiza el estado 'email' con el valor ingresado por el usuario.
                                        placeholder="Escriba su email" // Texto de ayuda en el input.
                                    />
                                </div>

                                {/* Fila flexible para los botones */}
                                <div className="d-flex justify-content-between mt-3">
                                    {/* Botón para enviar el formulario */}
                                    <button className="btn btn-primary" onClick={informacionRecuperacion}>
                                        Enviar enlace de recuperación {/* Botón que dispara la solicitud de recuperación. */}
                                    </button>
                                    {/* Botón para redirigir a la página principal */}
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleVolver} // Redirige a la página principal (http://localhost:3000/).
                                    >
                                        Volver {/* Botón que redirige a la página de inicio */}
                                    </button>
                                </div>

                                {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>} {/* Muestra el mensaje de éxito si existe. */}
                                {errores && <div className="alert alert-danger mt-3">{errores}</div>} {/* Muestra el mensaje de error si existe. */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuperarPassword; // Exporta el componente para que pueda ser usado en otras partes de la aplicación.
