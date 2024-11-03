import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrioridadForm from './PrioridadFORM'; // Componente para el formulario de crear/editar prioridades
import PrioridadList from './PrioridadList'; // Componente para mostrar la lista de prioridades
import Menu from "./Menu"; // Importa el componente Menu
import Footer from "./Footer"; // Importa el componente Footer

const PrioridadCRUD = () => {
  const [prioridades, setPrioridades] = useState([]); // Estado para almacenar la lista de prioridades
  const [prioridadEdit, setPrioridadEdit] = useState(null); // Estado para almacenar la prioridad que será editada
  const [userInfo, setUserInfo] = useState(null); // Estado para la información del usuario

  const token = localStorage.getItem('access_token'); // Obtiene el token del localStorage
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // useEffect para cargar prioridades y la información del usuario al montar el componente
  useEffect(() => {
    if (token) {
      fetchPrioridades();
      fetchUserInfo(); // Obtiene la información del usuario
    } else {
      console.error("No token found");
    }
  }, [token]);

  // Función para obtener todas las prioridades desde el servidor
  const fetchPrioridades = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tareas/prioridades/', config);
      setPrioridades(response.data);
      console.log("Prioridades fetched successfully:", response.data);
    } catch (error) {
      console.error('Error al obtener las prioridades:', error);
    }
  };

  // Función para obtener la información del usuario desde el backend
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/current-user/', config); // Ajusta la ruta según la API
      setUserInfo(response.data);
      console.log("User info fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Función para manejar la creación o actualización de una prioridad
  const handleSave = async (prioridadData) => {
    try {
      if (prioridadEdit) {
        const response = await axios.put(
          `http://127.0.0.1:8000/tareas/prioridades/${prioridadEdit.id_prioridad}/`,
          prioridadData,
          config
        );
        console.log("Prioridad updated successfully:", response.data);
      } else {
        const response = await axios.post(
          'http://127.0.0.1:8000/tareas/prioridades/',
          prioridadData,
          config
        );
        console.log("Prioridad created successfully:", response.data);
      }

      fetchPrioridades(); // Recargar la lista de prioridades
      setPrioridadEdit(null); // Reiniciar el formulario
    } catch (error) {
      console.error('Error al guardar la prioridad:', error);
    }
  };

  // Función para manejar la eliminación de una prioridad
  const handleDelete = async (idPrioridad) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tareas/prioridades/${idPrioridad}/`, config);
      fetchPrioridades(); // Recargar la lista de prioridades
      console.log("Prioridad deleted successfully:", idPrioridad);
    } catch (error) {
      console.error('Error al eliminar la prioridad:', error);
    }
  };

  // Función para manejar la edición de una prioridad
  const handleEdit = (prioridad) => {
    setPrioridadEdit(prioridad); // Asigna la prioridad seleccionada para editar
  };

  return (
    <div className="dashboard-wrapper login-board bg-light-green" style={{ paddingTop: '50px' }}> {/* Aplicación del mismo estilo de fondo del Dashboard */}
      <Menu userInfo={userInfo} /> {/* Pasa la información del usuario al componente Menu */}
      <div className="container" style={{ marginTop: '80px' }}> {/* Aplica margen superior de 50px */}
        <div className="card mt-4 bg-light" style={{ marginBottom: '80px' }}> {/* Ajuste de margen inferior */}
          <div className="card-body">
            <h3 className="card-title my-4 text-center">GESTIÓN PRIORIDADES</h3>
            <PrioridadForm onSave={handleSave} prioridadEdit={prioridadEdit} />
            <PrioridadList
              prioridades={prioridades}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
      <Footer /> {/* Añade el componente Footer */}
    </div>
  );
};

export default PrioridadCRUD;
