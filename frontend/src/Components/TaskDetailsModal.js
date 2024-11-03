import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Usaremos React-Bootstrap para crear el modal

// Función para obtener el nombre del estado
const getNombreEstado = (idEstado) => {
    switch (idEstado) {
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

// Función para obtener el nombre de la prioridad
const getNombrePrioridad = (idPrioridad) => {
    switch (idPrioridad) {
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

// Función para obtener el nombre de la etiqueta
const getNombreEtiqueta = (etiquetas) => {
    if (!etiquetas || etiquetas.length === 0) {
        return 'Sin etiqueta';
    }
    return etiquetas[0]?.nombre || 'Sin nombre'; // Mostrar solo la primera etiqueta si hay más de una
};

const TaskDetailsModal = ({ show, handleClose, task }) => {
    if (!task) return null; // Si no hay tarea seleccionada, no mostrar nada

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de la Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Título:</strong> {task.titulo || 'Sin título'}</p> {/* Mostrar el campo título */}
                <p><strong>Descripción:</strong> {task.descripcion || 'Sin descripción'}</p>
                {/* Mostrar el nombre de la prioridad */}
                <p><strong>Prioridad:</strong> {getNombrePrioridad(task.prioridad)}</p>
                <p><strong>Fecha de Vencimiento:</strong> {task.fecha_vencimiento ? new Date(task.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}</p>
                {/* Mostrar el nombre del estado */}
                <p><strong>Estado:</strong> {getNombreEstado(task.estado)}</p>
                {/* Mostrar las etiquetas */}
                <p><strong>Etiqueta:</strong> {getNombreEtiqueta(task.etiquetas)}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskDetailsModal;
