// Footer.js
import React from 'react';
import { Navbar } from 'react-bootstrap'; // Importamos Navbar para mantener consistencia en el diseño

const Footer = () => {
    return (
        <Navbar bg="dark" variant="dark" fixed="bottom" className="text-center">
            <Navbar.Text className="w-100" style={{ color: '#00e0ff' }}>
                © 2024 Deyson Marín
            </Navbar.Text>
        </Navbar>
    );
};

export default Footer;
