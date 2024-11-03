import React, { useState } from 'react';
import TaskCard from './TaskCard'; // Componente para mostrar cada tarea
import TaskDetailsModal from './TaskDetailsModal'; // Componente modal para mostrar los detalles de la tarea

const TaskColumn = ({ title, tasks, onMoveForward, onMoveBackward, onDeleteTask }) => {
    const [selectedTask, setSelectedTask] = useState(null); // Estado para la tarea seleccionada
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    // Función para mostrar el modal con los detalles de la tarea
    const handleShowDetails = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    return (
        <div className="col-md-4"> {/* Cada columna ocupa 4/12 del espacio */}
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h2 className="h5">{title}</h2>
                </div>
                <div className="card-body">
                    {tasks.length === 0 ? (
                        <p>No hay tareas</p>
                    ) : (
                        tasks.map((task, index) => (
                            <TaskCard 
                                key={task.id_tarea} 
                                task={task}
                                onMoveForward={onMoveForward}
                                onMoveBackward={onMoveBackward}
                                onShowDetails={() => handleShowDetails(task)} // Pasar la función para mostrar detalles
                                onDeleteTask={onDeleteTask} // Pasar la función para eliminar tareas
                                index={index} // Pasar el índice para numerar las tareas
                                state={title.toLowerCase()} // Pasar el estado según el título (pendiente, en progreso, completada)
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Modal para mostrar detalles de la tarea */}
            <TaskDetailsModal
                show={showModal}
                handleClose={handleCloseModal}
                task={selectedTask}
            />
        </div>
    );
};

export default TaskColumn;
