import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';
import Footer from "./Footer"; // Importa el componente Footer
import './styles.css'; // Asegúrate de importar los estilos para mantener la misma apariencia

const ChangePassword = () => {
  // Estados para las contraseñas y mensajes
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Información del usuario

  // Estados para mostrar u ocultar las contraseñas
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Función para alternar la visibilidad de las contraseñas
  const togglePasswordVisibility = (field) => {
    if (field === 'old') setShowOldPassword(!showOldPassword);
    else if (field === 'new') setShowNewPassword(!showNewPassword);
    else if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  // Función para obtener la información del usuario desde la API
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://127.0.0.1:8000/current-user/', config);
      setUserInfo(response.data); // Guarda la información del usuario en el estado
      console.log('User info fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Obtener datos del usuario al cargar el componente
  }, []);

  // Maneja el envío del formulario de cambio de contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.put(
        'http://127.0.0.1:8000/change-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        }
      );
      setMessage(response.data.status); // Muestra el estado de la operación
      setPasswordChanged(true); // Marca que la contraseña ha sido cambiada
    } catch (error) {
      console.error('Error durante el cambio de contraseña:', error);
      
      // Verifica si el error es por contraseña actual incorrecta
      if (error.response && error.response.status === 400 && error.response.data.old_password) {
        setMessage('Error, la contraseña actual es incorrecta.');
      
      // Verifica si el error es por no cumplir con los requisitos de la nueva contraseña
      } else if (error.response && error.response.status === 400 && error.response.data.new_password) {
        setMessage(`No cumple con los requisitos para la nueva contraseña: ${error.response.data.new_password.join(', ')}`);
      
      // Manejamos otros posibles errores
      } else {
        setMessage('Error desconocido al intentar cambiar la contraseña.');
      }
    }
  };

  // Maneja el cierre de sesión y redirige al usuario
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <div className="dashboard-wrapper login-board bg-light-green min-vh-100"> {/* Fondo y estilo de wrapper similares al archivo Dashboard */}
      <Menu userInfo={userInfo} /> {/* Pasa la información del usuario al componente Menu */}
      
      {/* Contenedor principal con margen superior */}
      <div className="container" style={{ paddingTop: '50px' }}> 
        <div className="card mt-4 bg-light">
          <div className="card-body">
            <h1 className="card-title my-4 text-center">CAMBIAR CONTRASEÑA</h1>
            {message && <div className="alert alert-info text-center">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Contraseña Actual</label>
                <div className="input-group">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    className="form-control"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePasswordVisibility('old')}
                    >
                      {showOldPassword ? '👁‍🗨' : '👁'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <div className="input-group">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showNewPassword ? '👁‍🗨' : '👁'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showConfirmPassword ? '👁‍🗨' : '👁'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary mt-3">
                  Cambiar Contraseña
                </button>
                {passwordChanged && (
                  <button type="button" className="btn btn-primary mt-3" onClick={handleLogout}>
                    Volver a Autenticarme
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer /> {/* Añade el componente Footer */}
    </div>
  );
};

export default ChangePassword;
