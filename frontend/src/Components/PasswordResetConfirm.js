// Importación de React y otros hooks necesarios para el componente
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PasswordResetConfirm = () => {
  // Extrae los parámetros de la URL (uidb64 y token) para utilizarlos en la solicitud de restablecimiento de contraseña
  const { uidb64, token } = useParams();

  // Define los estados para las contraseñas, el mensaje de respuesta y la visibilidad de la contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Hook para redirigir al usuario a otra página en caso necesario
  const navigate = useNavigate();

  // Maneja el envío del formulario para restablecer la contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si las contraseñas ingresadas coinciden
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Realiza una solicitud POST a la API para restablecer la contraseña, enviando los datos necesarios
      const response = await axios.post(
        `http://127.0.0.1:8000/password-reset-confirm/${uidb64}/${token}/`,
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',  // Asegura que los datos se envían como JSON
          },
        }
      );

      // Actualiza el mensaje con éxito si la contraseña se restableció correctamente
      setMessage('Contraseña restablecida con éxito.');
    } catch (error) {
      // Maneja posibles errores y establece un mensaje en caso de enlace inválido o expirado
      setMessage('El enlace de restablecimiento es inválido o ha expirado.');
    }
  };

  return (
    // Estructura de la interfaz del formulario de restablecimiento, centrada en la pantalla
    <div className="board-container d-flex justify-content-center align-items-center vh-100">
      <div className="card main-card p-4 text-center">
        {/* Título que indica que es un formulario para restablecer la contraseña */}
        <h2 className="card-title">Restablecer Contraseña</h2>

        {/* Formulario que permite al usuario ingresar una nueva contraseña */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="checkbox-label">Nueva Contraseña:</label>
            <input
              type={showPassword ? 'text' : 'password'}  // Tipo de input que varía según la visibilidad de la contraseña
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-control my-2"  // Clase para estilos de input
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">Confirmar Contraseña:</label>
            <input
              type={showPassword ? 'text' : 'password'}  // Muestra u oculta el texto según la selección del usuario
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control my-2"  // Clase para estilos de input
            />
          </div>

          {/* Checkbox que permite alternar la visibilidad de la contraseña */}
          <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}  // Cambia el estado de visibilidad de la contraseña
            />
            <label className="form-check-label">Mostrar contraseña</label>
          </div>

          {/* Botón para enviar el formulario y restablecer la contraseña */}
          <button type="submit" className="btn btn-primary mt-3 w-100">
            Restablecer Contraseña
          </button>
        </form>

        {/* Muestra un mensaje de éxito o error basado en la respuesta de la API */}
        {message && <p className="mt-3">{message}</p>}

        {/* Enlace para regresar a la página de inicio de sesión */}
        <Link to="/" className="btn btn-primary mt-3 w-100">
          Volver al Inicio de Sesión
        </Link>
      </div>
    </div>
  );
};

// Exporta el componente PasswordResetConfirm para su uso en otras partes de la aplicación
export default PasswordResetConfirm;
