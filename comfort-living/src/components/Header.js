import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <img src="../assets/logo.jpg" alt="Logo" />
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
        <a href="#">Ik huur</a>
        <a href="#">Ik zoek</a>
        <a href="#">Organisatie</a>
        <a href="#">Contact</a>
        <input type="text" placeholder="Search" />
        <a href="#">Inloggen</a>
      </nav>
    </header>
  );
};

export default Header;

