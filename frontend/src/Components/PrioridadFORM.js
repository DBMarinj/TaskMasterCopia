import React, { useState, useEffect } from 'react';

const PrioridadForm = ({ onSave, prioridadEdit }) => {
  const [nombre, setNombre] = useState('');

  // Si se pasa una prioridad para editar, cargamos sus valores en el formulario
  useEffect(() => {
    if (prioridadEdit) {
      setNombre(prioridadEdit.nombre);
    } else {
      setNombre('');
    }
  }, [prioridadEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Objeto con los datos de la prioridad
    const prioridadData = { nombre };

    // Llama a la función onSave para crear o actualizar la prioridad
    onSave(prioridadData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre de la Prioridad</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        {prioridadEdit ? 'Actualizar Prioridad' : 'Crear Prioridad'}
      </button>
    </form>
  );
};

export default PrioridadForm;
