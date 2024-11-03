import React, { useState, useEffect } from 'react';

function EstadoForm({ onSave, estadoEdit }) {
  const [nombre, setNombre] = useState(''); // Estado para almacenar el nombre del estado

  // useEffect para cargar los datos del estado seleccionado en el formulario
  useEffect(() => {
    if (estadoEdit) {
      setNombre(estadoEdit.nombre); // Cargar el nombre del estado a editar
    } else {
      setNombre(''); // Limpiar el formulario si no hay estado para editar
    }
  }, [estadoEdit]);

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const estadoData = { nombre }; // Crea un objeto con los datos del estado

    onSave(estadoData); // Llama a la función onSave pasada desde el componente padre
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre del Estado</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        {estadoEdit ? 'Actualizar Estado' : 'Crear Estado'}
      </button>
    </form>
  );
}

export default EstadoForm;
