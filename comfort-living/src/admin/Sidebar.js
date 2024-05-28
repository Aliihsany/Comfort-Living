import React from 'react';
import { Link } from 'react-router-dom';
import './css/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <a href="/"><FontAwesomeIcon icon={faArrowLeft} /></a>
      <Link to="/woningtoevoegen">Voeg Woning</Link>
      <Link to="/userpage">Gebruikers</Link>
      <Link to="/woningen">Bekijk Woning</Link>
    </div>
  );
};

export default Sidebar;
