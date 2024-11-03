import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

// Componente de lista de tareas que recibe tareas, funciones de edición y eliminación como props
function TipoTareasList({ tareas, onEdit, onDelete }) {
  // Estados locales para almacenar los datos de estados, prioridades y etiquetas obtenidos del backend
  const [estados, setEstados] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]); // Estado para almacenar etiquetas

  // useEffect para realizar la solicitud al backend una vez que el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el token de autenticación desde localStorage
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Realizar las solicitudes a las API para obtener estados, prioridades y etiquetas en paralelo
        const [estadosResponse, prioridadesResponse, etiquetasResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/tareas/estados/', config),
          axios.get('http://127.0.0.1:8000/tareas/prioridades/', config),
          axios.get('http://127.0.0.1:8000/tareas/etiquetas/', config),
        ]);

        // Actualizar los estados locales con los datos obtenidos
        setEstados(estadosResponse.data);
        setPrioridades(prioridadesResponse.data);
        setEtiquetas(etiquetasResponse.data); // Guardar las etiquetas en el estado local
      } catch (error) {
        console.error('Error al obtener estados, prioridades o etiquetas:', error);
      }
    };

    fetchData();
  }, []);

  // Función para obtener el nombre del estado dado su id_estado
  const obtenerNombreEstado = (id_estado) => {
    const estado = estados.find((e) => e.id_estado === id_estado);
    return estado ? estado.nombre : 'Desconocido';
  };

  // Función para obtener el nombre de la prioridad dado su id_prioridad
  const obtenerNombrePrioridad = (id_prioridad) => {
    const prioridad = prioridades.find((p) => p.id_prioridad === id_prioridad);
    return prioridad ? prioridad.nombre : 'Desconocido';
  };

  // Función para obtener el nombre de la etiqueta dado su id_etiqueta
  const obtenerNombreEtiqueta = (id_etiqueta) => {
    const etiqueta = etiquetas.find((e) => e.id_etiqueta === id_etiqueta);
    return etiqueta ? etiqueta.nombre : 'Sin Etiqueta';
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Tareas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha de Vencimiento</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Etiqueta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id_tarea}>
              <td>{tarea.titulo}</td>
              <td>{tarea.descripcion}</td>
              <td>{moment(tarea.fecha_vencimiento).format('YYYY-MM-DD')}</td> {/* Formatear fecha */}
              <td>{obtenerNombrePrioridad(tarea.prioridad)}</td>
              <td>{obtenerNombreEstado(tarea.estado)}</td>
              <td>
                {tarea.etiquetas && tarea.etiquetas.length > 0
                  ? obtenerNombreEtiqueta(tarea.etiquetas[0].id_etiqueta)
                  : 'Sin Etiqueta'}
              </td>
              <td>
                <button className="btn btn-primary mr-2" onClick={() => onEdit(tarea)}>Editar</button>
                <button className="btn btn-danger" onClick={() => onDelete(tarea.id_tarea)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TipoTareasList;
