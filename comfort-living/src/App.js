import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import RegisterPage from './components/register';
import PrivateRoute from './components/PrivateRoute';
import AdminPage from './admin/Adminpage'; // Adjusted import path
import WoningToevoegen from './admin/Woningtoevoegen';
import Userpage from './admin/Userpage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Homepage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/woningtoevoegen" element={<WoningToevoegen />} />
          <Route path="/userpage" element={<Userpage />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
