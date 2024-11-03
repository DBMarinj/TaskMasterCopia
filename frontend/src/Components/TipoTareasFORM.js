import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode correctamente

function TipoTareasForm({ tipoTareasInicial, onSave }) {
  const token = localStorage.getItem('access_token');
  let userId;

  // Decodificar el token para obtener el ID del usuario
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.user_id; // Se asume que el campo en el token es 'user_id'
  }

  const [id_tarea, setIdTarea] = useState(tipoTareasInicial ? tipoTareasInicial.id_tarea : '');
  const [titulo, setTitulo] = useState(tipoTareasInicial ? tipoTareasInicial.titulo : '');
  const [descripcion, setDescripcion] = useState(tipoTareasInicial ? tipoTareasInicial.descripcion : '');
  const [fecha_vencimiento, setFechaVencimiento] = useState(tipoTareasInicial ? moment(tipoTareasInicial.fecha_vencimiento).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')); // Formateo corregido
  const [prioridad, setPrioridad] = useState(tipoTareasInicial ? tipoTareasInicial.prioridad : '');
  const [estado, setEstado] = useState(tipoTareasInicial ? tipoTareasInicial.estado : '');
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState(''); // Nueva variable para manejar la etiqueta seleccionada
  const [etiquetas, setEtiquetas] = useState([]); // Estado para almacenar las opciones de etiquetas

  // Estado para almacenar listas de estados y prioridades
  const [estados, setEstados] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]); // Estado para almacenar las etiquetas disponibles

  // Calcular la fecha actual en formato YYYY-MM-DD usando moment
  const currentDate = moment().format('YYYY-MM-DD');

  // Obtener estados, prioridades y etiquetas al cargar el formulario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [estadosResponse, prioridadesResponse, etiquetasResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/tareas/estados/', config),
          axios.get('http://127.0.0.1:8000/tareas/prioridades/', config),
          axios.get('http://127.0.0.1:8000/tareas/etiquetas/', config), // Nueva solicitud para etiquetas
        ]);

        setEstados(estadosResponse.data);
        setPrioridades(prioridadesResponse.data);
        setEtiquetasDisponibles(etiquetasResponse.data); // Asignar las etiquetas obtenidas
      } catch (error) {
        console.error('Error al obtener estados, prioridades o etiquetas:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tipoTareasInicial) {
      setIdTarea(tipoTareasInicial.id_tarea);
      setTitulo(tipoTareasInicial.titulo);
      setDescripcion(tipoTareasInicial.descripcion);
      setFechaVencimiento(moment(tipoTareasInicial.fecha_vencimiento).format('YYYY-MM-DD')); // Formatear la fecha al cargar la tarea
      setPrioridad(tipoTareasInicial.prioridad);
      setEstado(tipoTareasInicial.estado);
      setEtiquetaSeleccionada(tipoTareasInicial.etiquetas ? tipoTareasInicial.etiquetas[0]?.id_etiqueta : ''); // Preseleccionar la etiqueta
    }
  }, [tipoTareasInicial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const etiquetasSeleccionadas = etiquetaSeleccionada
      ? [{ id_etiqueta: parseInt(etiquetaSeleccionada), nombre: etiquetasDisponibles.find(e => e.id_etiqueta === parseInt(etiquetaSeleccionada))?.nombre }]
      : [];
    
    const tipoTareasData = {
      id_tarea,
      titulo,
      descripcion,
      fecha_vencimiento,
      usuario: userId, // Asignar el ID del usuario de manera automática
      prioridad: parseInt(prioridad), // Convertir a número antes de enviar
      estado: parseInt(estado), // Convertir a número antes de enviar
      etiquetas: etiquetasSeleccionadas, // Enviar las etiquetas con id_etiqueta y nombre
    };

    onSave(tipoTareasData);

    // Limpiar los campos después de guardar
    setIdTarea('');
    setTitulo('');
    setDescripcion('');
    setFechaVencimiento('');
    setPrioridad('');
    setEstado('');
    setEtiquetaSeleccionada(''); // Limpiar etiqueta seleccionada
  };

  return (
    <div className="container card mt-4 p-4">
      <h2>{tipoTareasInicial ? "Editar Tarea" : "Crear Tarea"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha de Vencimiento:</label>
          <input
            type="date"
            className="form-control"
            value={fecha_vencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            min={currentDate} // Establecer la fecha mínima como la fecha actual
            required
          />
        </div>

        {/* Dropdown de Prioridad */}
        <div className="form-group">
          <label>Prioridad:</label>
          <select
            className="form-control"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            required
          >
            <option value="">Seleccionar Prioridad</option>
            {prioridades.map((p) => (
              <option key={p.id_prioridad} value={p.id_prioridad}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown de Estado */}
        <div className="form-group">
          <label>Estado:</label>
          <select
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="">Seleccionar Estado</option>
            {estados.map((e) => (
              <option key={e.id_estado} value={e.id_estado}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown de Etiquetas */}
        <div className="form-group">
          <label>Etiqueta:</label>
          <select
            className="form-control"
            value={etiquetaSeleccionada}
            onChange={(e) => setEtiquetaSeleccionada(e.target.value)}
            required
          >
            <option value="">Seleccionar Etiqueta</option>
            {etiquetasDisponibles.map((etiqueta) => (
              <option key={etiqueta.id_etiqueta} value={etiqueta.id_etiqueta}>
                {etiqueta.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          {tipoTareasInicial ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}

export default TipoTareasForm;
