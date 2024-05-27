import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import Login from './components/Login';
import RegisterPage from './components/register';
import VerifyEmail from './components/VerifyEmail';
import PrivateRoute from './components/PrivateRoute';
import AdminPage from './admin/Adminpage'; // Adjusted import path
import WoningToevoegen from './admin/Woningtoevoegen';
import Woningen from './admin/Woningen';
import WoningDetails from './admin/Woningdetail'; // Import the new component
import Userpage from './admin/Userpage';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/woningtoevoegen" element={<WoningToevoegen />} />
          <Route path="/woningen" element={<Woningen />} />
          <Route path="/woning/:id" element={<WoningDetails />} /> {/* New route */}
          <Route path="/userpage" element={<Userpage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
