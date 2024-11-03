import React from 'react';

// Función para mapear los números de prioridad a sus nombres
const getPriorityName = (priority) => {
    switch (priority) {
        case 7:
            return 'Baja';
        case 8:
            return 'Media';
        case 9:
            return 'Alta';
        default:
            return 'No asignada';
    }
};

// Función para mapear los números de estado a sus nombres
const getStateName = (state) => {
    switch (state) {
        case 7:
            return 'Pendiente';
        case 8:
            return 'En Progreso';
        case 9:
            return 'Completado';
        default:
            return 'Desconocido';
    }
};

// Función para obtener la clase de Bootstrap según el estado de la tarea
const getBootstrapBgClass = (state) => {
    switch (state) {
        case 7:
            return 'bg-success bg-opacity-25'; // Verde claro
        case 8:
            return 'bg-warning bg-opacity-25'; // Naranja claro
        case 9:
            return 'bg-danger bg-opacity-25'; // Rojo claro
        default:
            return 'bg-light'; // Fondo claro por defecto
    }
};

const TaskCard = ({ task, onMoveForward, onMoveBackward, onShowDetails, onDeleteTask, index, state }) => {
    console.log("Datos de la tarea:", task); // Verificar los datos de cada tarea

    // Función para generar el título dinámicamente según el estado y usando el campo 'título'
    const generateTaskTitle = () => {
        return task.titulo ? task.titulo : `Tarea sin título (${state})`;
    };

    return (
        // Aplicar la clase de fondo de Bootstrap según el estado de la tarea
        <div className={`card mb-2 ${getBootstrapBgClass(task.estado)}`}>
            <div className="card-body">
                {/* Usar la función generateTaskTitle para mostrar el título correcto basado en el campo 'título' */}
                <h5 className="card-title">{generateTaskTitle()}</h5>

                {/* Mostrar la prioridad de la tarea usando la función para obtener el nombre de prioridad */}
                <p className="card-text">
                    <small className="text-muted">Prioridad: {getPriorityName(task.prioridad) || 'No asignada'}</small>
                </p>

                {/* Mostrar el estado de la tarea usando la función para obtener el nombre del estado */}
                <p className="card-text">
                    <small className="text-muted">Estado: {getStateName(task.estado) || 'Desconocido'}</small>
                </p>

                {/* Mostrar la fecha de vencimiento de la tarea */}
                <p className="card-text">
                    <small className="text-muted">
                        Fecha de vencimiento: {task.fecha_vencimiento ? new Date(task.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}
                    </small>
                </p>

                {/* Botones para mover la tarea entre estados */}
                <div className="btn-group">
                    {onMoveBackward && (
                        <button className="btn btn-secondary" onClick={() => onMoveBackward(task.id_tarea)}>
                            &lt;
                        </button>
                    )}
                    {onMoveForward && (
                        <button className="btn btn-primary" onClick={() => onMoveForward(task.id_tarea)}>
                            &gt;
                        </button>
                    )}
                </div>

                {/* Botón con ícono de lupa para ver detalles */}
                <button className="btn btn-info ms-2" onClick={onShowDetails}>
                    <i className="fas fa-search"></i> Ver detalles {/* Ícono de lupa y texto "Ver detalles" */}
                </button>

                {/* Botón para eliminar la tarea solo si está en estado completado */}
                {task.estado === 9 && (
                    <button className="btn btn-danger ms-2" onClick={() => onDeleteTask(task.id_tarea)}>
                        <i className="fas fa-trash"></i> Eliminar {/* Ícono de basura y texto "Eliminar" */}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
