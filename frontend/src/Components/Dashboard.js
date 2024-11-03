import React, { useEffect, useState } from 'react'; // creamos hooks usestate (useEffect: llama axios, se activa cuando carga el componente)(useState: guarda en una vble de hook de estado, la inf. asociada al user) 
import { useNavigate, Link } from 'react-router-dom'; // combinamos los import de useNavigate y Link
import Menu from "./Menu"; // Importa el componente Menu
import Footer from "./Footer"; // Importa el componente Footer
import axios from 'axios';
import './styles.css'; // Importa el archivo de estilos

// desarrollando el componente
const Dashboard = ({ token }) => { // variable para la clase
    const [userInfo, setUserInfo] = useState(null);  // variable userInfo va a usar el hook setUserInfo y va a hacer null/guarda info que devuelve el endpoint
    const navigate = useNavigate(); // hook de navegación: navigate

    useEffect(() => {
        // usar el hook de estado para obtener la inf. del usuario
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/current-user/', { // esto es el endpoint de postman
                    headers: { Authorization: `Bearer ${token}` } // este es la autorización, el Bearer token de postman
                });
                setUserInfo(response.data); // verifica el endpoint y el token, guarda los datos del usuario en userInfo
                console.log(response.data); // imprime la información obtenida del usuario
            } catch (error) {
                console.error('Error fetching user info:', error); // captura y muestra errores
            }
        };
        fetchUserInfo();
    }, [token]); // se ejecuta cada vez que el token cambia

    // Si no se ha cargado la información del usuario, muestra un mensaje de carga
    if (!userInfo) {
        return <div>Cargando información del usuario...</div>;
    }

    return (
        <div className="dashboard-wrapper login-board bg-light-green" style={{ paddingTop: '50px' }}> {/* Ajuste de padding superior y fondo en verde pastel */}
            <Menu userInfo={userInfo} /> {/* pasa el userInfo al componente Menu */}

            <div className="container mt-4">
                <div className="card bg-white"> {/* Fondo de la tarjeta envolvente a blanco */}
                    <div className="card-body">

                        {/* Card que envuelve el título y el nombre del usuario */}
                        <div className="card bg-beige text-white mb-4"> {/* Cambiado fondo a bg-beige para armonizar con el verde pastel */}
                            <div className="card-body text-center">
                                {/* Título de bienvenida con el nombre del usuario */}
                                <h1 className="my-4 dashboard-title">Bienvenido al Dashboard</h1> 
                                <h2 className="user-name">
                                    {userInfo.nombre} {userInfo.apellido}
                                </h2> {/* Nombre del usuario en azul neón */}
                            </div>
                        </div>

                        {/* Nueva tarjeta que envuelve las opciones de Usuario y Tareas */}
                        <div className="card mb-4 text-center bg-beige"> {/* Fondo beige */}
                            <div className="card-header">
                                <h4 className="dashboard-title-dark">GESTIONAR USUARIO - TAREAS</h4>
                                <hr className="bg-white" /> {/* Cambia el color a blanco */}
                            </div>
                            <div className="card-body">
                                <div className="row mt-5">

                                    {/* Card de Usuario */}
                                    <div className="col-md-6 mb-4">
                                        <div className="card bg-beige text-dark h-100 text-center"> {/* Cambiado a bg-beige */}
                                            <div className="card-header card-title text-uppercase"> 
                                                <h5 className="dashboard-title">USUARIO</h5> 
                                                <hr className="bg-white" />  {/* Cambia el color a blanco */}
                                            </div>
                                            <div className="card-body">
                                                <ul className="list-unstyled">
                                                    <li className="mb-3">
                                                        <Link to="/user-update" className="custom-link-black">
                                                            Editar Perfil
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/change-password" className="custom-link-black">
                                                            Cambiar Contraseña
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card de Tareas */}
                                    <div className="col-md-6 mb-4">
                                        <div className="card bg-beige text-dark h-100 text-center"> {/* Cambiado a bg-beige */}
                                            <div className="card-header card-title text-uppercase">
                                                <h5 className="dashboard-title">TAREAS</h5> 
                                                <hr className="bg-white" />  {/* Cambia el color a blanco */}
                                            </div>
                                            <div className="card-body">
                                                <ul className="list-unstyled">
                                                    <li className="mb-3">
                                                        <Link to="/tareas" className="custom-link-black">
                                                            Gestionar Tareas
                                                        </Link>
                                                    </li>
                                                    <li className="mb-3">
                                                        <Link to="/etiquetas" className="custom-link-black">
                                                            Etiquetas
                                                        </Link>
                                                    </li>
                                                    <li className="mb-3">
                                                        <Link to="/prioridades" className="custom-link-black">
                                                            Prioridades
                                                        </Link>
                                                    </li>
                                                    <li className="mb-3">
                                                        <Link to="/estados" className="custom-link-black">
                                                            Estados
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/kanban" className="custom-link-black">
                                                            Tablero Kanban
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="card mt-4 bg-light" style={{ marginBottom: '80px' }}> {/* Ajuste de margen inferior */}</div>
            <Footer /> {/* Añade el componente Footer */}
        </div>
    );
};

export default Dashboard;
