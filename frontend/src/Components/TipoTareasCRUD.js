import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import TipoTareasForm from './TipoTareasFORM';
import TipoTareasList from './TipoTareasList';
import Menu from "./Menu"; // Importa el componente Menu
import Footer from "./Footer"; // Importa el componente Footer
import './styles.css'; // Aseguramos que se importen los estilos generales

// Componente principal para la gestión de tareas
const TipoTareasCRUD = () => {
  // Estados para almacenar la lista de tareas, la tarea en edición y la información del usuario
  const [tareas, setTareas] = useState([]);
  const [editingTarea, setEditingTarea] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Configuración del token para las peticiones de autenticación
  const token = localStorage.getItem('access_token');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Llamadas a la API al cargar el componente para obtener tareas y datos del usuario
  useEffect(() => {
    if (token) {
      fetchTareas();
      fetchUserInfo(); // Obtiene la información del usuario
    } else {
      console.error("No token found");
    }
  }, [token]);

  // Función para obtener la lista de tareas desde la API
  const fetchTareas = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tareas/tareas/', config);
      setTareas(response.data); // Almacena las tareas en el estado
      console.log("Tareas fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching tareas:", error);
    }
  };

  // Función para obtener la información del usuario desde la API
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/current-user/', config);
      setUserInfo(response.data); // Almacena la información del usuario
      console.log("User info fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Función para crear una nueva tarea y agregarla a la lista
  const handleCreate = async (newTarea) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/tareas/tareas/', newTarea, config);
      setTareas([...tareas, response.data]); // Actualiza la lista de tareas con la nueva tarea
      console.log("Tarea created successfully:", response.data);
    } catch (error) {
      console.error("Error creating tarea:", error);
    }
  };

  // Función para establecer una tarea en modo edición
  const handleEdit = (tarea) => {
    setEditingTarea(tarea); // Almacena la tarea seleccionada en el estado para su edición
  };

  // Función para actualizar una tarea existente
  const handleUpdate = async (updatedTarea) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/tareas/tareas/${updatedTarea.id_tarea}/`, updatedTarea, config);
      setTareas(tareas.map(t => t.id_tarea === updatedTarea.id_tarea ? response.data : t)); // Actualiza la tarea en la lista
      console.log("Tarea updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating tarea:", error);
    }
    setEditingTarea(null); // Limpia el estado de edición
  };

  // Función para eliminar una tarea de la lista
  const handleDelete = async (id_tarea) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tareas/tareas/${id_tarea}/`, config);
      setTareas(tareas.filter(t => t.id_tarea !== id_tarea)); // Filtra la tarea eliminada de la lista
      console.log("Tarea deleted successfully:", id_tarea);
    } catch (error) {
      console.error("Error deleting tarea:", error);
    }
  };

  return (
    <div className="dashboard-wrapper login-board bg-light-green" style={{ paddingTop: '50px' }}> {/* Aplicación del mismo estilo de fondo del Dashboard */} 
      <Menu userInfo={userInfo} /> {/* Usa el componente Menu y pasa userInfo */}
      <div className="container" style={{ marginTop: '80px' }}> {/* Ajuste de margen superior */}
        <div className="card mt-4 bg-light" style={{ marginBottom: '80px' }}> {/* Ajuste de margen inferior */}
          <div className="card-body">
            <h3 className="card-title my-4 text-center">GESTIÓN TAREAS</h3>
            <TipoTareasForm
              tipoTareasInicial={editingTarea}
              onSave={editingTarea ? handleUpdate : handleCreate} // Usa la función correcta según el modo de edición
            />
            <TipoTareasList
              tareas={tareas} // Pasa la lista de tareas al componente de lista
              onEdit={handleEdit} // Pasa la función de edición
              onDelete={handleDelete} // Pasa la función de eliminación
            />
          </div>
        </div>
      </div>
      <Footer /> {/* Añade el componente Footer */}
    </div>
  );
};

export default TipoTareasCRUD;
