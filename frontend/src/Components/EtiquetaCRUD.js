import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EtiquetaList from './EtiquetaList'; // Componente para mostrar la lista de etiquetas
import EtiquetaForm from './EtiquetaFORM'; // Componente para el formulario de crear/editar etiquetas
import Menu from "./Menu"; // Importa el componente Menu
import Footer from "./Footer"; // Importa el componente Footer

function EtiquetaCRUD() {
  const [etiquetas, setEtiquetas] = useState([]); // Estado para almacenar la lista de etiquetas
  const [etiquetaEdit, setEtiquetaEdit] = useState(null); // Estado para almacenar la etiqueta que será editada
  const [userInfo, setUserInfo] = useState(null); // Estado para almacenar la información del usuario

  const token = localStorage.getItem('access_token'); // Obtener el token del localStorage

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // useEffect para cargar las etiquetas y la información del usuario al montar el componente
  useEffect(() => {
    if (token) {
      fetchEtiquetas();
      fetchUserInfo(); // Obtiene la información del usuario
    } else {
      console.error("No token found");
    }
  }, [token]);

  // Función para obtener todas las etiquetas desde el servidor
  const fetchEtiquetas = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tareas/etiquetas/', config);
      setEtiquetas(response.data); // Actualiza el estado con las etiquetas obtenidas
      console.log("Etiquetas fetched successfully:", response.data);
    } catch (error) {
      console.error('Error al obtener las etiquetas:', error); // Manejo de errores
    }
  };

  // Función para obtener la información del usuario desde el backend
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/current-user/', config); // Ajusta la ruta según la API
      setUserInfo(response.data); // Actualiza el estado con la información del usuario
      console.log("User info fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Función para manejar la creación o actualización de una etiqueta
  const handleSave = async (etiquetaData) => {
    try {
      if (etiquetaEdit) {
        // Si hay una etiqueta seleccionada para editar, realizar PUT (actualización)
        await axios.put(
          `http://127.0.0.1:8000/tareas/etiquetas/${etiquetaEdit.id_etiqueta}/`,
          etiquetaData,
          config
        );
        console.log("Etiqueta updated successfully");
      } else {
        // Si no hay etiqueta seleccionada, realizar POST (crear nueva etiqueta)
        await axios.post('http://127.0.0.1:8000/tareas/etiquetas/', etiquetaData, config);
        console.log("Etiqueta created successfully");
      }

      fetchEtiquetas(); // Recargar la lista de etiquetas después de guardar
      setEtiquetaEdit(null); // Reiniciar el formulario
    } catch (error) {
      console.error('Error al guardar la etiqueta:', error); // Manejo de errores
    }
  };

  // Función para manejar la eliminación de una etiqueta
  const handleDelete = async (idEtiqueta) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tareas/etiquetas/${idEtiqueta}/`, config);
      fetchEtiquetas(); // Recargar la lista después de eliminar la etiqueta
      console.log("Etiqueta deleted successfully:", idEtiqueta);
    } catch (error) {
      console.error('Error al eliminar la etiqueta:', error); // Manejo de errores
    }
  };

  // Función para manejar la edición de una etiqueta
  const handleEdit = (etiqueta) => {
    setEtiquetaEdit(etiqueta); // Asigna la etiqueta seleccionada para editar
  };

  return (
    <div className="dashboard-wrapper login-board bg-light-green" style={{ paddingTop: '50px' }}> {/* Aplicación del mismo estilo de fondo del Dashboard */}
      <Menu userInfo={userInfo} /> {/* Pasa la información del usuario al componente Menu */}
      <div className="container" style={{ marginTop: '80px' }}> {/* Aplica margen superior de 50px */}
        <div className="card mt-4 bg-light" style={{ marginBottom: '80px' }}> {/* Ajuste de margen inferior */}
          <div className="card-body">
            <h3 className="card-title my-4 text-center">GESTIÓN ETIQUETAS</h3> {/* Título centrado */}
            <EtiquetaForm onSave={handleSave} etiquetaEdit={etiquetaEdit} />

            {/* Listado de etiquetas en una tabla dentro de la card */}
            <EtiquetaList 
              etiquetas={etiquetas} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </div>
        </div>
      </div>
      <Footer /> {/* Añade el componente Footer */}
    </div>
  );
}

export default EtiquetaCRUD;
