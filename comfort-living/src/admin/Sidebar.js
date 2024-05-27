import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <a href="/"><FontAwesomeIcon icon={faArrowLeft} /></a>
      <Link to="/woningtoevoegen">Add Residence</Link>
      <Link to="/userpage">Users</Link>
      <Link to="/woningen">View Residences</Link>
    </div>
  );
};

export default Sidebar;
