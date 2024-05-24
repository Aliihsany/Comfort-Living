import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [dropdown, setDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleMouseEnter = (menu) => {
    setDropdown(menu);
  };

  const handleMouseLeave = () => {
    setDropdown(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header>
      <div className="logo">
        <img src="../assets/logo.jpg" alt="Logo" />
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li onMouseEnter={() => handleMouseEnter('ikhuur')} onMouseLeave={handleMouseLeave}>
            <a href="#">Ik huur</a>
            {dropdown === 'ikhuur' && (
              <ul className="dropdown">
                <li><a href="#">Huurdersportaal</a></li>
                <li><a href="#">Persoonlijke gegevens</a></li>
                <li><a href="#">Inloggegevens kwijt?</a></li>
                <li><a href="#">Mijn documenten</a></li>
              </ul>
            )}
          </li>
          <li onMouseEnter={() => handleMouseEnter('ikzoek')} onMouseLeave={handleMouseLeave}>
            <a href="#">Ik zoek</a>
            {dropdown === 'ikzoek' && (
              <ul className="dropdown">
                <li><a href="#">Contractinformatie</a></li>
                <li><a href="#">Puntenwaardering van uw woning</a></li>
                <li><a href="#">Huurprijs</a></li>
                <li><a href="#">Huur overeenkomst op 2 namen zetten</a></li>
                <li><a href="#">Onderhuur</a></li>
                <li><a href="#">Uit elkaar</a></li>
              </ul>
            )}
          </li>
          <li><a href="#">Organisatie</a></li>
          <li><a href="#">Contact</a></li>
          <li>
            
          </li>
          {isLoggedIn ? (
            <li><button onClick={handleLogout} >Uitloggen</button></li>
          ) : (
            <li><button href="/login">Inloggen</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;