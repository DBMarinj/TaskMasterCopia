import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskColumn from './TaskColumn';
import TaskFilters from './TaskFilters';
import Menu from "./Menu"; // Importa el componente Menu
import Footer from "./Footer"; // Importa el componente Footer

// Componente principal del tablero Kanban
const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]); // Estado para todas las tareas
    const [filteredTasks, setFilteredTasks] = useState({ // Estado para tareas filtradas por columna
        pendiente: [],
        enProgreso: [],
        completado: []
    });
    const [filter, setFilter] = useState({ // Criterios de filtrado por columna
        pendiente: '',
        enProgreso: '',
        completado: ''
    });
    const [userInfo, setUserInfo] = useState(null); // Estado para la información del usuario

    const token = localStorage.getItem('access_token'); // Obtener el token del localStorage
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // useEffect para cargar las tareas y la información del usuario al montar el componente
    useEffect(() => {
        if (token) {
            fetchTasks(); // Carga las tareas
            fetchUserInfo(); // Carga la información del usuario
        } else {
            console.error("No token found");
        }
    }, [token]);

    // Función para obtener las tareas desde la API
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/tareas/tareas/', config);
            console.log("Tareas obtenidas desde la API:", response.data);
            setTasks(response.data);
            applyAllFilters(response.data); // Aplica filtros iniciales
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Función para obtener la información del usuario desde el backend
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/current-user/', config);
            console.log("User info fetched successfully:", response.data);
            setUserInfo(response.data); // Almacena la información del usuario
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    // Aplica un filtro a una columna específica
    const applyFilter = (estado, criteria) => {
        setFilter(prevFilter => ({ ...prevFilter, [estado]: criteria }));
        const stateTasks = tasks.filter(task => task.estado === getStatusCode(estado));
        const sortedTasks = sortTasks(stateTasks, criteria);

        setFilteredTasks(prevFilteredTasks => ({
            ...prevFilteredTasks,
            [estado]: sortedTasks
        }));
    };

    // Aplica filtros a todas las columnas
    const applyAllFilters = (allTasks) => {
        ['pendiente', 'enProgreso', 'completado'].forEach(estado => {
            const stateTasks = allTasks.filter(task => task.estado === getStatusCode(estado));
            const sortedTasks = sortTasks(stateTasks, filter[estado]);

            setFilteredTasks(prevFilteredTasks => ({
                ...prevFilteredTasks,
                [estado]: sortedTasks
            }));
        });
    };

    // Ordena las tareas según la prioridad o fecha de vencimiento
    const sortTasks = (tasks, criteria) => {
        if (criteria === 'priority') {
            return [...tasks].sort((a, b) => a.prioridad - b.prioridad);
        }
        if (criteria === 'due_date') {
            return [...tasks].sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));
        }
        return tasks;
    };

    // Devuelve el código del estado según el nombre
    const getStatusCode = (estado) => {
        switch (estado) {
            case 'pendiente': return 7;
            case 'enProgreso': return 8;
            case 'completado': return 9;
            default: return null;
        }
    };

    // Actualiza el estado de una tarea
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const updatedTask = tasks.find(task => task.id_tarea === taskId);
            console.log("Tarea antes de actualizar el estado:", updatedTask);
            updatedTask.estado = newStatus;

            await axios.put(`http://127.0.0.1:8000/tareas/tareas/${taskId}/`, updatedTask, config);
            const updatedTasks = tasks.map(task =>
                task.id_tarea === taskId ? updatedTask : task
            );
            setTasks(updatedTasks);
            applyAllFilters(updatedTasks);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    // Elimina una tarea
    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/tareas/tareas/${taskId}/`, config);
            const remainingTasks = tasks.filter(task => task.id_tarea !== taskId);
            setTasks(remainingTasks);
            applyAllFilters(remainingTasks);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="dashboard-wrapper login-board bg-light-green" style={{ paddingTop: '50px' }}> {/* Aplicación del mismo estilo de fondo del Dashboard */} 
            {/* Envoltura con estilo de header sticky */}
            <div className="sticky-header">
                <Menu userInfo={userInfo} />
            </div>
            <div className="container" style={{ marginTop: '80px' }}> {/* Ajuste de margen superior de 50px */}
                <div className="card mt-4 bg-light" style={{ marginBottom: '80px' }}> {/* Ajuste de margen inferior */}
                    <div className="card-body">
                        <h1 className="card-title my-4 text-center">TABLERO DE TAREAS (KANBAN)</h1>
                        <TaskFilters applyFilter={applyFilter} />
                        <div className="row">
                            <TaskColumn
                                title="Pendiente"
                                tasks={filteredTasks['pendiente']}
                                onMoveForward={(taskId) => updateTaskStatus(taskId, 8)}
                                onDeleteTask={deleteTask}
                            />
                            <TaskColumn
                                title="En Progreso"
                                tasks={filteredTasks['enProgreso']}
                                onMoveForward={(taskId) => updateTaskStatus(taskId, 9)}
                                onMoveBackward={(taskId) => updateTaskStatus(taskId, 7)}
                                onDeleteTask={deleteTask}
                            />
                            <TaskColumn
                                title="Completado"
                                tasks={filteredTasks['completado']}
                                onMoveBackward={(taskId) => updateTaskStatus(taskId, 8)}
                                onDeleteTask={deleteTask}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer /> {/* Añade el componente Footer */}
        </div>
    );
};

export default KanbanBoard;
