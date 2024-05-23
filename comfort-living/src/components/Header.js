import React from 'react'
import './Header.css';

function Header() {
  return (
    <div>
      <header>
  <div className="logo">
    <img src="../assets/logo.jpg" alt="Logo" />
  </div>
  <nav>
    <a href="#">Ik huur</a>
    <a href="#">Ik zoek</a>
    <a href="#">Organisatie</a>
    <a href="#">Contact</a>
    <input type="text" placeholder="Search" />
    <a href="#">Inloggen</a>
  </nav>
</header>
    </div>
  )
}

export default Header
