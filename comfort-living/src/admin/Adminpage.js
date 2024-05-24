import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Woningtoevoegen from './Woningtoevoegen';
import Userpage from './Userpage';
import './Adminpage.css';

const Adminpage = () => {
  return (
    <div className="admin-page">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="woningtoevoegen" element={<Woningtoevoegen />} />
          <Route path="userpage" element={<Userpage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Adminpage;
