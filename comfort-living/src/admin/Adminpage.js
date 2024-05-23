import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Woningtoevoegen from './Woningtoevoegen';
import './Adminpage.css';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="woningtoevoegen" element={<Woningtoevoegen />} />
          {/* You can add more routes here for Residents, Residences, and Request */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
