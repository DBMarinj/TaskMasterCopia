import React from 'react';

function EtiquetaList({ etiquetas, onEdit, onDelete }) {
  return (
    <div>
      <h2>Lista de Etiquetas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Verificar si etiquetas es un array válido antes de hacer el map */}
          {Array.isArray(etiquetas) && etiquetas.length > 0 ? (
            etiquetas.map((etiqueta) => (
              <tr key={etiqueta.id_etiqueta}>
                <td>{etiqueta.id_etiqueta}</td>
                <td>{etiqueta.nombre}</td>
                <td>
                  <button className="btn btn-primary mr-2" onClick={() => onEdit(etiqueta)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => onDelete(etiqueta.id_etiqueta)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay etiquetas disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EtiquetaList;
