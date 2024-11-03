import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu"; // Importa el componente Menu
import Footer from "./Footer"; // Importa el componente Footer (asegúrate de que exista)
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la redirección

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate(); // Hook para redirigir

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    } else {
      console.error("No token found");
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/current-user/", config);
      setUserInfo(response.data);
      console.log("User Info fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Función para volver al dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard"); // Redirige al dashboard
  };

  return (
    <div className="bg-white text-black min-vh-100 d-flex flex-column">
      <Menu userInfo={userInfo} /> {/* Usa el componente Menu y pasa userInfo */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center bg-light text-dark">
        {/* Fondo claro, tarjeta centrada en ancho y alto */}
        <div
          className="card bg-white shadow"
          style={{ maxWidth: "800px", width: "100%" }} // Cambia el maxWidth a 800px
        >
          <div className="card-body">
            {/* Título y separación */}
            <div className="card-header bg-primary text-white text-center mb-4">
              {/* Fondo primario y texto blanco */}
              <h3 className="card-title">Información del Usuario</h3>
            </div>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Nombre:</strong> {userInfo.nombre}</p>
                <p><strong>Apellido:</strong> {userInfo.apellido}</p>
                <p><strong>Celular:</strong> {userInfo.celular}</p>
                <p><strong>Dirección:</strong> {userInfo.direccion}</p>
                <p style={{ wordBreak: "break-word" }}> {/* Evita el corte del texto a mitad de palabras */}
                  <strong>Email:</strong> {userInfo.email || "No proporcionado"}
                </p>
                <p><strong>Estado:</strong> {userInfo.estado ? "Activo" : "Inactivo"}</p>
              </div>
            </div>
            {/* Botón para redirigir al dashboard */}
            <div className="text-center mt-4">
              <button className="btn btn-primary" onClick={handleBackToDashboard}>
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "60px" }} /> {/* Espacio inferior agregado */}
      <Footer /> {/* Añadir el componente Footer */}
    </div>
  );
};

export default UserProfile;
