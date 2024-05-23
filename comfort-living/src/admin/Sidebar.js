import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/admin/woningtoevoegen">Add Residence</Link>
      <Link to="/admin/residents">Residents</Link>
      <Link to="/admin/residences">Residences</Link>
      <Link to="/admin/request">Request</Link>
    </div>
  );
};

export default Sidebar;
