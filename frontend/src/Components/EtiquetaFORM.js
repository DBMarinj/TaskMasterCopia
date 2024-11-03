import React, { useState, useEffect } from 'react';

function EtiquetaForm({ onSave, etiquetaEdit }) {
  const [nombre, setNombre] = useState(''); // Estado para el campo nombre

  // Efecto para llenar el formulario si estamos en modo edición
  useEffect(() => {
    if (etiquetaEdit) {
      setNombre(etiquetaEdit.nombre);
    } else {
      setNombre(''); // Si no estamos editando, limpiar el formulario
    }
  }, [etiquetaEdit]);

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nombre }); // Llamar a la función onSave con los datos del formulario
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nombre">Nombre de la Etiqueta:</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {etiquetaEdit ? 'Actualizar Etiqueta' : 'Crear Etiqueta'}
      </button>
    </form>
  );
}

export default EtiquetaForm;
