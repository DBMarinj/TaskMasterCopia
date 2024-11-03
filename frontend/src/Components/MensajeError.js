import React from 'react';

const MensajeError = ({ message }) => {
    return (
        <div className="alert alert-danger mt-3" role="alert">
            {message/* acá imprime el error */}
        </div>
    );
};
 
export default MensajeError;
