import React from 'react';

const TaskFilters = ({ applyFilter }) => {
    const filterOptions = [
        { estado: 'pendiente', label: 'Filtrar tareas pendientes por:' },
        { estado: 'enProgreso', label: 'Filtrar tareas en progreso por:' },
        { estado: 'completado', label: 'Filtrar tareas completadas por:' }
    ];

    const handleFilterChange = (e, estado) => {
        const selectedFilter = e.target.value;
        console.log(`Filtro seleccionado para ${estado}:`, selectedFilter); // Verificar el filtro seleccionado
        applyFilter(estado, selectedFilter);
    };

    return (
        <div className="mb-4">
            {filterOptions.map(({ estado, label }) => (
                <div key={estado}>
                    <label htmlFor={`filter${estado}`} className="form-label">{label}</label>
                    <select
                        id={`filter${estado}`}
                        className="form-select"
                        onChange={(e) => handleFilterChange(e, estado)}
                    >
                        <option value="">Sin filtro</option>
                        <option value="priority">Prioridad</option>
                        <option value="due_date">Fecha de vencimiento</option>
                    </select>
                </div>
            ))}
        </div>
    );
};

export default TaskFilters;
