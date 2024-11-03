import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import EstadoForm from './EstadoForm'; // Componente para el formulario de crear/editar estados
import EstadoList from './EstadoList'; // Componente para mostrar la lista de estados
import Menu from "./Menu"; // Importa el componente Menu
import Footer from "./Footer"; // Importa el componente Footer

function EstadoCRUD() {
  const [estados, setEstados] = useState([]); // Estado para almacenar la lista de estados
  const [estadoEdit, setEstadoEdit] = useState(null); // Estado para almacenar el estado que será editado
  const [userInfo, setUserInfo] = useState(null); // Estado para almacenar la información del usuario

  const token = localStorage.getItem('access_token'); // Obtener el token del localStorage

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // useEffect para cargar los estados y la información del usuario al montar el componente
  useEffect(() => {
    if (token) {
      fetchEstados(); // Cargar la lista de estados
      fetchUserInfo(); // Obtener la información del usuario
    } else {
      console.error("No token found");
    }
  }, [token]);

  // Función para obtener todos los estados desde el servidor
  const fetchEstados = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tareas/estados/', config);
      setEstados(response.data); // Actualiza el estado con los estados obtenidos
      console.log("Estados fetched successfully:", response.data);
    } catch (error) {
      console.error('Error al obtener los estados:', error); // Manejo de errores
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

  // Función para manejar la creación o actualización de un estado
  const handleSave = async (estadoData) => {
    try {
      if (estadoEdit) {
        // Si hay un estado seleccionado para editar, realizar PUT (actualización)
        await axios.put(
          `http://127.0.0.1:8000/tareas/estados/${estadoEdit.id_estado}/`,
          estadoData,
          config
        );
        console.log("Estado updated successfully");
      } else {
        // Si no hay estado seleccionado, realizar POST (crear nuevo estado)
        await axios.post('http://127.0.0.1:8000/tareas/estados/', estadoData, config);
        console.log("Estado created successfully");
      }

      fetchEstados(); // Recargar la lista de estados después de guardar
      setEstadoEdit(null); // Reiniciar el formulario
    } catch (error) {
      console.error('Error al guardar el estado:', error); // Manejo de errores
    }
  };

  // Función para manejar la eliminación de un estado
  const handleDelete = async (idEstado) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tareas/estados/${idEstado}/`, config);
      fetchEstados(); // Recargar la lista después de eliminar el estado
      console.log("Estado deleted successfully:", idEstado);
    } catch (error) {
      console.error('Error al eliminar el estado:', error); // Manejo de errores
    }
  };

  // Función para manejar la edición de un estado (llena el formulario con los datos del estado seleccionado)
  const handleEdit = (estado) => {
    setEstadoEdit(estado); // Asigna el estado seleccionado para editar
  };

  return (
    <div className="dashboard-wrapper login-board bg-light-green" style={{ paddingTop: '50px' }}> {/* Aplicación del mismo estilo de fondo del Dashboard */}
      <Menu userInfo={userInfo} /> {/* Pasa la información del usuario al componente Menu */}
      <div className="container" style={{ marginTop: '80px', marginBottom: '80px' }}> {/* Aplica margen superior e inferior */}
        {/* Card para gestionar los estados */}
        <div className="card bg-light"> {/* Añadida clase de fondo bg-light para un gris claro */}
          <div className="card-header text-center"> {/* Encabezado de la card centrado */}
            <h3>GESTIÓN ESTADOS</h3> {/* Título centrado */}
          </div>
          <div className="card-body">
            {/* Formulario para agregar o editar estados */}
            <EstadoForm onSave={handleSave} estadoEdit={estadoEdit} />

            {/* Listado de estados en una tabla dentro de la card */}
            <EstadoList
              estados={estados}
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

export default EstadoCRUD;
