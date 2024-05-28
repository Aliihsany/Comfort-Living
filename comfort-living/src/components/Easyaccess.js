import React from 'react';
import { Link } from 'react-router-dom';
import './css/Easyaccess.css';

const Easyaccess = () => {
  return (
    <div className="easy-access">
      <Link to="/reparatie" className="easy-access-item">
        <i className="fas fa-wrench"></i>
        <p>Reparatie doorgeven</p>
      </Link>
      <Link to="/overlast" className="easy-access-item">
        <i className="fas fa-exclamation-triangle"></i>
        <p>Overlast doorgeven</p>
      </Link>
      <Link to="/abonnement" className="easy-access-item">
        <i className="fas fa-hammer"></i>
        <p>Abonnement voor onderhoud</p>
      </Link>
      <Link to="/woning" className="easy-access-item">
        <i className="fas fa-home"></i>
        <p>Woning zoeken</p>
      </Link>
    </div>
  );
};

export default Easyaccess;