import React from 'react';

const PrioridadList = ({ prioridades, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th> {/* Nueva columna para mostrar el ID */}
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prioridades.length > 0 ? (
            prioridades.map((prioridad) => (
              <tr key={prioridad.id_prioridad}>
                <td>{prioridad.id_prioridad}</td> {/* Mostrar el ID de la prioridad */}
                <td>{prioridad.nombre}</td>
                <td>
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => onEdit(prioridad)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(prioridad.id_prioridad)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center"> {/* Ajustar el colspan para reflejar la nueva columna */}
                No hay prioridades disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PrioridadList;
