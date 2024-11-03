import React from 'react';

function EstadoList({ estados, onEdit, onDelete }) {
  return (
    <div>
      <h4>Lista de Estados</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estados.length > 0 ? (
            estados.map((estado) => (
              <tr key={estado.id_estado}>
                <td>{estado.id_estado}</td>
                <td>{estado.nombre}</td>
                <td>
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => onEdit(estado)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(estado.id_estado)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No hay estados disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EstadoList;
